import request from '@/utils/request'

/**
 * 名称：日志 API
 * 功能：提供日志查询、删除接口
 */

/**
 * 分页查询日志列表。
 * @param {Object} query 查询参数（type/module/title/offset/pagesize）。
 * @returns {Promise<any>} 日志分页列表。
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
 * @param {number|Array} ids 日志ID或日志ID数组。
 * @returns {Promise<any>} 删除结果。
 */
export function delOperlog(ids) {
  return request({
    url: '/system/log/delete',
    method: 'post',
    params: { 'ids[]': ids }
  })
}
