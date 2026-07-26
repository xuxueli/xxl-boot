import request from '@/utils/request'

/**
 * 名称：代码生成 API
 * 能力：提供生成表查询、导入创建、预览生成、同步与删除等接口。
 */

/**
 * 查询生成表列表。
 * @param {Object} query 查询参数。
 * @returns {Promise<any>} 生成表列表。
 */
export function listTable(query) {
  return request({
    url: '/tool/codegen/pageList',
    method: 'get',
    params: query
  })
}

/**
 * 查询生成表详情。
 * @param {string|number} tableId 表 ID。
 * @returns {Promise<any>} 表详细信息。
 */
export function getGenTable(tableId) {
  return request({
    url: '/tool/codegen/detail',
    method: 'get',
    params: { id: tableId }
  })
}

/**
 * 修改代码生成信息。
 * @param {Object} data 生成配置数据。
 * @returns {Promise<any>} 修改结果。
 */
export function updateGenTable(data) {
  return request({
    url: '/tool/codegen/update',
    method: 'post',
    data: data
  })
}

/**
 * 在数据库中创建表。
 * @param {Object} data 建表参数。
 * @returns {Promise<any>} 创建结果。
 */
export function createTable(data) {
  return request({
    url: '/tool/codegen/createTable',
    method: 'post',
    params: data
  })
}

/**
 * 预览生成代码。
 * @param {string|number} tableId 表 ID。
 * @returns {Promise<any>} 预览结果。
 */
export function previewTable(tableId) {
  return request({
    url: '/tool/codegen/preview',
    method: 'get',
    params: { id: tableId }
  })
}

/**
 * 删除生成表数据。
 * @param {string|number} tableId 表 ID。
 * @returns {Promise<any>} 删除结果。
 */
export function delTable(tableId) {
  return request({
    url: '/tool/codegen/delete',
    method: 'post',
    params: { ids: tableId }
  })
}

/**
 * 生成代码（自定义路径）。
 * @param {string} tableName 表名。
 * @returns {Promise<any>} 生成结果。
 */
export function genCode(tableName) {
  return request({
    url: '/tool/codegen/batchGenCode',
    method: 'post',
    params: { tableName: tableName }
  })
}


