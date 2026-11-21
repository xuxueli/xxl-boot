/**
 * @fileoverview Resource 类型定义
 * @description 实体、查询与表单类型，对应后端 Resource.java / ResourceDTO.java
 * @author xuxueli 2026-11-22
 */

/** 资源（菜单）实体（对应后端 Resource.java） */
export interface Resource {
  /** 主键 */
  id?: number
  /** 父级资源 ID，0 表示顶级资源 */
  parentId?: number
  /** 资源名称 */
  name?: string
  /** 资源类型：0-目录、1-菜单、2-按钮 */
  type?: number
  /** 权限标识 */
  permission?: string
  /** 菜单地址 */
  url?: string
  /** 资源图标 */
  icon?: string
  /** 显示顺序 */
  order?: number
  /** 状态：0-正常、1-停用 */
  status?: number
  /** 显示状态：0-显示、1-隐藏 */
  visible?: number
  /** 添加时间 */
  addTime?: string
  /** 更新时间 */
  updateTime?: string
  /** 子资源，树形接口组装后返回 */
  children?: Resource[]
}

/** 资源树查询参数（树形接口不分页） */
export interface ResourceQuery {
  /** 资源名称，模糊匹配 */
  name?: string
  /** 状态筛选，-1 表示全部 */
  status?: number
}

/** 新增/修改表单：复用实体中的可编辑字段，避免字段定义重复 */
export type ResourceForm = Pick<
  Resource,
  'id' | 'parentId' | 'name' | 'type' | 'permission' | 'url' | 'icon' | 'order' | 'status' | 'visible'
>
