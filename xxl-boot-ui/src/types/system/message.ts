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
