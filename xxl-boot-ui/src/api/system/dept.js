import request from '@/utils/request'

/**
 * 名称：部门管理 API
 * 能力：提供部门树查询、部门维护与排序保存接口。
 */

/**
 * 查询部门列表。
 * @param {Object} query 查询参数。
 * @returns {Promise<any>} 部门列表。
 */
export function listDept(query) {
  return request({
    url: '/system/dept/list',
    method: 'get',
    params: query
  })
}

/**
 * 查询部门列表（排除指定节点及其子节点）。
 * @param {string|number} deptId 需要排除的部门 ID。
 * @returns {Promise<any>} 部门列表。
 */
export function listDeptExcludeChild(deptId) {
  return request({
    url: '/system/dept/list/exclude/' + deptId,
    method: 'get'
  })
}

/**
 * 查询部门详情。
 * @param {string|number} deptId 部门 ID。
 * @returns {Promise<any>} 部门详情。
 */
export function getDept(deptId) {
  return request({
    url: '/system/dept/' + deptId,
    method: 'get'
  })
}

/**
 * 新增部门。
 * @param {Object} data 部门数据。
 * @returns {Promise<any>} 新增结果。
 */
export function addDept(data) {
  return request({
    url: '/system/dept',
    method: 'post',
    data: data
  })
}

/**
 * 修改部门。
 * @param {Object} data 部门数据。
 * @returns {Promise<any>} 修改结果。
 */
export function updateDept(data) {
  return request({
    url: '/system/dept',
    method: 'put',
    data: data
  })
}

/**
 * 保存部门排序。
 * @param {Object} data 排序数据。
 * @returns {Promise<any>} 保存结果。
 */
export function updateDeptSort(data) {
  return request({
    url: '/system/dept/updateSort',
    method: 'put',
    data: data
  })
}

/**
 * 删除部门。
 * @param {string|number} deptId 部门 ID。
 * @returns {Promise<any>} 删除结果。
 */
export function delDept(deptId) {
  return request({
    url: '/system/dept/' + deptId,
    method: 'delete'
  })
}
