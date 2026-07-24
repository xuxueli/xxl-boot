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
    url: '/tool/gen/list',
    method: 'get',
    params: query
  })
}

/**
 * 查询数据库表列表。
 * @param {Object} query 查询参数。
 * @returns {Promise<any>} 数据库表列表。
 */
export function listDbTable(query) {
  return request({
    url: '/tool/gen/db/list',
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
    url: '/tool/gen/' + tableId,
    method: 'get'
  })
}

/**
 * 修改代码生成信息。
 * @param {Object} data 生成配置数据。
 * @returns {Promise<any>} 修改结果。
 */
export function updateGenTable(data) {
  return request({
    url: '/tool/gen',
    method: 'put',
    data: data
  })
}

/**
 * 导入数据库表到生成器。
 * @param {Object} data 导入参数。
 * @returns {Promise<any>} 导入结果。
 */
export function importTable(data) {
  return request({
    url: '/tool/gen/importTable',
    method: 'post',
    params: data
  })
}

/**
 * 在数据库中创建表。
 * @param {Object} data 建表参数。
 * @returns {Promise<any>} 创建结果。
 */
export function createTable(data) {
  return request({
    url: '/tool/gen/createTable',
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
    url: '/tool/gen/preview/' + tableId,
    method: 'get'
  })
}

/**
 * 删除生成表数据。
 * @param {string|number} tableId 表 ID。
 * @returns {Promise<any>} 删除结果。
 */
export function delTable(tableId) {
  return request({
    url: '/tool/gen/' + tableId,
    method: 'delete'
  })
}

/**
 * 生成代码（自定义路径）。
 * @param {string} tableName 表名。
 * @returns {Promise<any>} 生成结果。
 */
export function genCode(tableName) {
  return request({
    url: '/tool/gen/genCode/' + tableName,
    method: 'get'
  })
}

/**
 * 同步数据库表结构。
 * @param {string} tableName 表名。
 * @returns {Promise<any>} 同步结果。
 */
export function synchDb(tableName) {
  return request({
    url: '/tool/gen/synchDb/' + tableName,
    method: 'get'
  })
}
