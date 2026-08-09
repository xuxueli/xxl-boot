/**
 * 名称：审计日志 API
 * 能力：提供日志分页、删除、导出相关接口。
 */
import { request } from '@/utils/request';

/**
 * 分页查询日志列表。
 * @param params 查询参数（current/pageSize/type/module/title）
 */
export async function pageList(params: {
  current?: number;
  pageSize?: number;
  type?: number;
  module?: number;
  title?: string;
}) {
  const { current = 1, pageSize = 10, ...rest } = params || {};
  return request<API.Response<API.PageModel<API.Log>>>('/system/log/pageList', {
    method: 'GET',
    params: {
      offset: (current - 1) * pageSize,
      pagesize: pageSize,
      ...rest,
    },
  });
}

/**
 * 加载日志详情。
 * @param id 日志 ID
 */
export async function getLog(id: number) {
  return request<API.Response<API.Log>>('/system/log/load', {
    method: 'GET',
    params: { id },
  });
}

/**
 * 删除日志。
 * @param ids 日志 ID 数组
 */
export async function delOperlog(ids: number[]) {
  return request<API.Response<unknown>>('/system/log/delete', {
    method: 'POST',
    params: { 'ids[]': ids },
  });
}
