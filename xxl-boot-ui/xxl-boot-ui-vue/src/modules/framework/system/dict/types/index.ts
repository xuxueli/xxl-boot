/**
 * @fileoverview Dict 类型定义
 * @description 字典类型、字典项、查询与表单类型，对应后端 Dict.java、DictItem.java
 * @author xuxueli 2026-11-21
 */

/** 字典类型实体（对应后端 Dict.java / DictDTO.java） */
export interface Dict {
  /** 主键 */
  id?: number
  /** 字典名称 */
  name?: string
  /** 字典标识，业务唯一且创建后不可修改 */
  type?: string
  /** 状态：0-正常、1-停用 */
  status?: number
  /** 添加时间 */
  addTime?: string
  /** 更新时间 */
  updateTime?: string
  /** 备注 */
  remark?: string
}

/** 字典类型搜索栏查询参数（含分页，前端表单形态） */
export interface DictQuery {
  /** 当前页码 */
  pageNum: number
  /** 每页条数 */
  pageSize: number
  /** 字典名称，模糊匹配 */
  name?: string
  /** 字典标识，模糊匹配 */
  type?: string
  /** 状态筛选，-1 表示全部 */
  status?: number
}

/** 字典类型新增/修改表单：复用实体中的可编辑字段 */
export type DictForm = Pick<Dict, 'id' | 'name' | 'type' | 'status' | 'remark'>

/** 字典项实体（对应后端 DictItem.java / DictItemDTO.java） */
export interface DictItem {
  /** 主键 */
  id?: number
  /** 所属字典主键 */
  dictId?: number
  /** 字典项名称 */
  name?: string
  /** 字典项编码 */
  code?: number
  /** 状态：0-正常、1-停用 */
  status?: number
  /** 展示顺序 */
  order?: number
  /** 添加时间 */
  addTime?: string
  /** 更新时间 */
  updateTime?: string
  /** 备注 */
  remark?: string
}

/** 字典项搜索栏查询参数（含分页，前端表单形态） */
export interface DictItemQuery {
  /** 当前页码 */
  pageNum: number
  /** 每页条数 */
  pageSize: number
  /** 所属字典主键，-1 表示不按字典过滤 */
  dictId?: number
}

/** 字典项新增/修改表单：复用实体中的可编辑字段 */
export type DictItemForm = Pick<DictItem, 'id' | 'dictId' | 'name' | 'code' | 'status' | 'order' | 'remark'>

/** 字典下拉选项（queryDictList 返回结构，由后端 Dict 映射而来） */
export interface DictSelectOption {
  /** 字典主键 */
  dictId?: number
  /** 字典名称 */
  dictName?: string
  /** 字典标识 */
  dictType?: string
}
