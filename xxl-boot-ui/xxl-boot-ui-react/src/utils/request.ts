/**
 * request - HTTP 请求工具（axios 封装）
 *
 * 能力：
 *   - 请求拦截：token 注入 / 参数序列化（数组 key[]=、嵌套对象展开）/ POST/PUT 防重复提交
 *   - 响应拦截：301 重新登录弹窗 / 业务码统一处理 / HTTP 异常中文提示
 */
import { Modal, message } from 'antd';
import type { AxiosRequestConfig } from 'axios';
import axios from 'axios';
import { getToken, getTokenKeyHeader, removeToken } from './auth';

/** 与后端约定的响应数据格式（xxl-boot Response 结构） */
export interface ResponseStructure<T = unknown> {
  code: number;
  msg?: string;
  data?: T;
}

// 301 重新登录弹窗防重复标志
const isRelogin = { show: false };

// 防重复提交快照存储 key
const REPEAT_SUBMIT_STORAGE_KEY = 'sessionObj';

/**
 * 参数序列化：
 *   - 数组：输出 key[]=v1&key[]=v2（后端 List 参数兼容）
 *   - 嵌套对象：展开为 key[sub]=v
 *   - 忽略：null/''/undefined
 */
const serializeParams = (params: Record<string, unknown>): string => {
  const parts: string[] = [];
  const build = (key: string, value: unknown) => {
    if (value === null || value === undefined || value === '') return;
    if (Array.isArray(value)) {
      value.forEach((v) => {
        build(`${key}[]`, v);
      });
    } else if (typeof value === 'object') {
      Object.keys(value as object).forEach((k) => {
        build(`${key}[${k}]`, (value as Record<string, unknown>)[k]);
      });
    } else {
      parts.push(
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
      );
    }
  };
  Object.keys(params || {}).forEach((k) => {
    build(k, params[k]);
  });
  return parts.join('&');
};

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API || '/api',
  timeout: 10000,
  paramsSerializer: (params) =>
    serializeParams(params as Record<string, unknown>),
});

// 请求拦截器
service.interceptors.request.use((config) => {
  const headers = (config.headers || {}) as Record<string, unknown>;

  // 0. 携带自定义元数据（skipErrorHandler：跳过错误弹窗，供登录检查等场景使用）
  const skipErrorHandler = headers.skipErrorHandler === true;
  if (skipErrorHandler) {
    (config as { metadata?: { skipErrorHandler: boolean } }).metadata = {
      skipErrorHandler: true,
    };
  }

  // 1. Token 注入（isToken=false 时跳过，用于登录等无需鉴权的接口）
  const isToken = headers.isToken === false;
  if (getToken() && !isToken) {
    headers[getTokenKeyHeader()] = getToken();
  }
  delete headers.isToken;
  delete headers.repeatSubmit;
  delete headers.skipErrorHandler;

  // 2. 防重复提交（POST/PUT，repeatSubmit=false 时跳过）
  const isRepeatSubmit = headers.repeatSubmit === false;
  if (
    !isRepeatSubmit &&
    (config.method === 'post' || config.method === 'put') &&
    config.data &&
    !(config.data instanceof FormData) &&
    !(config.data instanceof Blob)
  ) {
    const interval = Number(headers.interval) || 1000;
    const requestObj = {
      url: config.url,
      data:
        typeof config.data === 'object'
          ? JSON.stringify(config.data)
          : config.data,
      params: config.params ? JSON.stringify(config.params) : undefined,
      time: Date.now(),
    };
    const sessionObj = JSON.parse(
      sessionStorage.getItem(REPEAT_SUBMIT_STORAGE_KEY) || 'null',
    );
    if (
      sessionObj &&
      sessionObj.url === requestObj.url &&
      sessionObj.params === requestObj.params &&
      sessionObj.data === requestObj.data &&
      sessionObj.time != null &&
      requestObj.time - sessionObj.time < interval
    ) {
      message.warning('数据正在处理，请勿重复提交');
      return Promise.reject(new Error('数据正在处理，请勿重复提交'));
    }
    sessionStorage.setItem(
      REPEAT_SUBMIT_STORAGE_KEY,
      JSON.stringify(requestObj),
    );
  }

  return config;
});

// 响应拦截器
service.interceptors.response.use(
  // 返回解包后的业务数据，供 request<T> 使用
  (response): any => {
    const res = response.data as ResponseStructure;
    const code = res?.code ?? 200;
    const metadata = (
      response.config as { metadata?: { skipErrorHandler: boolean } }
    ).metadata;
    const skipErrorHandler = metadata?.skipErrorHandler === true;

    // 301：会话过期，弹出重新登录确认框（防重复弹窗）
    if (code === 301) {
      if (skipErrorHandler) {
        return Promise.reject(
          new Error('无效的会话，或者会话已过期，请重新登录。'),
        );
      }
      if (!isRelogin.show) {
        isRelogin.show = true;
        Modal.confirm({
          title: '系统提示',
          content: '登录状态已过期，您可以继续留在该页面，或者重新登录',
          okText: '重新登录',
          cancelText: '取消',
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
      return Promise.reject(
        new Error('无效的会话，或者会话已过期，请重新登录。'),
      );
    }

    // 其他非成功码（非200）
    if (code !== 200) {
      if (!skipErrorHandler) {
        message.error(res?.msg || '系统未知错误，请反馈给管理员');
      }
      return Promise.reject(new Error(res?.msg || 'error'));
    }

    // 业务成功：返回 { code, msg, data }
    return res;
  },
  // HTTP 层异常
  (error) => {
    let msg = String(error?.message || '');
    if (msg === 'Network Error') {
      msg = '后端接口连接异常';
    } else if (msg.includes('timeout')) {
      msg = '系统接口请求超时';
    } else if (msg.includes('Request failed with status code')) {
      msg = `系统接口${msg.slice(-3)}异常`;
    }
    message.error(msg);
    return Promise.reject(error);
  },
);

/**
 * 通用请求方法（业务接口统一入口）
 * 成功（code=200）时返回后端 Response 结构（含 code/msg/data）
 * @param url    接口地址（如 /authz/user/pageList）
 * @param config axios 请求配置（含自定义 headers：isToken/repeatSubmit/skipErrorHandler）
 */
export function request<T = ResponseStructure>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<T> {
  return service.request({ ...config, url }) as Promise<T>;
}

export default service;
