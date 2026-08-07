import request from '@/utils/request'

/**
 * 名称：角色管理 API
 * 能力：提供角色维护、角色资源授权与角色用户授权管理接口。
 */

/**
 * 分页查询角色列表。
 * @param {Object} query 查询参数（offset/pagesize/name/status）。
 * @returns {Promise<any>} 角色分页列表（response.data.data / response.data.total）。
 */
export function listRole(query) {
  return request({
    url: '/org/role/pageList',
    method: 'get',
    params: query
  })
}

/**
 * 查询角色详情。
 * @param {string|number} id 角色 ID。
 * @returns {Promise<any>} 角色详细信息。
 */
export function getRole(id) {
  return request({
    url: '/org/role/load',
    method: 'get',
    params: { id }
  })
}

/**
 * 新增角色（后端以请求参数绑定实体）。
 * @param {Object} data 角色数据。
 * @returns {Promise<any>} 新增结果。
 */
export function addRole(data) {
  return request({
    url: '/org/role/insert',
    method: 'post',
    params: data
  })
}

/**
 * 修改角色（后端以请求参数绑定实体）。
 * @param {Object} data 角色数据。
 * @returns {Promise<any>} 修改结果。
 */
export function updateRole(data) {
  return request({
    url: '/org/role/update',
    method: 'post',
    params: data
  })
}

/**
 * 删除角色。
 * @param {string|number|Array} ids 角色 ID 或角色 ID 数组。
 * @returns {Promise<any>} 删除结果。
 */
export function delRole(ids) {
  return request({
    url: '/org/role/delete',
    method: 'post',
    params: { 'ids[]': ids }
  })
}

/**
 * 根据角色 ID 查询角色资源。
 * @param {string|number} roleId 角色 ID。
 * @returns {Promise<any>} 角色资源 ID 列表（response.data）。
 */
export function roleMenuTreeselect(roleId) {
  return request({
    url: '/org/role/loadRoleRes',
    method: 'get',
    params: { roleId }
  })
}

/**
 * 更新角色资源授权。
 * @param {string|number} roleId 角色 ID。
 * @param {Array} resourceIds 资源 ID 列表。
 * @returns {Promise<any>} 保存结果。
 */
export function updateRoleRes(roleId, resourceIds) {
  return request({
    url: '/org/role/updateRoleRes',
    method: 'post',
    params: { roleId, 'resourceIds[]': resourceIds }
  })
}
