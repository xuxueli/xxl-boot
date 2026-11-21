/**
 * @fileoverview Codegen 类型定义
 * @description 代码生成表、字段实体与查询/表单类型，对应后端 Codegen.java、CodegenField.java、CodegenDTO.java
 * @author xuxueli 2026-11-21
 */
import type { ListQuery } from '@/types'

/** 代码生成表实体（对应后端 CodegenDTO.java） */
export interface CodegenTable {
  /** 主键 */
  id?: number
  /** 表名称 */
  tableName?: string
  /** 表描述 */
  tableComment?: string
  /** 备注 */
  remark?: string
  /** 生成包路径 */
  packageName?: string
  /** 生成模块名 */
  moduleName?: string
  /** 生成业务名 */
  businessName?: string
  /** 生成功能名 */
  functionName?: string
  /** 生成功能作者 */
  functionAuthor?: string
  /** 表单布局：1-单列、2-双列、3-三列 */
  formColNum?: number
  /** 使用的模板：crud-单表、tree-树表 */
  tplCategory?: string
  /** 前端模板类型，如 element-plus-typescript */
  tplWebType?: string
  /** 创建时间 */
  addTime?: string
  /** 更新时间 */
  updateTime?: string
}

/** 代码生成字段实体（对应后端 CodegenFieldDTO.java） */
export interface CodegenField {
  /** 主键 */
  id?: number
  /** 归属表编号 */
  codegenId?: number
  /** 列名称 */
  columnName?: string
  /** 列描述 */
  columnComment?: string
  /** Java 类型 */
  javaType?: string
  /** Java 属性名 */
  javaField?: string
  /** 是否为插入字段：1-是、0-否 */
  isInsert?: string
  /** 是否为编辑字段：1-是、0-否 */
  isEdit?: string
  /** 是否为列表字段：1-是、0-否 */
  isList?: string
  /** 是否为查询字段：1-是、0-否 */
  isQuery?: string
  /** 是否必填：1-是、0-否 */
  isRequired?: string
  /** 查询方式：EQ、NE、GT、GTE、LT、LTE、LIKE、BETWEEN */
  queryType?: string
  /** 显示类型：input、textarea、select、radio、checkbox、datetime、imageUpload、fileUpload、editor */
  htmlType?: string
  /** 字典类型 */
  dictType?: string
  /** 排序 */
  sort?: number
  /** 创建时间 */
  addTime?: string
  /** 更新时间 */
  updateTime?: string
}

/** 生成表详情（含字段列表，对应后端 CodegenDTO.java） */
export interface CodegenDetail extends CodegenTable {
  /** 字段列表 */
  fieldList?: CodegenField[]
}

/** 搜索栏查询参数（前端表单形态） */
export interface CodegenQuery {
  /** 当前页码 */
  pageNum: number
  /** 每页条数 */
  pageSize: number
  /** 表名称，模糊匹配 */
  tableName?: string
  /** 表描述，模糊匹配 */
  tableComment?: string
}

/** 列表接口请求参数（offset/pagesize 形态） */
export type CodegenListQuery = ListQuery<CodegenQuery>

/**
 * 更新生成配置表单
 *
 * 复用实体中的可编辑字段，并携带字段配置列表一并提交。
 */
export type CodegenForm = Pick<
  CodegenTable,
  | 'id'
  | 'tableName'
  | 'tableComment'
  | 'remark'
  | 'packageName'
  | 'moduleName'
  | 'businessName'
  | 'functionName'
  | 'functionAuthor'
  | 'formColNum'
  | 'tplCategory'
  | 'tplWebType'
> & {
  /** 字段配置列表 */
  fieldList?: CodegenField[]
}

/** 建表请求参数（对应后端 CreateTableRequest.java） */
export interface CreateTableRequest {
  /** 建表 SQL，可包含多条建表语句 */
  tableSql: string
  /** 前端模板类型 */
  tplWebType: string
}
