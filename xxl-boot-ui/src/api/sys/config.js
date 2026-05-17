import request from '@/utils/request'

/**
 * 名称：系统参数 API
 * 能力：提供系统参数查询、维护、缓存刷新与按键名读取接口。
 */

/**
 * 查询参数列表。
 * @param {Object} query 查询参数。
 * @returns {Promise<any>} 参数分页列表。
 */
export function listConfig(query) {
  return request({
    url: '/system/config/list',
    method: 'get',
    params: query
  })
}

/**
 * 查询参数详情。
 * @param {string|number} configId 参数 ID。
 * @returns {Promise<any>} 参数详情。
 */
export function getConfig(configId) {
  return request({
    url: '/system/config/' + configId,
    method: 'get'
  })
}

/**
 * 根据参数键名查询参数值。
 * @param {string} configKey 参数键名。
 * @returns {Promise<any>} 参数值。
 */
export function getConfigKey(configKey) {
  return request({
    url: '/system/config/configKey/' + configKey,
    method: 'get'
  })
}

/**
 * 新增参数配置。
 * @param {Object} data 参数数据。
 * @returns {Promise<any>} 新增结果。
 */
export function addConfig(data) {
  return request({
    url: '/system/config',
    method: 'post',
    data: data
  })
}

/**
 * 修改参数配置。
 * @param {Object} data 参数数据。
 * @returns {Promise<any>} 修改结果。
 */
export function updateConfig(data) {
  return request({
    url: '/system/config',
    method: 'put',
    data: data
  })
}

/**
 * 删除参数配置。
 * @param {string|number} configId 参数 ID。
 * @returns {Promise<any>} 删除结果。
 */
export function delConfig(configId) {
  return request({
    url: '/system/config/' + configId,
    method: 'delete'
  })
}

/**
 * 刷新参数缓存。
 * @returns {Promise<any>} 刷新结果。
 */
export function refreshCache() {
  return request({
    url: '/system/config/refreshCache',
    method: 'delete'
  })
}
