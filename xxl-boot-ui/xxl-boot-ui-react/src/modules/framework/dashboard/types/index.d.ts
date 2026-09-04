/**
 * 类型定义：首页 Dashboard（dashboard 模块）
 * 覆盖首页指标卡片、审计日志趋势数据结构；用 declare global 合并到全局 API 命名空间
 * 供 pages/index.tsx 与 api/index.ts 复用。
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

export {};