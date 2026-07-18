import request from '@/utils/request'

/**
 * 名称：字典数据 API
 * 能力：提供字典数据查询、按类型获取与增删改接口。
 */

/**
 * 查询字典数据列表。
 * @param {Object} query 查询参数。
 * @returns {Promise<any>} 字典数据列表。
 */
export function listData(query) {
  return request({
    url: '/system/dict/data/list',
    method: 'get',
    params: query
  })
}

/**
 * 查询字典数据详情。
 * @param {string|number} dictCode 字典数据编码。
 * @returns {Promise<any>} 字典数据详情。
 */
export function getData(dictCode) {
  return request({
    url: '/system/dict/data/' + dictCode,
    method: 'get'
  })
}

/**
 * 根据字典类型查询字典数据。
 * @param {string} dictType 字典类型。
 * @returns {Promise<any>} 字典数据集合。
 */
export function getDicts(dictType) {
  return request({
    url: '/system/dict/data/type/' + dictType,
    method: 'get'
  })
}

/**
 * 新增字典数据。
 * @param {Object} data 字典数据。
 * @returns {Promise<any>} 新增结果。
 */
export function addData(data) {
  return request({
    url: '/system/dict/data',
    method: 'post',
    data: data
  })
}

/**
 * 修改字典数据。
 * @param {Object} data 字典数据。
 * @returns {Promise<any>} 修改结果。
 */
export function updateData(data) {
  return request({
    url: '/system/dict/data',
    method: 'put',
    data: data
  })
}

/**
 * 删除字典数据。
 * @param {string|number} dictCode 字典数据编码。
 * @returns {Promise<any>} 删除结果。
 */
export function delData(dictCode) {
  return request({
    url: '/system/dict/data/' + dictCode,
    method: 'delete'
  })
}
