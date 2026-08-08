/**
 * 角色管理类型定义（views/org/role 页面）
 * 对应后端 Role.java
 */

/** 角色实体（对应 Role.java） */
export interface Role {
  id?: number
  name?: string
  /** 角色标识 */
  code?: string
  /** 状态：0-正常、1-停用 */
  status?: number
  order?: number
  addTime?: string
  updateTime?: string
  [key: string]: unknown
}

/** 角色分页查询参数（搜索栏表单形态） */
export interface RoleQuery {
  pageNum: number
  pageSize: number
  /** 名称关键词 */
  name?: string
  /** 状态：-1 全部 */
  status: number
}
