/**
 * @fileoverview Dashboard API
 * @description 首页指标与趋势接口，方法名与后端 DashboardController 对齐
 * @author xuxueli 2026-11-21
 */
import { request } from '@/utils/request';

/** 首页 API，调用方式：dashboardApi.stats() */
export const dashboardApi = {
  /**
   * 查询首页指标卡片
   *
   * @returns 各项统计数量
   */
  stats() {
    return request<API.Response<API.DashboardStats>>('/dashboard/stats', {
      method: 'GET',
    });
  },

  /**
   * 查询审计日志趋势
   *
   * @param days 统计天数
   * @returns 每日日志量列表
   */
  logTrend(days: number) {
    return request<API.Response<API.LogTrendItem[]>>('/dashboard/logTrend', {
      method: 'GET',
      params: { days },
    });
  },
};
