import { request } from '@/utils/request'
import type { Org, OrgQuery } from '@/types/api'
import type { Response } from '@/types'

/**
 * 名称：组织管理 API
 * 能力：提供组织树查询、组织维护与排序保存接口。
 */

/**
 * 查询组织树列表（扁平数组，前端需 handleTree 组装）。
 * @param query 查询参数（name/status，status 默认 -1 全部）。
 * @returns 组织列表。
 */
export function listOrg(query: OrgQuery): Promise<Response<Org[]>> {
  return request({
    url: '/authz/org/treeList',
    method: 'get',
    params: query
  })
}

/**
 * 查询组织详情。
 * @param id 组织 ID。
 * @returns 组织详情。
 */
export function getOrg(id: number): Promise<Response<Org>> {
  return request({
    url: '/authz/org/load',
    method: 'get',
    params: { id }
  })
}

/**
 * 新增组织。
 * @param data 组织数据。
 * @returns 新增结果。
 */
export function addOrg(data: Org): Promise<Response<unknown>> {
  return request({
    url: '/authz/org/insert',
    method: 'post',
    data: data
  })
}

/**
 * 更新组织。
 * @param data 组织数据。
 * @returns 更新结果。
 */
export function updateOrg(data: Org): Promise<Response<unknown>> {
  return request({
    url: '/authz/org/update',
    method: 'post',
    data: data
  })
}

/**
 * 保存组织排序（批量更新顺序，ids[]/orders[] 数组参数）。
 * @param data 排序数据（{ ids: [], orders: [] }）。
 * @returns 保存结果。
 */
export function updateOrgSort(data: { ids: number[]; orders: number[] }): Promise<Response<unknown>> {
  return request({
    url: '/authz/org/updateSort',
    method: 'post',
    params: { 'ids[]': data.ids, 'orders[]': data.orders }
  })
}

/**
 * 删除组织。
 * @param ids 组织 ID 或组织 ID 数组。
 * @returns 删除结果。
 */
export function delOrg(ids: number | number[]): Promise<Response<unknown>> {
  return request({
    url: '/authz/org/delete',
    method: 'post',
    params: { 'ids[]': ids }
  })
}
