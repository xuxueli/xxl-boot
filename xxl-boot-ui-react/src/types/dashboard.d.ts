/**
 * 类型定义：首页 Dashboard
 * 对应 src/pages/dashboard.tsx 页面所需数据结构。
 */
declare namespace API {
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
