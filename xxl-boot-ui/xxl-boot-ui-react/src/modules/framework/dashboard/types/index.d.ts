/**
 * @fileoverview Dashboard 类型定义
 * @description 首页指标卡片与日志趋势数据结构，对应后端 DashboardController
 * @author xuxueli 2026-11-21
 */
declare global {
  namespace API {
    /** 首页统计 */
    type DashboardStats = {
      /** 用户数 */
      userCount?: number;
      /** 角色数 */
      roleCount?: number;
      /** 日志数 */
      logCount?: number;
      /** 消息数 */
      messageCount?: number;
    };

    /** 日志趋势单日数据 */
    type LogTrendItem = {
      /** 日期 */
      date?: string;
      /** 当日日志量 */
      count?: number;
    };
  }
}

export {};
