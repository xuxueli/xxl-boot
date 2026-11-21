/**
 * @fileoverview Message API
 * @description 站内消息接口，方法名与后端 MessageController 对齐
 * @author xuxueli 2026-11-21
 */
import { request } from '@/utils/request'
import type { Message, MessageForm, MessageQuery, MessageRead, MessageReadQuery } from '../types'
import type { PageModel, Response } from '@/types'

/** 站内消息 API，调用方式：messageApi.pageList(...) */
export const messageApi = {
  /**
   * 分页查询消息
   *
   * @param query 页面查询条件
   * @returns 消息分页结果
   */
  pageList(query: MessageQuery): Promise<Response<PageModel<Message>>> {
    // 前端分页参数 pageNum/pageSize 转换为后端约定的 offset/pagesize
    const { pageNum, pageSize, ...search } = query
    return request({
      url: '/system/message/pageList',
      method: 'get',
      params: {
        offset: (pageNum - 1) * pageSize,
        pagesize: pageSize,
        ...search
      }
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
   * 查询首页顶部消息（最近 5 条，附当前用户已读状态）
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
   * @param query 页面查询条件（messageId + pageNum/pageSize）
   * @returns 已读用户分页结果
   */
  readUsers(query: MessageReadQuery): Promise<Response<PageModel<MessageRead>>> {
    const { pageNum, pageSize, ...search } = query
    return request({
      url: '/system/message/readUsers',
      method: 'get',
      params: {
        offset: (pageNum - 1) * pageSize,
        pagesize: pageSize,
        ...search
      }
    })
  },

  /**
   * 新增消息
   *
   * @param data 表单数据
   * @returns 保存结果
   */
  insert(data: MessageForm): Promise<Response<unknown>> {
    return request({
      url: '/system/message/insert',
      method: 'post',
      data
    })
  },

  /**
   * 删除消息（支持单条/批量）
   *
   * @param ids 单个主键或主键数组
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
   * @param data 表单数据（含主键）
   * @returns 保存结果
   */
  update(data: MessageForm): Promise<Response<unknown>> {
    return request({
      url: '/system/message/update',
      method: 'post',
      data
    })
  }
}
