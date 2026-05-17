import request from '@/utils/request'

/**
 * 名称：字典类型 API
 * 能力：提供字典类型查询、维护、缓存刷新与下拉选项接口。
 */

/**
 * 查询字典类型列表。
 * @param {Object} query 查询参数。
 * @returns {Promise<any>} 字典类型列表。
 */
export function listType(query) {
  return request({
    url: '/system/dict/type/list',
    method: 'get',
    params: query
  })
}

/**
 * 查询字典类型详情。
 * @param {string|number} dictId 字典类型 ID。
 * @returns {Promise<any>} 字典类型详情。
 */
export function getType(dictId) {
  return request({
    url: '/system/dict/type/' + dictId,
    method: 'get'
  })
}

/**
 * 新增字典类型。
 * @param {Object} data 字典类型数据。
 * @returns {Promise<any>} 新增结果。
 */
export function addType(data) {
  return request({
    url: '/system/dict/type',
    method: 'post',
    data: data
  })
}

/**
 * 修改字典类型。
 * @param {Object} data 字典类型数据。
 * @returns {Promise<any>} 修改结果。
 */
export function updateType(data) {
  return request({
    url: '/system/dict/type',
    method: 'put',
    data: data
  })
}

/**
 * 删除字典类型。
 * @param {string|number} dictId 字典类型 ID。
 * @returns {Promise<any>} 删除结果。
 */
export function delType(dictId) {
  return request({
    url: '/system/dict/type/' + dictId,
    method: 'delete'
  })
}

/**
 * 刷新字典缓存。
 * @returns {Promise<any>} 刷新结果。
 */
export function refreshCache() {
  return request({
    url: '/system/dict/type/refreshCache',
    method: 'delete'
  })
}

/**
 * 获取字典类型下拉选项。
 * @returns {Promise<any>} 下拉选项列表。
 */
export function optionselect() {
  return request({
    url: '/system/dict/type/optionselect',
    method: 'get'
  })
}
