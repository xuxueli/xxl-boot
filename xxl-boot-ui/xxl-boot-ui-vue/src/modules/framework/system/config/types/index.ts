/**
 * @fileoverview Config 类型定义
 * @description 实体、查询与表单类型，对应后端 Config.java
 * @author xuxueli 2026-11-21
 */

/** 系统配置实体（对应后端 Config.java） */
export interface Config {
  /** 主键 */
  id?: number
  /** 配置名称 */
  name?: string
  /** 配置 Key，业务唯一且创建后不可修改 */
  key?: string
  /** 配置值 */
  value?: string
  /** 状态：0-正常、1-停用 */
  status?: number
  /** 添加时间 */
  addTime?: string
  /** 更新时间 */
  updateTime?: string
  /** 备注 */
  remark?: string
}

/** 搜索栏查询参数（含分页，前端表单形态） */
export interface ConfigQuery {
  /** 当前页码 */
  pageNum: number
  /** 每页条数 */
  pageSize: number
  /** 配置名称，模糊匹配 */
  name?: string
  /** 配置 Key，模糊匹配 */
  key?: string
  /** 状态筛选，-1 表示全部 */
  status?: number
}

/** 新增/修改表单：复用实体中的可编辑字段，避免字段定义重复 */
export type ConfigForm = Pick<Config, 'id' | 'name' | 'key' | 'value' | 'status' | 'remark'>
