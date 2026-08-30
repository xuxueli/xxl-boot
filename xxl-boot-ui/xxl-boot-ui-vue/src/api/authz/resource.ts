import { request } from '@/utils/request'
import type { Resource, ResourceQuery } from '@/types/api'
import type { Response } from '@/types'

/**
 * 名称：资源管理 API
 * 能力：提供资源树查询、维护、排序及角色资源能力。
 */

/**
 * 查询资源树列表（扁平数据，由前端转树）。
 * @param query 查询参数（name/status）。
 * @returns 资源列表。
 */
export function listResource(query: ResourceQuery): Promise<Response<Resource[]>> {
  return request({
    url: '/authz/resource/treeList',
    method: 'get',
    params: query
  })
}

/**
 * 查询资源详情。
 * @param id 资源 ID。
 * @returns 资源详情。
 */
export function getResource(id: number): Promise<Response<Resource>> {
  return request({
    url: '/authz/resource/load',
    method: 'get',
    params: { id }
  })
}

/**
 * 新增资源（后端以请求参数绑定实体）。
 * @param data 资源数据。
 * @returns 新增结果。
 */
export function addResource(data: Resource): Promise<Response<unknown>> {
  return request({
    url: '/authz/resource/insert',
    method: 'post',
    params: data
  })
}

/**
 * 修改资源（后端以请求参数绑定实体）。
 * @param data 资源数据。
 * @returns 修改结果。
 */
export function updateResource(data: Resource): Promise<Response<unknown>> {
  return request({
    url: '/authz/resource/update',
    method: 'post',
    params: data
  })
}

/**
 * 批量更新资源排序。
 * @param ids    资源 ID 列表。
 * @param orders 排序值列表（与 ids 一一对应）。
 * @returns 保存结果。
 */
export function updateResourceSort(ids: number[], orders: number[]): Promise<Response<unknown>> {
  return request({
    url: '/authz/resource/updateSort',
    method: 'post',
    params: { ids, orders }
  })
}

/**
 * 删除资源。
 * @param ids 资源 ID 或资源 ID 数组。
 * @returns 删除结果。
 */
export function delResource(ids: number | number[]): Promise<Response<unknown>> {
  return request({
    url: '/authz/resource/delete',
    method: 'post',
    params: { ids: Array.isArray(ids) ? ids : [ids] }
  })
}
