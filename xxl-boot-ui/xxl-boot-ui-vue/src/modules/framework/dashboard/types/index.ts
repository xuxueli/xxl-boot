/**
 * @fileoverview Dashboard 类型定义
 * @description 首页指标卡片与审计日志趋势数据结构，对应后端 DashboardController
 * @author xuxueli 2026-11-22
 */

/** 首页指标卡片数据 */
export interface DashboardStats {
  /** 用户数量 */
  userCount: number
  /** 角色数量 */
  roleCount: number
  /** 日志数量 */
  logCount: number
  /** 消息数量 */
  messageCount: number
}

/** 日志趋势单日数据点 */
export interface LogTrendItem {
  /** 日期（YYYY-MM-DD） */
  date: string
  /** 当日日志量 */
  count: number
}
