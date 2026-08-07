import request from '@/utils/request'

/**
 * 名称：资源管理 API
 * 能力：提供资源树查询、维护、排序及角色资源能力。
 */

/**
 * 查询资源树列表（扁平数据，由前端转树）。
 * @param {Object} query 查询参数（name/status）。
 * @returns {Promise<any>} 资源列表。
 */
export function listResource(query) {
  return request({
    url: '/org/resource/treeList',
    method: 'get',
    params: query
  })
}

/**
 * 查询资源详情。
 * @param {string|number} id 资源 ID。
 * @returns {Promise<any>} 资源详情。
 */
export function getResource(id) {
  return request({
    url: '/org/resource/load',
    method: 'get',
    params: { id }
  })
}

/**
 * 新增资源（后端以请求参数绑定实体）。
 * @param {Object} data 资源数据。
 * @returns {Promise<any>} 新增结果。
 */
export function addResource(data) {
  return request({
    url: '/org/resource/insert',
    method: 'post',
    params: data
  })
}

/**
 * 修改资源（后端以请求参数绑定实体）。
 * @param {Object} data 资源数据。
 * @returns {Promise<any>} 修改结果。
 */
export function updateResource(data) {
  return request({
    url: '/org/resource/update',
    method: 'post',
    params: data
  })
}

/**
 * 批量更新资源排序。
 * @param {Array} ids 资源 ID 列表。
 * @param {Array} orders 排序值列表（与 ids 一一对应）。
 * @returns {Promise<any>} 保存结果。
 */
export function updateResourceSort(ids, orders) {
  return request({
    url: '/org/resource/updateSort',
    method: 'post',
    params: { 'ids[]': ids, 'orders[]': orders }
  })
}

/**
 * 删除资源。
 * @param {string|number|Array} ids 资源 ID 或资源 ID 数组。
 * @returns {Promise<any>} 删除结果。
 */
export function delResource(ids) {
  return request({
    url: '/org/resource/delete',
    method: 'post',
    params: { 'ids[]': ids }
  })
}

/**
 * 根据角色 ID 查询角色资源。
 * @param {string|number} roleId 角色 ID。
 * @returns {Promise<any>} 角色资源 ID 列表。
 */
export function roleMenuTreeselect(roleId) {
  return request({
    url: '/org/role/loadRoleRes',
    method: 'get',
    params: { roleId }
  })
}
