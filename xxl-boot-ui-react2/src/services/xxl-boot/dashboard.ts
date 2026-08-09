/**
 * 名称：首页 Dashboard API
 * 能力：提供首页指标卡片、审计日志趋势接口。
 */
import { request } from '@umijs/max';

/**
 * 首页：指标卡片。
 * @returns 各项统计数量
 */
export async function getStats() {
  return request<API.Response<API.DashboardStats>>('/dashboard/stats', {
    method: 'GET',
  });
}

/**
 * 首页：审计日志折线图。
 * @param days 统计天数
 * @returns 每日日志量列表
 */
export async function getLogTrend(days: number) {
  return request<API.Response<API.LogTrendItem[]>>('/dashboard/logTrend', {
    method: 'GET',
    params: { days },
  });
}
