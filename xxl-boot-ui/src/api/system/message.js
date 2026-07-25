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
    url: '/system/message/pageList',
    method: 'get',
    params: query
  })
}

export function getNotice(noticeId) {
  return request({
    url: '/system/message/load',
    method: 'get',
    params: { id: noticeId }
  })
}

export function addNotice(data) {
  return request({
    url: '/system/message/insert',
    method: 'post',
    data: data
  })
}

export function updateNotice(data) {
  return request({
    url: '/system/message/update',
    method: 'post',
    data: data
  })
}

export function delNotice(noticeId) {
  return request({
    url: '/system/message/delete',
    method: 'post',
    params: { 'ids[]': noticeId }
  })
}

export function listNoticeTop() {
  return request({
    url: '/system/message/listTop',
    method: 'get'
  })
}

export function markNoticeRead(noticeId) {
  return request({
    url: '/system/message/markRead',
    method: 'post',
    params: { messageId: noticeId }
  })
}

export function markNoticeReadAll(ids) {
  return request({
    url: '/system/message/markReadAll',
    method: 'post',
    params: { ids }
  })
}

export function listNoticeReadUsers(query) {
  return request({
    url: '/system/message/readUsers',
    method: 'get',
    params: query
  })
}
