import request from '@/utils/request'

/**
 * 名称：角色管理 API
 * 能力：提供角色维护、数据权限配置与角色用户授权管理接口。
 */

/**
 * 查询角色列表。
 * @param {Object} query 查询参数。
 * @returns {Promise<any>} 角色分页列表。
 */
export function listRole(query) {
  return request({
    url: '/system/role/list',
    method: 'get',
    params: query
  })
}

/**
 * 查询角色详情。
 * @param {string|number} roleId 角色 ID。
 * @returns {Promise<any>} 角色详细信息。
 */
export function getRole(roleId) {
  return request({
    url: '/system/role/' + roleId,
    method: 'get'
  })
}

/**
 * 新增角色。
 * @param {Object} data 角色数据。
 * @returns {Promise<any>} 新增结果。
 */
export function addRole(data) {
  return request({
    url: '/system/role',
    method: 'post',
    data: data
  })
}

/**
 * 修改角色。
 * @param {Object} data 角色数据。
 * @returns {Promise<any>} 修改结果。
 */
export function updateRole(data) {
  return request({
    url: '/system/role',
    method: 'put',
    data: data
  })
}

/**
 * 配置角色数据权限。
 * @param {Object} data 数据权限配置。
 * @returns {Promise<any>} 保存结果。
 */
export function dataScope(data) {
  return request({
    url: '/system/role/dataScope',
    method: 'put',
    data: data
  })
}

/**
 * 修改角色状态。
 * @param {string|number} roleId 角色 ID。
 * @param {string} status 状态值。
 * @returns {Promise<any>} 修改结果。
 */
export function changeRoleStatus(roleId, status) {
  const data = {
    roleId,
    status
  }
  return request({
    url: '/system/role/changeStatus',
    method: 'put',
    data: data
  })
}

/**
 * 删除角色。
 * @param {string|number} roleId 角色 ID。
 * @returns {Promise<any>} 删除结果。
 */
export function delRole(roleId) {
  return request({
    url: '/system/role/' + roleId,
    method: 'delete'
  })
}

/**
 * 查询已授权用户列表。
 * @param {Object} query 查询参数。
 * @returns {Promise<any>} 已授权用户列表。
 */
export function allocatedUserList(query) {
  return request({
    url: '/system/role/authUser/allocatedList',
    method: 'get',
    params: query
  })
}

/**
 * 查询未授权用户列表。
 * @param {Object} query 查询参数。
 * @returns {Promise<any>} 未授权用户列表。
 */
export function unallocatedUserList(query) {
  return request({
    url: '/system/role/authUser/unallocatedList',
    method: 'get',
    params: query
  })
}

/**
 * 取消单个用户角色授权。
 * @param {Object} data 取消授权参数。
 * @returns {Promise<any>} 处理结果。
 */
export function authUserCancel(data) {
  return request({
    url: '/system/role/authUser/cancel',
    method: 'put',
    data: data
  })
}

/**
 * 批量取消用户角色授权。
 * @param {Object} data 批量取消参数。
 * @returns {Promise<any>} 处理结果。
 */
export function authUserCancelAll(data) {
  return request({
    url: '/system/role/authUser/cancelAll',
    method: 'put',
    params: data
  })
}

/**
 * 批量授权用户角色。
 * @param {Object} data 授权参数。
 * @returns {Promise<any>} 处理结果。
 */
export function authUserSelectAll(data) {
  return request({
    url: '/system/role/authUser/selectAll',
    method: 'put',
    params: data
  })
}

/**
 * 根据角色 ID 查询部门树。
 * @param {string|number} roleId 角色 ID。
 * @returns {Promise<any>} 部门树结构。
 */
export function deptTreeSelect(roleId) {
  return request({
    url: '/system/role/deptTree/' + roleId,
    method: 'get'
  })
}
