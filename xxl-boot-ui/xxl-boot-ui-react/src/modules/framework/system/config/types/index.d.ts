/**
 * @fileoverview Config 类型定义
 * @description 系统配置实体，对应后端 Config.java
 * @author xuxueli 2026-11-21
 */
declare namespace API {
  /** 系统配置 */
  type Config = {
    /** 主键 */
    id?: number;
    /** 配置名称 */
    name?: string;
    /** 配置 Key，业务唯一 */
    key?: string;
    /** 配置值 */
    value?: string;
    /** 状态：0-正常、1-停用 */
    status?: number;
    /** 备注 */
    remark?: string;
    /** 添加时间 */
    addTime?: string;
    /** 更新时间 */
    updateTime?: string;
  };
}
