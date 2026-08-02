import request from '@/utils/request'

/**
 * 名称：组织管理 API
 * 能力：提供组织树查询、组织维护与排序保存接口。
 */

/**
 * 查询组织树列表（扁平数组，前端需 handleTree 组装）。
 * @param {Object} query 查询参数（name/status，status 默认 -1 全部）。
 * @returns {Promise<any>} 组织列表。
 */
export function listOrg(query) {
  return request({
    url: '/org/org/treeList',
    method: 'get',
    params: query
  })
}

/**
 * 查询组织详情
 * @param {number} id 组织 ID。
 * @returns {Promise<any>} 组织详情。
 */
export function getOrg(id) {
  return request({
    url: '/org/org/load',
    method: 'get',
    params: { id }
  })
}

/**
 * 新增组织
 * @param {Object} data 组织数据。
 * @returns {Promise<any>} 新增结果。
 */
export function addOrg(data) {
  return request({
    url: '/org/org/insert',
    method: 'post',
    data: data
  })
}

/**
 * 更新组织
 * @param {Object} data 组织数据。
 * @returns {Promise<any>} 更新结果。
 */
export function updateOrg(data) {
  return request({
    url: '/org/org/update',
    method: 'post',
    data: data
  })
}

/**
 * 保存组织排序（批量更新顺序，ids[]/orders[] 数组参数）。
 * @param {Object} data 排序数据（{ ids: [], orders: [] }）。
 * @returns {Promise<any>} 保存结果。
 */
export function updateOrgSort(data) {
  return request({
    url: '/org/org/updateSort',
    method: 'post',
    params: { 'ids[]': data.ids, 'orders[]': data.orders }
  })
}

/**
 * 删除组织。
 * @param {number|Array} ids 组织 ID 或组织 ID 数组。
 * @returns {Promise<any>} 删除结果。
 */
export function delOrg(ids) {
  return request({
    url: '/org/org/delete',
    method: 'post',
    params: { 'ids[]': ids }
  })
}
