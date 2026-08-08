/**
 * 组织管理类型定义（views/org/org 页面）
 * 对应后端 Org.java
 */

/** 组织实体（对应 Org.java） */
export interface Org {
  id?: number
  /** 父组织ID */
  parentId?: number
  name?: string
  order?: number
  /** 状态：0-正常、1-停用 */
  status?: number
  /** 负责人 */
  manager?: string
  addTime?: string
  updateTime?: string
  children?: Org[]
  [key: string]: unknown
}

/** 组织列表查询参数（搜索栏表单形态） */
export interface OrgQuery {
  /** 名称关键词 */
  name?: string
  /** 状态：-1 全部 */
  status: number
}
