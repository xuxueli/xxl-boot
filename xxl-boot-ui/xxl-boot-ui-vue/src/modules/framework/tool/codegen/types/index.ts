/**
 * 类型定义：代码生成（tool/codegen 模块）
 * 覆盖代码生成表、字段实体结构。
 */

/** 代码生成表实体（后端 Codegen.java） */
export interface CodegenTable {
  id?: number
  tableName?: string
  tableComment?: string
  className?: string
  moduleName?: string
  author?: string
  addTime?: string
  updateTime?: string
  [key: string]: unknown
}

/** 代码生成字段实体（后端 CodegenField.java） */
export interface CodegenField {
  id?: number
  codegenId?: number
  columnName?: string
  columnComment?: string
  addTime?: string
  updateTime?: string
  [key: string]: unknown
}