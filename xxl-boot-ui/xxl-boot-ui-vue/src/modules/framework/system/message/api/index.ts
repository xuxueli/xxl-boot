/**
 * @fileoverview Message API
 * @description 站内消息接口，方法名与后端 MessageController 对齐
 * @author xuxueli 2026-11-21
 */
import { request } from '@/utils/request'
import type { Message, MessageListQuery } from '../types'
import type { User } from '@/modules/framework/authz/user/types'
import type { PageModel, Response } from '@/types'

/** 消息 API，调用方式：messageApi.pageList(...) */
export const messageApi = {
  /**
   * 分页查询消息
   *
   * @param query 分页与查询条件（offset/pagesize 形态）
   * @returns 消息分页结果
   */
  pageList(query: MessageListQuery): Promise<Response<PageModel<Message>>> {
    return request({
      url: '/system/message/pageList',
      method: 'get',
      params: query
    })
  },

  /**
   * 查询消息详情
   *
   * @param id 消息主键
   * @returns 消息详情
   */
  load(id: number): Promise<Response<Message>> {
    return request({
      url: '/system/message/load',
      method: 'get',
      params: { id }
    })
  },

  /**
   * 新增消息
   *
   * @param data 消息数据
   * @returns 保存结果
   */
  insert(data: Message): Promise<Response<unknown>> {
    return request({
      url: '/system/message/insert',
      method: 'post',
      data
    })
  },

  /**
   * 删除消息（支持单条/批量）
   *
   * @param ids 消息主键或主键数组
   * @returns 删除结果
   */
  delete(ids: number | number[]): Promise<Response<unknown>> {
    return request({
      url: '/system/message/delete',
      method: 'post',
      data: Array.isArray(ids) ? ids : [ids]
    })
  },

  /**
   * 更新消息
   *
   * @param data 消息数据
   * @returns 保存结果
   */
  update(data: Message): Promise<Response<unknown>> {
    return request({
      url: '/system/message/update',
      method: 'post',
      data
    })
  },

  /**
   * 查询首页顶部消息（最近 5 条，附已读状态）
   *
   * @returns 顶部消息列表
   */
  listTop(): Promise<Response<Message[]>> {
    return request({
      url: '/system/message/listTop',
      method: 'get'
    })
  },

  /**
   * 标记单条消息已读
   *
   * @param messageId 消息主键
   * @returns 标记结果
   */
  markRead(messageId: number): Promise<Response<unknown>> {
    return request({
      url: '/system/message/markRead',
      method: 'post',
      params: { messageId }
    })
  },

  /**
   * 批量标记消息已读
   *
   * @param ids 消息主键，逗号分隔字符串
   * @returns 标记结果
   */
  markReadAll(ids: string): Promise<Response<unknown>> {
    return request({
      url: '/system/message/markReadAll',
      method: 'post',
      params: { ids }
    })
  },

  /**
   * 分页查询消息的已读用户
   *
   * @param query 查询参数（messageId/offset/pagesize）
   * @returns 已读用户分页结果
   */
  readUsers(query: object): Promise<Response<PageModel<User>>> {
    return request({
      url: '/system/message/readUsers',
      method: 'get',
      params: query
    })
  }
}
