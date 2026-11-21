/**
 * @fileoverview Org 类型定义
 * @description 组织实体，对应后端 Org.java
 * @author xuxueli 2026-11-21
 */
declare namespace API {
  /** 组织 */
  type Org = {
    /** 主键 */
    id?: number;
    /** 上级组织主键，0 表示根节点 */
    parentId?: number;
    /** 组织名称 */
    name?: string;
    /** 排序值 */
    order?: number;
    /** 状态：0-正常、1-停用 */
    status?: number;
    /** 负责人 */
    manager?: string;
    /** 添加时间 */
    addTime?: string;
    /** 更新时间 */
    updateTime?: string;
    /** 子组织 */
    children?: Org[];
  };
}
