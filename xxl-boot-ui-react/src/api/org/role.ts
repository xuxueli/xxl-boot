import { request } from '@/utils/request'
import type { Role, RoleListQuery } from '@/types/api'
import type { PageModel, Response } from '@/types'

/**
 * 名称：角色管理 API
 * 能力：提供角色维护、角色资源授权与角色用户授权管理接口。
 */

/**
 * 分页查询角色列表。
 * @param query 查询参数（offset/pagesize/name/status）。
 * @returns 角色分页列表（response.data.data / response.data.total）。
 */
export function listRole(query: RoleListQuery): Promise<Response<PageModel<Role>>> {
  return request({
    url: '/org/role/pageList',
    method: 'get',
    params: query
  })
}

/**
 * 查询角色详情。
 * @param id 角色 ID。
 * @returns 角色详细信息。
 */
export function getRole(id: number): Promise<Response<Role>> {
  return request({
    url: '/org/role/load',
    method: 'get',
    params: { id }
  })
}

/**
 * 新增角色（后端以请求参数绑定实体）。
 * @param data 角色数据。
 * @returns 新增结果。
 */
export function addRole(data: Role): Promise<Response<unknown>> {
  return request({
    url: '/org/role/insert',
    method: 'post',
    params: data
  })
}

/**
 * 修改角色（后端以请求参数绑定实体）。
 * @param data 角色数据。
 * @returns 修改结果。
 */
export function updateRole(data: Role): Promise<Response<unknown>> {
  return request({
    url: '/org/role/update',
    method: 'post',
    params: data
  })
}

/**
 * 删除角色。
 * @param ids 角色 ID 或角色 ID 数组。
 * @returns 删除结果。
 */
export function delRole(ids: number | number[]): Promise<Response<unknown>> {
  return request({
    url: '/org/role/delete',
    method: 'post',
    params: { 'ids[]': ids }
  })
}

/**
 * 根据角色 ID 查询角色资源。
 * @param roleId 角色 ID。
 * @returns 角色资源 ID 列表（response.data）。
 */
export function roleMenuTreeselect(roleId: number): Promise<Response<number[]>> {
  return request({
    url: '/org/role/loadRoleRes',
    method: 'get',
    params: { roleId }
  })
}

/**
 * 更新角色资源授权。
 * @param roleId      角色 ID。
 * @param resourceIds 资源 ID 列表。
 * @returns 保存结果。
 */
export function updateRoleRes(roleId: number, resourceIds: number[]): Promise<Response<unknown>> {
  return request({
    url: '/org/role/updateRoleRes',
    method: 'post',
    params: { roleId, 'resourceIds[]': resourceIds }
  })
}
