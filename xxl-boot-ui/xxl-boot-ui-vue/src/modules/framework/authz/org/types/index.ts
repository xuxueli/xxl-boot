/**
 * @fileoverview Org 类型定义
 * @description 实体、查询与表单类型，对应后端 Org.java
 * @author xuxueli 2026-11-22
 */

/** 组织实体（对应后端 Org.java） */
export interface Org {
  /** 主键 */
  id?: number
  /** 父组织 ID，0 表示顶级组织 */
  parentId?: number
  /** 组织名称 */
  name?: string
  /** 显示顺序 */
  order?: number
  /** 状态：0-正常、1-停用 */
  status?: number
  /** 负责人 */
  manager?: string
  /** 添加时间 */
  addTime?: string
  /** 更新时间 */
  updateTime?: string
  /** 子组织，树形接口组装后返回 */
  children?: Org[]
}

/** 组织树查询参数（树形接口不分页） */
export interface OrgQuery {
  /** 组织名称，模糊匹配 */
  name?: string
  /** 状态筛选，-1 表示全部 */
  status?: number
}

/** 新增/修改表单：复用实体中的可编辑字段，避免字段定义重复 */
export type OrgForm = Pick<Org, 'id' | 'parentId' | 'name' | 'order' | 'status' | 'manager'>
