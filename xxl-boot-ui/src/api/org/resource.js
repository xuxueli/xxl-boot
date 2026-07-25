import request from '@/utils/request'

/**
 * 名称：菜单管理 API
 * 能力：提供菜单查询、维护、排序及角色菜单树能力。
 */

/**
 * 查询菜单列表。
 * @param {Object} query 查询参数。
 * @returns {Promise<any>} 菜单列表。
 */
export function listMenu(query) {
  return request({
    url: '/org/resource/treeList',
    method: 'get',
    params: query
  })
}

/**
 * 查询菜单详情。
 * @param {string|number} menuId 菜单 ID。
 * @returns {Promise<any>} 菜单详情。
 */
export function getMenu(menuId) {
  return request({
    url: '/org/resource/load',
    method: 'get',
    params: { id: menuId }
  })
}

/**
 * 查询菜单下拉树。
 * @returns {Promise<any>} 菜单树结构。
 */
export function treeselect() {
  return request({
    url: '/org/resource/simpleTreeList',
    method: 'get'
  })
}

/**
 * 根据角色 ID 查询菜单下拉树。
 * @param {string|number} roleId 角色 ID。
 * @returns {Promise<any>} 菜单树结构。
 */
export function roleMenuTreeselect(roleId) {
  return request({
    url: '/org/role/loadRoleRes',
    method: 'get',
    params: { roleId }
  })
}

/**
 * 新增菜单。
 * @param {Object} data 菜单数据。
 * @returns {Promise<any>} 新增结果。
 */
export function addMenu(data) {
  return request({
    url: '/org/resource/insert',
    method: 'post',
    data: data
  })
}

/**
 * 修改菜单。
 * @param {Object} data 菜单数据。
 * @returns {Promise<any>} 修改结果。
 */
export function updateMenu(data) {
  return request({
    url: '/org/resource/update',
    method: 'post',
    data: data
  })
}

/**
 * 保存菜单排序。
 * @param {Object} data 排序数据。
 * @returns {Promise<any>} 保存结果。
 */
export function updateMenuSort(data) {
  return request({
    url: '/org/resource/update',
    method: 'post',
    data: data
  })
}

/**
 * 删除菜单。
 * @param {string|number} menuId 菜单 ID。
 * @returns {Promise<any>} 删除结果。
 */
export function delMenu(menuId) {
  return request({
    url: '/org/resource/delete',
    method: 'post',
    params: { 'ids[]': menuId }
  })
}
