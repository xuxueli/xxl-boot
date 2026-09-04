/**
 * 名称：首页 Dashboard API
 * 能力：提供首页指标卡片、审计日志趋势接口。
 *
 * @author xuxueli 2026-08-15
 */
import { request } from '@/utils/request';

/**
 * 类型定义：首页 Dashboard
 * 对应 src/pages/dashboard.tsx 页面所需数据结构。
 *
 * 注：
 *    - dashboard.ts 为模块文件，需用 declare global 将类型声明到全局作用域。
 *    - 简单文件，不拆分文件
 */
declare global {
  namespace API {
    /** 首页统计 */
    type DashboardStats = {
      userCount?: number;
      roleCount?: number;
      logCount?: number;
      messageCount?: number;
    };

    /** 日志趋势单日数据 */
    type LogTrendItem = {
      date?: string;
      count?: number;
    };
  }
}

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
