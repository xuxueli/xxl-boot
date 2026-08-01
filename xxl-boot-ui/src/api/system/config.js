import request from '@/utils/request'

/**
 * 名称：系统参数 API
 * 能力：提供系统参数查询、维护接口。
 */

/**
 * 分页查询参数列表。
 * @param {Object} query 查询参数（name/key/status/offset/pagesize）。
 * @returns {Promise<any>} 参数分页列表。
 */
export function listConfig(query) {
  return request({
    url: '/system/config/pageList',
    method: 'get',
    params: query
  })
}

/**
 * 查询单条参数详情。
 * @param {number} id 参数ID。
 * @returns {Promise<any>} 参数详情。
 */
export function getConfig(id) {
  return request({
    url: '/system/config/load',
    method: 'get',
    params: { id }
  })
}

/**
 * 按参数键名查询参数。
 * @param {string} key 参数键名。
 * @returns {Promise<any>} 参数详情。
 */
export function getConfigKey(key) {
  return request({
    url: '/system/config/loadByKey',
    method: 'get',
    params: { key }
  })
}

/**
 * 新增参数。
 * @param {Object} data 参数数据。
 * @returns {Promise<any>} 新增结果。
 */
export function addConfig(data) {
  return request({
    url: '/system/config/insert',
    method: 'post',
    data: data
  })
}

/**
 * 更新参数。
 * @param {Object} data 参数数据。
 * @returns {Promise<any>} 更新结果。
 */
export function updateConfig(data) {
  return request({
    url: '/system/config/update',
    method: 'post',
    data: data
  })
}

/**
 * 删除参数。
 * @param {number|Array} id 参数ID或参数ID数组。
 * @returns {Promise<any>} 删除结果。
 */
export function delConfig(id) {
  return request({
    url: '/system/config/delete',
    method: 'post',
    params: { 'ids[]': id }
  })
}
