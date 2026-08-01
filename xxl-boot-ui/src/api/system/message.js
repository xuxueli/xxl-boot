import request from '@/utils/request'

/**
 * 名称：消息管理 API
 * 能力：提供消息查询、维护、已读标记与已读用户查询接口。
 */

/**
 * 分页查询消息列表。
 * @param {Object} query 查询参数（title/status/offset/pagesize）。
 * @returns {Promise<any>} 消息分页列表。
 */
export function listNotice(query) {
  return request({
    url: '/system/message/pageList',
    method: 'get',
    params: query
  })
}

/**
 * 查询单条消息详情。
 * @param {number} noticeId 消息ID。
 * @returns {Promise<any>} 消息详情。
 */
export function getNotice(noticeId) {
  return request({
    url: '/system/message/load',
    method: 'get',
    params: { id: noticeId }
  })
}

/**
 * 新增消息。
 * @param {Object} data 消息数据。
 * @returns {Promise<any>} 新增结果。
 */
export function addNotice(data) {
  return request({
    url: '/system/message/insert',
    method: 'post',
    data: data
  })
}

/**
 * 更新消息。
 * @param {Object} data 消息数据。
 * @returns {Promise<any>} 更新结果。
 */
export function updateNotice(data) {
  return request({
    url: '/system/message/update',
    method: 'post',
    data: data
  })
}

/**
 * 删除消息。
 * @param {number|Array} noticeId 消息ID 或消息ID数组。
 * @returns {Promise<any>} 删除结果。
 */
export function delNotice(noticeId) {
  return request({
    url: '/system/message/delete',
    method: 'post',
    params: { 'ids[]': noticeId }
  })
}

/**
 * 查询首页顶部消息列表（最近5条，附带是否已读）。
 * @returns {Promise<any>} 顶部消息列表。
 */
export function listNoticeTop() {
  return request({
    url: '/system/message/listTop',
    method: 'get'
  })
}

/**
 * 标记单条消息已读。
 * @param {number} noticeId 消息ID。
 * @returns {Promise<any>} 标记结果。
 */
export function markNoticeRead(noticeId) {
  return request({
    url: '/system/message/markRead',
    method: 'post',
    params: { messageId: noticeId }
  })
}

/**
 * 批量标记消息已读。
 * @param {string} ids 消息ID，逗号分隔字符串。
 * @returns {Promise<any>} 批量标记结果。
 */
export function markNoticeReadAll(ids) {
  return request({
    url: '/system/message/markReadAll',
    method: 'post',
    params: { ids }
  })
}

/**
 * 分页查询消息的已读用户列表。
 * @param {Object} query 查询参数（messageId/offset/pagesize）。
 * @returns {Promise<any>} 已读用户分页列表。
 */
export function listNoticeReadUsers(query) {
  return request({
    url: '/system/message/readUsers',
    method: 'get',
    params: query
  })
}
