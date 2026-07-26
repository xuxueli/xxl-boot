import request from '@/utils/request'

/**
 * 名称：日志 API
 * 能力：提供日志查询、删除接口。
 */


/**
 * 查询日志列表。
 * @param {Object} query 查询参数。
 * @returns {Promise<any>} 日志列表。
 */
export function pageList(query) {
  return request({
    url: '/system/log/pageList',
    method: 'get',
    params: query
  })
}

/**
 * 删除日志。
 * @param {string|number|Array} ids 日志 ID 或 ID 数组。
 * @returns {Promise<any>} 删除结果。
 */
export function delOperlog(ids) {
  return request({
    url: '/system/log/delete',
    method: 'post',
    params: { 'ids[]': ids }
  })
}

/**
 * 查询枚举列表。
 * @param {string} enumName 枚举类名。
 * @returns {Promise<any>} 枚举项列表。
 */
export function loadEnumItem(enumName) {
  return request({
    url: '/system/dict/loadEnumItem',
    method: 'get',
    params: { enumName }
  })
}