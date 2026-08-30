/**
 * download - 通用文件下载工具（复用 request 的 axios service）
 *
 * 能力：
 *   - download：POST + form-urlencoded 提交下载请求，响应为 blob，触发浏览器下载
 *   - downloadGet：GET + query 参数下载（代码生成 zip 等）
 *
 * 说明：统一走 request service 拦截器（token 注入、超时、blob 透传），
 *       序列化采用扁平重复 key（下载类后端接口契约，如 ids=1&ids=2）。
 */
import { message } from 'antd';
import { blobValidate } from './common';
import service, { errorCode } from './request';

/**
 * 构建下载查询串（下载类接口契约）：
 *   - 数组：输出扁平重复 key（ids=1&ids=2，后端 @RequestParam List 兼容）
 *   - 嵌套对象：展开为 key[sub]=v
 *   - 忽略：null/''/undefined
 */
const buildParams = (params: Record<string, any>): string => {
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
 * @param blob        - 响应二进制流
 * @param filename    - 下载文件名
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
    const rspObj = JSON.parse(resText) as { code?: number; msg?: string };
    message.error(
      rspObj.msg ||
        errorCode[String(rspObj.code)] ||
        errorCode.default ||
        fallbackMsg,
    );
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
  service
    .post(url, params, {
      transformRequest: [(p) => buildParams(p)],
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      responseType: 'blob',
    })
    .then(async (res) => {
      // 响应拦截器对 blob 已透传为 Blob，断言后处理
      await handleBlob(res as unknown as Blob, filename, '下载文件出现错误，请联系管理员！');
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
  service
    .get(url, {
      params,
      paramsSerializer: (p) => buildParams(p),
      responseType: 'blob',
    })
    .then(async (res) => {
      // 响应拦截器对 blob 已透传为 Blob，断言后处理
      await handleBlob(res as unknown as Blob, filename, '下载文件出现错误，请联系管理员！');
    })
    .catch(() => {
      message.error('下载文件出现错误，请联系管理员！');
    });
}