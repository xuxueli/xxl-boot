/**
 * 日志管理类型定义（views/system/log 页面）
 * 对应后端 Log.java
 */

/** 日志实体（对应 Log.java） */
export interface Log {
  id?: number
  /** 日志类型：0-操作日志、1-登录日志 */
  type?: number
  /** 系统模块编码 */
  module?: number
  title?: string
  content?: string
  /** 操作人 */
  operator?: string
  /** 操作IP */
  ip?: string
  addTime?: string
  updateTime?: string
  [key: string]: unknown
}
