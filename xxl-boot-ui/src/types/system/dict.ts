import type { ListQuery } from '../index'
/**
 * 数据字典类型定义（views/system/dict 页面）
 * 对应后端 Dict.java、DictItem.java
 */

/** 字典类型实体（对应 Dict.java） */
export interface Dict {
  id?: number
  name?: string
  /** 字典标识 */
  type?: string
  /** 状态：0-正常、1-停用 */
  status?: number
  addTime?: string
  updateTime?: string
  remark?: string
  [key: string]: unknown
}

/** 字典项实体（对应 DictItem.java） */
export interface DictItem {
  id?: number
  /** 所属字典ID */
  dictId?: number
  name?: string
  code?: number
  /** 状态：0-正常、1-停用 */
  status?: number
  order?: number
  addTime?: string
  updateTime?: string
  remark?: string
  [key: string]: unknown
}

/** 字典类型分页查询参数（搜索栏表单形态） */
export interface DictQuery {
  pageNum: number
  pageSize: number
  /** 名称关键词 */
  name?: string
  /** 字典标识 */
  type?: string
  /** 状态：-1 全部 */
  status?: number
}

/** 字典项分页查询参数（搜索栏表单形态） */
export interface DataQuery {
  pageNum: number
  pageSize: number
  /** 所属字典ID */
  dictId?: number
}

/** 字典类型列表请求参数（请求形态：offset/pagesize，供 api 使用） */
export type DictListQuery = ListQuery<DictQuery>

/** 字典项列表请求参数（请求形态：offset/pagesize，供 api 使用） */
export type DataListQuery = ListQuery<DataQuery>