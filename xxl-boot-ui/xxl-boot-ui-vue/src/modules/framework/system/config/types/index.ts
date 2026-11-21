/**
 * @fileoverview Config 类型定义
 * @description 实体、查询、表单与列表查询类型，对应后端 Config.java
 * @author xuxueli 2026-11-21
 */
import type { ListQuery } from '@/types'

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

/** 搜索栏查询参数（前端表单形态） */
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

/** 新增/修改表单 */
export interface ConfigForm {
  /** 主键，新增时为空 */
  id?: number
  /** 配置名称 */
  name?: string
  /** 配置 Key */
  key?: string
  /** 配置值 */
  value?: string
  /** 状态：0-正常、1-停用 */
  status?: number
  /** 备注 */
  remark?: string
}

/** 列表接口请求参数（offset/pagesize 形态） */
export type ConfigListQuery = ListQuery<ConfigQuery>
