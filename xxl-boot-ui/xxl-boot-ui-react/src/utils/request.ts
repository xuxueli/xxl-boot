/**
 * request - HTTP 请求工具（axios 封装）
 *
 * 能力：
 *   - 请求拦截：token 注入 / 参数序列化（数组 key[]=、嵌套对象展开）/ POST/PUT 防重复提交
 *   - 响应拦截：301 重新登录弹窗 / 业务码统一提示 / HTTP 异常中文提示
 */
import { Modal, message } from 'antd';
import type { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';
import { getToken, getTokenKeyHeader, removeToken } from './auth';
import { tansParams } from './common';
import { t } from '@/i18n';

/** 请求自定义 header 属性：登录/防重提交/静默错误等接口级开关 */
interface CustomHeaders {
  /** 是否跳过 token 注入（false 时跳过，用于登录等无需鉴权的接口） */
  isToken?: boolean;
  /** 是否跳过防重复提交（false 时放行，用于允许重复提交的接口） */
  repeatSubmit?: boolean;
  /** 重复提交判定间隔（默认 1000ms，可在请求级自定义） */
  interval?: number;
  /** 跳过错误弹窗（供登录检查等静默场景使用） */
  skipErrorHandler?: boolean;
}

/** 请求配置：原生 axios 配置 + 自定义 header 与元数据 */
export type RequestConfig = AxiosRequestConfig & {
  headers?: AxiosRequestConfig['headers'] & CustomHeaders;
  metadata?: { skipErrorHandler?: boolean };
};

/** 防重复提交快照 */
interface RepeatSnapshot {
  url?: string | null;
  data?: string | null;
  params?: string | null;
  time?: number;
}

// 301 重新登录弹窗防重复标志
const isRelogin = { show: false };

// 防重复提交快照存储 key
const REPEAT_SUBMIT_STORAGE_KEY = 'sessionObj';

// 跳过大文件防重复提交阈值（5MB）
const REPEAT_SUBMIT_MAX_SIZE = 5 * 1024 * 1024;

// 错误码映射表：后端业务码 → 前端展示文案
export const errorCode: Record<string, string> = {
  301: t('request.err301'),
  403: t('request.err403'),
  404: t('request.err404'),
  default: t('request.errDefault'),
};

// ==================== 创建 axios 实例（拦截器） ====================

/**
 * 定义 axios 实例
 *   - baseURL：后端接口基础地址（VITE_APP_BASE_API）
 *   - timeout：请求超时（10s）
 *   - paramsSerializer：参数序列化（公共 tansParams，支持数组 key[]=、嵌套对象展开）
 */
const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 10000,
  paramsSerializer: (params) =>
    tansParams(params as Record<string, any>).replace(/&$/, ''),
});

/**
 * 请求拦截器
 *   - token 注入（isToken=false 时跳过，用于登录等无需鉴权的接口）
 *   - 防重复提交（POST/PUT，FormData/Blob 与 5MB 以上大请求不校验，repeatSubmit=false 时跳过）
 */
service.interceptors.request.use((config) => {
  const requestConfig = config as InternalAxiosRequestConfig & {
    metadata?: { skipErrorHandler?: boolean };
  };
  const headers = config.headers as unknown as CustomHeaders;

  // 自定义开关：跳过 token / 防重复提交、判定间隔、跳过错误弹窗
  const isToken = headers.isToken === false;
  const isRepeatSubmit = headers.repeatSubmit === false;
  const interval = Number(headers.interval) || 1000;

  // 自定义元数据随请求传递，供响应拦截读取（跳过错误弹窗等）
  requestConfig.metadata = {
    skipErrorHandler: headers.skipErrorHandler === true,
  };

  // 1. Token 注入
  if (getToken() && !isToken) {
    config.headers[getTokenKeyHeader()] = getToken();
  }

  // 2. 防重复提交（POST/PUT）
  if (
    !isRepeatSubmit &&
    (config.method === 'post' || config.method === 'put') &&
    config.data
  ) {
    // FormData / Blob 无法序列化比对，跳过
    if (config.data instanceof FormData || config.data instanceof Blob)
      return config;

    // 请求快照
    const snapshot = {
      url: config.url,
      data:
        typeof config.data === 'object'
          ? JSON.stringify(config.data)
          : config.data,
      params: config.params ? JSON.stringify(config.params) : undefined,
      time: Date.now(),
    } satisfies RepeatSnapshot;

    // 5MB 以上大请求跳过防重校验，直接放行
    if (JSON.stringify(snapshot).length >= REPEAT_SUBMIT_MAX_SIZE)
      return config;

    // 快照比对：同 url + params + data 且间隔小于 interval 判定为重复
    const last = JSON.parse(
      sessionStorage.getItem(REPEAT_SUBMIT_STORAGE_KEY) || 'null',
    ) as RepeatSnapshot | null;
    if (
      last &&
      last.url === snapshot.url &&
      last.params === snapshot.params &&
      last.data === snapshot.data &&
      last.time != null &&
      snapshot.time - last.time < interval
    ) {
      message.warning(t('request.repeatSubmit'));
      return Promise.reject(new Error(t('request.repeatSubmit')));
    }
    sessionStorage.setItem(REPEAT_SUBMIT_STORAGE_KEY, JSON.stringify(snapshot));
  }

  return config;
});

/**
 * 响应拦截器
 *      - 1、blob/arraybuffer 透传
 *      - 2、301：会话过期，弹出重新登录确认框（防重复弹窗）
 *      - 3、非 200：错误码映射文案统一提示（skipErrorHandler 时静默）
 *      - 4、200：返回后端 Response 结构
 */
service.interceptors.response.use(
  // 返回业务数据结构（axios 拦截器类型固定为 AxiosResponse，此处按业务约定解包）
  (response): any => {
    const res = response.data as API.Response;
    const code = res?.code ?? 200;
    const metadata = (response.config as RequestConfig).metadata;
    const skipErrorHandler = metadata?.skipErrorHandler === true;

    // 1. blob / arraybuffer 透传：文件下载接口返回二进制流，不做业务码解析
    const responseType = (response.config as RequestConfig).responseType;
    if (responseType === 'blob' || responseType === 'arraybuffer') {
      return response.data;
    }

    // 2. 301：会话过期
    if (code === 301) {
      if (!isRelogin.show) {
        isRelogin.show = true;
        Modal.confirm({
          title: t('modal.title'),
          content: t('request.sessionExpired'),
          okText: t('request.relogin'),
          cancelText: t('modal.cancelButton'),
          onOk: () => {
            isRelogin.show = false;
            removeToken();
            window.location.href = `/login?redirect=${window.location.pathname}`;
          },
          onCancel: () => {
            isRelogin.show = false;
          },
        });
      }
      return Promise.reject(new Error(errorCode[301]));
    }

    // 3. 其他非成功码（非200）
    if (code !== 200) {
      const msg = res?.msg || errorCode[String(code)] || errorCode.default;
      if (!skipErrorHandler) message.error(msg);
      return Promise.reject(new Error(msg));
    }

    // 4. 业务成功：返回 { code, msg, data }
    return res;
  },
  // HTTP 层异常
  (error) => {
    let msg = String(error?.message || '');
    if (msg === 'Network Error') {
      msg = t('request.networkError');
    } else if (msg.includes('timeout')) {
      msg = t('request.timeout');
    } else if (msg.includes('Request failed with status code')) {
      msg = t('request.httpError', [msg.slice(-3)]);
    }
    message.error(msg);
    return Promise.reject(error);
  },
);

// ==================== 通用请求方法（泛型） ====================

/**
 * 通用请求方法（业务接口统一入口）
 *
 * 返回 `Promise<Response<T>>`：
 *   - 成功（code=200）时已解包为 response.data（含 code/msg/data）
 *   - 调用方通过 response.data 取业务数据（分页列表在 response.data.data）
 *
 * @param url    接口地址（如 /authz/user/pageList）
 * @param config axios 请求配置（含自定义 headers：isToken/repeatSubmit/interval/skipErrorHandler）
 */
export function request<T = API.Response>(
  url: string,
  config?: RequestConfig,
): Promise<T> {
  return service.request({ ...config, url }) as Promise<T>;
}

export default service;
