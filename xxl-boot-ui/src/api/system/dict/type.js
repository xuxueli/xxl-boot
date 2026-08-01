import request from '@/utils/request'

/**
 * 名称：字典类型 API
 * 能力：提供字典类型（字典）查询与维护接口。
 */

/**
 * 分页查询字典类型列表。
 * @param {Object} query 查询参数（name/code/status/offset/pagesize）。
 * @returns {Promise<any>} 字典类型分页列表。
 */
export function listType(query) {
  return request({
    url: '/system/dict/pageList',
    method: 'get',
    params: query
  })
}

/**
 * 查询单条字典类型详情。
 * @param {number} id 字典ID。
 * @returns {Promise<any>} 字典类型详情。
 */
export function getType(id) {
  return request({
    url: '/system/dict/load',
    method: 'get',
    params: { id }
  })
}

/**
 * 新增字典类型。
 * @param {Object} data 字典类型数据。
 * @returns {Promise<any>} 新增结果。
 */
export function addType(data) {
  return request({
    url: '/system/dict/insert',
    method: 'post',
    data: data
  })
}

/**
 * 更新字典类型。
 * @param {Object} data 字典类型数据。
 * @returns {Promise<any>} 更新结果。
 */
export function updateType(data) {
  return request({
    url: '/system/dict/update',
    method: 'post',
    data: data
  })
}

/**
 * 删除字典类型。
 * @param {number|Array} id 字典ID或字典ID数组。
 * @returns {Promise<any>} 删除结果。
 */
export function delType(id) {
  return request({
    url: '/system/dict/delete',
    method: 'post',
    params: { 'ids[]': id }
  })
}

/**
 * 查询全部字典（下拉选项）。
 * @returns {Promise<any>} 下拉选项列表（{dictId, dictName, dictType}）。
 */
export function queryDictList() {
  return request({
    url: '/system/dict/queryDictList',
    method: 'get'
  }).then(response => {
    // 后端 dict 字段（id/name/code）→ 前端通用结构（dictId/dictName/dictType）
    response.data = (response.data || []).map(item => ({
      dictId: item.id,
      dictName: item.name,
      dictType: item.type
    }))
    return response
  })
}
