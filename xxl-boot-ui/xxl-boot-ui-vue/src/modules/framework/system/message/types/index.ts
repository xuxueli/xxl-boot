/**
 * @fileoverview Message 类型定义
 * @description 实体、查询与表单类型，对应后端 Message.java、MessageRead.java
 * @author xuxueli 2026-11-21
 */

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

/** 搜索栏查询参数（含分页，前端表单形态） */
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

/** 已读用户列表查询参数（含分页） */
export interface MessageReadQuery {
  /** 当前页码 */
  pageNum: number
  /** 每页条数 */
  pageSize: number
  /** 消息主键 */
  messageId?: number
}
