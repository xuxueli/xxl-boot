import request from '@/utils/request'

/**
 * 名称：系统配置 API
 * 能力：提供系统配置查询、维护接口。
 */

/**
 * 分页查询配置列表。
 * @param {Object} query 查询参数（name/key/status/offset/pagesize）。
 * @returns {Promise<any>} 配置分页列表。
 */
export function listConfig(query) {
  return request({
    url: '/system/config/pageList',
    method: 'get',
    params: query
  })
}

/**
 * 查询单条配置详情。
 * @param {number} id 配置ID。
 * @returns {Promise<any>} 配置详情。
 */
export function getConfig(id) {
  return request({
    url: '/system/config/load',
    method: 'get',
    params: { id }
  })
}

/**
 * 按配置Key查询配置。
 * @param {string} key 配置Key。
 * @returns {Promise<any>} 配置详情。
 */
export function getConfigKey(key) {
  return request({
    url: '/system/config/loadByKey',
    method: 'get',
    params: { key }
  })
}

/**
 * 新增配置。
 * @param {Object} data 配置数据。
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
 * 更新配置。
 * @param {Object} data 配置数据。
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
 * 删除配置。
 * @param {number|Array} id 配置ID或配置ID数组。
 * @returns {Promise<any>} 删除结果。
 */
export function delConfig(id) {
  return request({
    url: '/system/config/delete',
    method: 'post',
    params: { 'ids[]': id }
  })
}
