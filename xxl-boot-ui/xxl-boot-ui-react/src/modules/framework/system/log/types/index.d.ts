/**
 * 类型定义：日志管理
 * 对应后端日志实体（Log）。
 */
declare namespace API {
  /** 日志 */
  type Log = {
    id?: number;
    type?: number;
    module?: number;
    title?: string;
    content?: string;
    operator?: string;
    ip?: string;
    ipAddress?: string;
    addTime?: string;
    updateTime?: string;
  };
}
