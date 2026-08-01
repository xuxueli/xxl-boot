import request from '@/utils/request'

/**
 * 名称：字典数据 API
 * 能力：提供字典项查询、维护、按字典标识查询与枚举查询接口。
 */

/**
 * 分页查询字典项列表。
 * @param {Object} query 查询参数（dictId/offset/pagesize）。
 * @returns {Promise<any>} 字典项分页列表。
 */
export function listData(query) {
  return request({
    url: '/system/dict/itemPageList',
    method: 'get',
    params: query
  })
}

/**
 * 查询单条字典项详情。
 * @param {number} id 字典项ID。
 * @returns {Promise<any>} 字典项详情。
 */
export function getData(id) {
  return request({
    url: '/system/dict/itemLoad',
    method: 'get',
    params: { id }
  })
}

/**
 * 按字典标识查询字典项列表（供下拉选项、回显使用）。
 * @param {string} dictCode 字典标识。
 * @returns {Promise<any>} 字典项列表。
 */
export function loadDictItem(dictCode) {
  return request({
    url: '/system/dict/loadDictItem',
    method: 'get',
    params: { dictCode }
  })
}

/**
 * 新增字典项。
 * @param {Object} data 字典项数据。
 * @returns {Promise<any>} 新增结果。
 */
export function addData(data) {
  return request({
    url: '/system/dict/itemInsert',
    method: 'post',
    data: data
  })
}

/**
 * 更新字典项。
 * @param {Object} data 字典项数据。
 * @returns {Promise<any>} 更新结果。
 */
export function updateData(data) {
  return request({
    url: '/system/dict/itemUpdate',
    method: 'post',
    data: data
  })
}

/**
 * 删除字典项。
 * @param {number|Array} id 字典项ID或字典项ID数组。
 * @returns {Promise<any>} 删除结果。
 */
export function delData(id) {
  return request({
    url: '/system/dict/itemDelete',
    method: 'post',
    params: { 'ids[]': id }
  })
}


/* ---------------------- 字典、枚举 查询 ---------------------- */

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
