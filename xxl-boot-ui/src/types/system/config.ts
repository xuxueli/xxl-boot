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
