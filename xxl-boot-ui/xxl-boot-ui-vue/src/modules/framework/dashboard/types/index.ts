/**
 * 类型定义：首页 Dashboard（dashboard 模块）
 * 覆盖首页指标卡片、审计日志趋势数据结构。
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