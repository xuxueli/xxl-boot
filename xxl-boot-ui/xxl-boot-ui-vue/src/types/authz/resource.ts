/**
 * 资源（菜单）管理类型定义（views/authz/resource 页面）
 * 对应后端 Resource.java
 */

/** 资源实体（对应 Resource.java） */
export interface Resource {
  id?: number
  /** 父级资源ID */
  parentId?: number
  name?: string
  /** 资源类型：1-菜单、2-按钮等 */
  type?: number
  /** 权限标识 */
  permission?: string
  url?: string
  icon?: string
  order?: number
  /** 状态：0-正常、1-停用 */
  status?: number
  /** 是否可见：0-可见、1-隐藏 */
  visible?: number
  addTime?: string
  updateTime?: string
  children?: Resource[]
  [key: string]: unknown
}

/** 资源列表查询参数（搜索栏表单形态） */
export interface ResourceQuery {
  /** 名称关键词 */
  name?: string
  /** 状态：-1 全部 */
  status?: number
}
