import type { ListQuery } from '../index'
/**
 * 站内消息类型定义（views/system/message 页面）
 * 对应后端 Message.java
 */

/** 站内消息实体（对应 Message.java） */
export interface Message {
  id?: number
  /** 分类：0-通知、1-公告 */
  category?: number
  title?: string
  content?: string
  /** 发送人 */
  sender?: string
  /** 状态：0-正常、1-下线 */
  status?: number
  addTime?: string
  updateTime?: string
  [key: string]: unknown
}

/** 消息分页查询参数（搜索栏表单形态） */
export interface MessageQuery {
  pageNum: number
  pageSize: number
  /** 分类：-1 全部 */
  category: number
  /** 状态：-1 全部 */
  status: number
  /** 标题关键词 */
  title?: string
}

/** 消息列表请求参数（请求形态：offset/pagesize，供 api 使用） */
export type MessageListQuery = ListQuery<MessageQuery>