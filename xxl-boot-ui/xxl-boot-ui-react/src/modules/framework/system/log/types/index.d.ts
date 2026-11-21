/**
 * @fileoverview Log 类型定义
 * @description 审计日志实体，对应后端 Log.java
 * @author xuxueli 2026-11-21
 */
declare namespace API {
  /** 审计日志 */
  type Log = {
    /** 主键 */
    id?: number;
    /** 日志类型：0-操作日志、1-登录日志 */
    type?: number;
    /** 系统模块 */
    module?: number;
    /** 日志标题 */
    title?: string;
    /** 日志内容 */
    content?: string;
    /** 操作人 */
    operator?: string;
    /** 操作 IP */
    ip?: string;
    /** IP 归属地 */
    ipAddress?: string;
    /** 添加时间 */
    addTime?: string;
    /** 更新时间 */
    updateTime?: string;
  };
}
