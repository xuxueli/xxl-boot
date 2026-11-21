/**
 * @fileoverview Dashboard API
 * @description 首页统计接口，方法名与后端 DashboardController 对齐
 * @author xuxueli 2026-11-21
 */
import { request } from '@/utils/request'
import type { DashboardStats, LogTrendItem } from '../types'
import type { Response } from '@/types'

/** 首页 API，调用方式：dashboardApi.stats() */
export const dashboardApi = {
  /**
   * 查询首页指标卡片
   *
   * @returns 各项统计数量
   */
  stats(): Promise<Response<DashboardStats>> {
    return request({
      url: '/dashboard/stats',
      method: 'get'
    })
  },

  /**
   * 查询审计日志折线图
   *
   * @param days 统计天数
   * @returns 每日日志量列表
   */
  logTrend(days: number): Promise<Response<LogTrendItem[]>> {
    return request({
      url: '/dashboard/logTrend',
      method: 'get',
      params: { days }
    })
  }
}
