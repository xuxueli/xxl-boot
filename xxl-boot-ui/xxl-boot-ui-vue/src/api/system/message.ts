import { request } from '@/utils/request'
import type { Message, MessageListQuery, User } from '@/types/api'
import type { PageModel, Response } from '@/types'

/**
 * 名称：消息管理 API
 * 能力：提供消息查询、维护、已读标记与已读用户查询接口。
 */

/**
 * 分页查询消息列表。
 * @param query 查询参数（title/status/offset/pagesize）。
 * @returns 消息分页列表。
 */
export function listMessage(query: MessageListQuery): Promise<Response<PageModel<Message>>> {
  return request({
    url: '/system/message/pageList',
    method: 'get',
    params: query
  })
}

/**
 * 查询单条消息详情。
 * @param id 消息ID。
 * @returns 消息详情。
 */
export function getMessage(id: number): Promise<Response<Message>> {
  return request({
    url: '/system/message/load',
    method: 'get',
    params: { id: id }
  })
}

/**
 * 新增消息。
 * @param data 消息数据。
 * @returns 新增结果。
 */
export function addMessage(data: Message): Promise<Response<unknown>> {
  return request({
    url: '/system/message/insert',
    method: 'post',
    data: data
  })
}

/**
 * 更新消息。
 * @param data 消息数据。
 * @returns 更新结果。
 */
export function updateMessage(data: Message): Promise<Response<unknown>> {
  return request({
    url: '/system/message/update',
    method: 'post',
    data: data
  })
}

/**
 * 删除消息。
 * @param id 消息ID 或消息ID数组。
 * @returns 删除结果。
 */
export function delMessage(id: number | number[]): Promise<Response<unknown>> {
  return request({
    url: '/system/message/delete',
    method: 'post',
    params: { ids: Array.isArray(id) ? id : [id] }
  })
}

/**
 * 查询首页顶部消息列表（最近5条，附带是否已读）。
 * @returns 顶部消息列表。
 */
export function listMessageTop(): Promise<Response<Message[]>> {
  return request({
    url: '/system/message/listTop',
    method: 'get'
  })
}

/**
 * 标记单条消息已读。
 * @param id 消息ID。
 * @returns 标记结果。
 */
export function markMessageRead(id: number): Promise<Response<unknown>> {
  return request({
    url: '/system/message/markRead',
    method: 'post',
    params: { messageId: id }
  })
}

/**
 * 批量标记消息已读。
 * @param ids 消息ID，逗号分隔字符串。
 * @returns 批量标记结果。
 */
export function markMessageReadAll(ids: string): Promise<Response<unknown>> {
  return request({
    url: '/system/message/markReadAll',
    method: 'post',
    params: { ids }
  })
}

/**
 * 分页查询消息的已读用户列表。
 * @param query 查询参数（messageId/offset/pagesize）。
 * @returns 已读用户分页列表。
 */
export function listMessageReadUsers(query: object): Promise<Response<PageModel<User>>> {
  return request({
    url: '/system/message/readUsers',
    method: 'get',
    params: query
  })
}
