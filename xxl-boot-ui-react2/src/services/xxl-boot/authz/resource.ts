/**
 * 名称：资源管理 API
 * 能力：提供资源树、增删改、排序相关接口。
 */
import { request } from '@/utils/request';

/**
 * 查询资源树列表。
 * @param params 查询参数（name/status）
 */
export async function listResource(params: { name?: string; status?: number }) {
  return request<API.Response<API.Resource[]>>('/authz/resource/treeList', {
    method: 'GET',
    params: { status: -1, ...params },
  });
}

/**
 * 加载资源详情。
 * @param id 资源 ID
 */
export async function getResource(id: number) {
  return request<API.Response<API.Resource>>('/authz/resource/load', {
    method: 'GET',
    params: { id },
  });
}

/**
 * 新增资源（后端以请求参数绑定实体）。
 * @param data 资源数据
 */
export async function addResource(data: API.Resource) {
  return request<API.Response<unknown>>('/authz/resource/insert', {
    method: 'POST',
    params: data,
  });
}

/**
 * 修改资源（后端以请求参数绑定实体）。
 * @param data 资源数据
 */
export async function updateResource(data: API.Resource) {
  return request<API.Response<unknown>>('/authz/resource/update', {
    method: 'POST',
    params: data,
  });
}

/**
 * 删除资源。
 * @param ids 资源 ID 数组
 */
export async function delResource(ids: number[]) {
  return request<API.Response<unknown>>('/authz/resource/delete', {
    method: 'POST',
    params: { 'ids[]': ids },
  });
}

/**
 * 更新资源排序。
 * @param ids    资源 ID 数组
 * @param orders 排序值数组
 */
export async function updateResourceSort(ids: number[], orders: number[]) {
  return request<API.Response<unknown>>('/authz/resource/updateSort', {
    method: 'POST',
    params: { 'ids[]': ids, 'orders[]': orders },
  });
}
