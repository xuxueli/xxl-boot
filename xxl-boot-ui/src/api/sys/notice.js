import request from '@/utils/request'

/**
 * 名称：公告管理 API
 * 能力：提供公告查询、维护、已读标记与已读用户查询接口。
 */

/**
 * 查询公告列表。
 * @param {Object} query 查询参数。
 * @returns {Promise<any>} 公告列表。
 */
export function listNotice(query) {
  return request({
    url: '/system/notice/list',
    method: 'get',
    params: query
  })
}

/**
 * 查询公告详情。
 * @param {string|number} noticeId 公告 ID。
 * @returns {Promise<any>} 公告详情。
 */
export function getNotice(noticeId) {
  return request({
    url: '/system/notice/' + noticeId,
    method: 'get'
  })
}

/**
 * 新增公告。
 * @param {Object} data 公告数据。
 * @returns {Promise<any>} 新增结果。
 */
export function addNotice(data) {
  return request({
    url: '/system/notice',
    method: 'post',
    data: data
  })
}

/**
 * 修改公告。
 * @param {Object} data 公告数据。
 * @returns {Promise<any>} 修改结果。
 */
export function updateNotice(data) {
  return request({
    url: '/system/notice',
    method: 'put',
    data: data
  })
}

/**
 * 删除公告。
 * @param {string|number} noticeId 公告 ID。
 * @returns {Promise<any>} 删除结果。
 */
export function delNotice(noticeId) {
  return request({
    url: '/system/notice/' + noticeId,
    method: 'delete'
  })
}

/**
 * 查询首页顶部公告（含已读状态）。
 * @returns {Promise<any>} 顶部公告列表。
 */
export function listNoticeTop() {
  return request({
    url: '/system/notice/listTop',
    method: 'get'
  })
}

/**
 * 标记公告已读。
 * @param {string|number} noticeId 公告 ID。
 * @returns {Promise<any>} 标记结果。
 */
export function markNoticeRead(noticeId) {
  return request({
    url: '/system/notice/markRead',
    method: 'post',
    params: { noticeId }
  })
}

/**
 * 批量标记公告已读。
 * @param {string} ids 公告 ID 集合（逗号分隔）。
 * @returns {Promise<any>} 标记结果。
 */
export function markNoticeReadAll(ids) {
  return request({
    url: '/system/notice/markReadAll',
    method: 'post',
    params: { ids }
  })
}

/**
 * 查询公告已读用户列表。
 * @param {Object} query 查询参数。
 * @returns {Promise<any>} 已读用户列表。
 */
export function listNoticeReadUsers(query) {
  return request({
    url: '/system/notice/readUsers/list',
    method: 'get',
    params: query
  })
}
