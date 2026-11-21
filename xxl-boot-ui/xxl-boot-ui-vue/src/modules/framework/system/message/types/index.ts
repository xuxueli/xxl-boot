/**
 * @fileoverview Message 类型定义
 * @description 实体、查询、表单与列表查询类型，对应后端 Message.java、MessageRead.java
 * @author xuxueli 2026-11-21
 */
import type { ListQuery } from '@/types'

/** 站内消息实体（对应后端 Message.java） */
export interface Message {
  /** 主键 */
  id?: number
  /** 分类：0-通知、1-公告 */
  category?: number
  /** 标题 */
  title?: string
  /** 内容 */
  content?: string
  /** 发送人 */
  sender?: string
  /** 状态：0-正常、1-下线 */
  status?: number
  /** 添加时间 */
  addTime?: string
  /** 更新时间 */
  updateTime?: string
}

/** 搜索栏查询参数（前端表单形态） */
export interface MessageQuery {
  /** 当前页码 */
  pageNum: number
  /** 每页条数 */
  pageSize: number
  /** 分类筛选，-1 表示全部 */
  category: number
  /** 状态筛选，-1 表示全部 */
  status: number
  /** 标题/内容关键词，模糊匹配 */
  title?: string
}

/** 列表接口请求参数（offset/pagesize 形态） */
export type MessageListQuery = ListQuery<MessageQuery>

/** 新增/修改表单：复用实体中的可编辑字段，发送人由后端取当前登录用户 */
export type MessageForm = Pick<Message, 'id' | 'category' | 'title' | 'content' | 'status'>

/** 消息已读记录（对应后端 MessageRead.java） */
export interface MessageRead {
  /** 主键 */
  id?: number
  /** 消息主键 */
  messageId?: number
  /** 用户主键 */
  userId?: number
  /** 用户账号 */
  userName?: string
  /** 用户名称 */
  realName?: string
  /** 阅读时间 */
  addTime?: string
}

/** 已读用户列表请求参数（offset/pagesize 形态） */
export interface MessageReadListQuery {
  /** 分页偏移量 */
  offset: number
  /** 每页条数 */
  pagesize: number
  /** 消息主键 */
  messageId?: number
}
