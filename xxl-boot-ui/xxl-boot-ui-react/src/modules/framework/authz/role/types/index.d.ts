/**
 * @fileoverview Role 类型定义
 * @description 角色实体，对应后端 Role.java
 * @author xuxueli 2026-11-21
 */
declare namespace API {
  /** 角色 */
  type Role = {
    /** 主键 */
    id?: number;
    /** 角色名称 */
    name?: string;
    /** 角色编码 */
    code?: string;
    /** 状态：0-正常、1-停用 */
    status?: number;
    /** 排序值 */
    order?: number;
    /** 添加时间 */
    addTime?: string;
    /** 更新时间 */
    updateTime?: string;
  };
}
