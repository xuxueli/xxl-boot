/**
 * download - 通用文件下载工具
 *
 * 能力：
 *   - download：以 POST + form-urlencoded 提交下载请求，响应为 blob 二进制流，触发浏览器下载
 *   - downloadGet：以 GET + query 参数下载（代码生成 zip 等）
 */
import { message } from 'antd';
import { getToken } from './auth';
import { blobValidate } from './common';

/** 后端 API 前缀（与 request 保持一致） */
const BASE_URL = import.meta.env.VITE_APP_BASE_API || '/api';

/**
 * 构建查询字符串：数组输出重复 key（ids=1&ids=2），嵌套对象展开
 */
const buildQuery = (params: Record<string, any>): string => {
  const parts: string[] = [];
  const build = (key: string, value: any) => {
    if (value === null || value === undefined || value === '') return;
    if (Array.isArray(value)) {
      value.forEach((v) => {
        build(key, v);
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
 * 读取响应 blob，若为 JSON 错误报文则提示错误信息
 * @param blob     - 响应二进制流
 * @param filename - 下载文件名
 * @param fallbackMsg - 解析失败时的兜底文案
 */
async function handleBlob(
  blob: Blob,
  filename: string,
  fallbackMsg: string,
): Promise<void> {
  if (blobValidate(blob)) {
    // 正常文件内容，触发浏览器下载
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename || '';
    a.click();
    URL.revokeObjectURL(a.href);
    return;
  }
  // 服务端以 blob 格式返回了 JSON 错误报文
  try {
    const resText = await blob.text();
    const rspObj = JSON.parse(resText);
    message.error(rspObj.msg || fallbackMsg);
  } catch {
    message.error(fallbackMsg);
  }
}

/**
 * 通用文件下载（POST，form-urlencoded）
 * @param url      下载接口地址（如 /system/log/export）
 * @param params   请求参数
 * @param filename 保存到本地的文件名
 */
export function download(
  url: string,
  params: Record<string, any>,
  filename: string,
): void {
  const formBody = buildQuery(params);
  fetch(BASE_URL + url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'xxl-sso-login-token': getToken() || '',
    },
    body: formBody,
  })
    .then(async (res) => {
      const blob = await res.blob();
      if (blob.type === 'application/json' && !res.ok) {
        throw new Error('http_error');
      }
      await handleBlob(blob, filename, '下载文件出现错误，请联系管理员！');
    })
    .catch(() => {
      message.error('下载文件出现错误，请联系管理员！');
    });
}

/**
 * 通用文件下载（GET，query 参数）
 * @param url      下载接口地址（如 /tool/codegen/batchGenCode）
 * @param params   请求参数
 * @param filename 保存到本地的文件名
 */
export function downloadGet(
  url: string,
  params: Record<string, any>,
  filename: string,
): void {
  const query = buildQuery(params);
  fetch(BASE_URL + url + (query ? `?${query}` : ''), {
    method: 'GET',
    headers: {
      'xxl-sso-login-token': getToken() || '',
    },
  })
    .then(async (res) => {
      const blob = await res.blob();
      await handleBlob(blob, filename, '下载文件出现错误，请联系管理员！');
    })
    .catch(() => {
      message.error('下载文件出现错误，请联系管理员！');
    });
}
