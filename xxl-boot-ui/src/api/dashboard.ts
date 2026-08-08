import { request } from '@/utils/request'
import type { Response } from '@/types'

/**
 * 名称：首页 Dashboard API
 * 能力：提供首页指标卡片、审计日志趋势接口。
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

/**
 * 首页：指标卡片。
 * @returns 各项统计数量。
 */
export function getStats(): Promise<Response<DashboardStats>> {
  return request({
    url: '/dashboard/stats',
    method: 'get'
  })
}

/**
 * 首页：审计日志折线图。
 * @param days 统计天数。
 * @returns 每日日志量列表。
 */
export function getLogTrend(days: number): Promise<Response<LogTrendItem[]>> {
  return request({
    url: '/dashboard/logTrend',
    method: 'get',
    params: { days }
  })
}
