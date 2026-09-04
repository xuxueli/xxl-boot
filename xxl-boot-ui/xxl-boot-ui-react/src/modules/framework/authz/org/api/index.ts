/**
 * 名称：组织管理 API
 * 能力：提供组织树、增删改、排序相关接口。
 */
import { request } from '@/utils/request';

/**
 * 查询组织树列表。
 * @param params 查询参数（name/status）
 */
export async function listOrg(params: { name?: string; status?: number }) {
  return request<API.Response<API.Org[]>>('/authz/org/treeList', {
    method: 'GET',
    params: { status: -1, ...params },
  });
}

/**
 * 加载组织详情。
 * @param id 组织 ID
 */
export async function getOrg(id: number) {
  return request<API.Response<API.Org>>('/authz/org/load', {
    method: 'GET',
    params: { id },
  });
}

/**
 * 新增组织（JSON 请求体）。
 * @param data 组织数据
 */
export async function addOrg(data: API.Org) {
  return request<API.Response<unknown>>('/authz/org/insert', {
    method: 'POST',
    data,
  });
}

/**
 * 修改组织（JSON 请求体）。
 * @param data 组织数据
 */
export async function updateOrg(data: API.Org) {
  return request<API.Response<unknown>>('/authz/org/update', {
    method: 'POST',
    data,
  });
}

/**
 * 删除组织。
 * @param ids 组织 ID 数组
 */
export async function delOrg(ids: number[]) {
  return request<API.Response<unknown>>('/authz/org/delete', {
    method: 'POST',
    params: { ids },
  });
}

/**
 * 更新组织排序。
 * @param ids    组织 ID 数组
 * @param orders 排序值数组
 */
export async function updateOrgSort(ids: number[], orders: number[]) {
  return request<API.Response<unknown>>('/authz/org/updateSort', {
    method: 'POST',
    params: { ids, orders },
  });
}
