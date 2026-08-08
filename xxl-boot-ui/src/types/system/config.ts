/**
 * 系统配置类型定义（views/system/config 页面）
 * 对应后端 Config.java
 */

/** 系统配置实体（对应 Config.java） */
export interface Config {
  id?: number
  name?: string
  key?: string
  value?: string
  /** 状态：0-正常、1-停用 */
  status?: number
  addTime?: string
  updateTime?: string
  remark?: string
  [key: string]: unknown
}

/** 配置分页查询参数（搜索栏表单形态） */
export interface ConfigQuery {
  pageNum: number
  pageSize: number
  /** 名称关键词 */
  name?: string
  /** 配置Key */
  key?: string
  /** 状态：-1 全部 */
  status?: number
}
