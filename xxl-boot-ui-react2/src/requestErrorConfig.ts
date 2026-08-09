import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import { history } from '@umijs/max';
import { Modal, message } from 'antd';
import { getToken, getTokenKeyHeader, removeToken } from '@/utils/auth';

// 与后端约定的响应数据格式（xxl-boot Response 结构）
interface ResponseStructure {
  code: number;
  data: unknown;
  msg?: string;
}

// 301 重新登录弹窗防重复标志
const isRelogin = { show: false };

// 防重复提交快照存储 key
const REPEAT_SUBMIT_STORAGE_KEY = 'sessionObj';

/**
 * 参数序列化：
 *   - 数组输出 key[]=v1&key[]=v2（后端 List 参数兼容）
 *   - 嵌套对象展开为 key[sub]=v
 *   - 忽略 null/''/undefined
 */
const serializeParams = (params: Record<string, any>): string => {
  const parts: string[] = [];
  const build = (key: string, value: any) => {
    if (value === null || value === undefined || value === '') return;
    if (Array.isArray(value)) {
      value.forEach((v) => {
        build(`${key}[]`, v);
      });
    } else if (typeof value === 'object') {
      Object.keys(value).forEach((k) => {
        build(`${key}[${k}]`, value[k]);
      });
    } else {
      parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    }
  };
  Object.keys(params || {}).forEach((k) => {
    build(k, params[k]);
  });
  return parts.join('&');
};

/**
 * @name 错误处理
 * 适配 xxl-boot 后端 Response 结构（code=200 成功，code=301 会话过期）
 */
export const errorConfig: RequestConfig = {
  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    errorThrower: (res) => {
      const { code, data, msg } = res as unknown as ResponseStructure;
      if (code !== 200) {
        const error: any = new Error(msg);
        error.name = 'BizError';
        error.info = { code, data, msg };
        throw error; // 抛出自制的错误
      }
    },
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      // 我们的 errorThrower 抛出的错误。
      if (error.name === 'BizError') {
        const errorInfo: ResponseStructure | undefined = error.info;
        if (errorInfo) {
          const { msg, code } = errorInfo;
          // 301：会话过期，弹出重新登录确认框（防重复弹窗）
          if (code === 301) {
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
                  history.replace(
                    `/user/login?redirect=${window.location.pathname}`,
                  );
                },
                onCancel: () => {
                  isRelogin.show = false;
                },
              });
            }
            return;
          }
          message.error(msg || '系统未知错误，请反馈给管理员');
        }
      } else if (error.response) {
        // Axios 的错误：请求成功发出且服务器响应了状态码，但状态代码超出了 2xx 的范围
        const status = error.response.status;
        message.error(`系统接口${status}异常`);
      } else if (typeof navigator !== 'undefined' && !navigator.onLine) {
        message.error('后端接口连接异常');
      } else if (error.request) {
        if (String(error.message || '').includes('timeout')) {
          message.error('系统接口请求超时');
        } else {
          message.error('后端接口连接异常');
        }
      } else {
        message.error('系统未知错误，请反馈给管理员');
      }
    },
  },

  // 参数序列化：数组/嵌套对象兼容后端参数绑定
  paramsSerializer: (params) => serializeParams(params as Record<string, any>),

  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      const headers = config.headers as Record<string, any>;

      // 1. Token 注入（isToken=false 时跳过，用于登录等无需鉴权的接口）
      const isToken = headers?.isToken === false;
      if (getToken() && !isToken) {
        config.headers = {
          ...headers,
          [getTokenKeyHeader()]: getToken(),
        };
      }

      // 2. 防重复提交（POST/PUT，repeatSubmit=false 时跳过）
      const isRepeatSubmit = headers?.repeatSubmit === false;
      if (
        !isRepeatSubmit &&
        (config.method === 'post' || config.method === 'put')
      ) {
        const interval = Number(headers?.interval) || 1000;
        if (
          config.data &&
          !(config.data instanceof FormData) &&
          !(config.data instanceof Blob)
        ) {
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
            // 重复提交
            message.warning('数据正在处理，请勿重复提交');
            return Promise.reject(new Error('数据正在处理，请勿重复提交'));
          }
          sessionStorage.setItem(
            REPEAT_SUBMIT_STORAGE_KEY,
            JSON.stringify(requestObj),
          );
        }
      }

      return config;
    },
  ],

  // 响应拦截器
  responseInterceptors: [],
};
