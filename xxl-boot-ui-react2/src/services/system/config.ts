/**
 * 名称：配置管理 API
 * 能力：提供配置分页、增删改、按 key 加载接口。
 */
import { request } from '@/utils/request';

/**
 * 分页查询配置列表。
 * @param params 查询参数（current/pageSize/name/key/status）
 */
export async function listConfig(params: {
  current?: number;
  pageSize?: number;
  name?: string;
  key?: string;
  status?: number;
}) {
  const { current = 1, pageSize = 10, ...rest } = params || {};
  return request<API.Response<API.PageModel<API.Config>>>(
    '/system/config/pageList',
    {
      method: 'GET',
      params: {
        offset: (current - 1) * pageSize,
        pagesize: pageSize,
        ...rest,
      },
    },
  );
}

/**
 * 加载配置详情。
 * @param id 配置 ID
 */
export async function getConfig(id: number) {
  return request<API.Response<API.Config>>('/system/config/load', {
    method: 'GET',
    params: { id },
  });
}

/**
 * 按 key 加载配置。
 * @param key 配置 key
 */
export async function getConfigKey(key: string) {
  return request<API.Response<API.Config>>('/system/config/loadByKey', {
    method: 'GET',
    params: { key },
  });
}

/**
 * 新增配置（JSON 请求体）。
 * @param data 配置数据
 */
export async function addConfig(data: API.Config) {
  return request<API.Response<unknown>>('/system/config/insert', {
    method: 'POST',
    data,
  });
}

/**
 * 修改配置（JSON 请求体）。
 * @param data 配置数据
 */
export async function updateConfig(data: API.Config) {
  return request<API.Response<unknown>>('/system/config/update', {
    method: 'POST',
    data,
  });
}

/**
 * 删除配置。
 * @param ids 配置 ID 数组
 */
export async function delConfig(ids: number[]) {
  return request<API.Response<unknown>>('/system/config/delete', {
    method: 'POST',
    params: { 'ids[]': ids },
  });
}
