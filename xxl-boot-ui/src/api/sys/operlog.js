import request from '@/utils/request'

/**
 * 名称：操作日志 API
 * 能力：提供操作日志查询、删除与清空接口。
 */

/**
 * 查询操作日志列表。
 * @param {Object} query 查询参数。
 * @returns {Promise<any>} 操作日志列表。
 */
export function list(query) {
  return request({
    url: '/monitor/operlog/list',
    method: 'get',
    params: query
  })
}

/**
 * 删除操作日志。
 * @param {string|number} operId 日志 ID。
 * @returns {Promise<any>} 删除结果。
 */
export function delOperlog(operId) {
  return request({
    url: '/monitor/operlog/' + operId,
    method: 'delete'
  })
}

/**
 * 清空操作日志。
 * @returns {Promise<any>} 清空结果。
 */
export function cleanOperlog() {
  return request({
    url: '/monitor/operlog/clean',
    method: 'delete'
  })
}
