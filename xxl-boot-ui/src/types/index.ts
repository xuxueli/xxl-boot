/**
 * 统一类型定义
 * 对应后端统一返回结构（com.xxl.tool.response.Response）与分页结构（Response<PageModel>）
 */

/**
 * 后端统一返回结构
 * - code：200 成功，301 未授权，其他为业务失败
 * - msg：提示信息
 * - data：返回数据
 */
export interface Response<T = unknown> {
  code: number
  msg: string
  data: T
}

/**
 * 后端分页返回结构（存放于 response.data）
 * - data：数据列表
 * - total：总条数
 */
export interface PageModel<T> {
  data: T[]
  total: number
}

/**
 * 分页查询入参（后端约定 offset / pagesize）
 * - 前端页面通常以 pageNum/pageSize 组织，调用接口时转换为 offset/pagesize
 */
export interface PageQuery {
  offset: number
  pagesize: number
  [key: string]: unknown
}

/**
 * 字典项/枚举项统一结构
 * 对应 loadEnumItem、loadDictItem 等接口返回项
 */
export interface DictOption {
  /** 枚举/字典编码 */
  code: number | string
  /** 展示标题 */
  title?: string
  name?: string
  [key: string]: unknown
}

/**
 * 字典项通用结构（useDict 组合式函数返回的每一项）
 * 由后端字段映射为 { label, value } 供 el-option / DictTag 使用
 */
export interface DictTagOption {
  /** 展示文案 */
  label?: string | number
  /** 字典值 */
  value?: number | string
  /** Element Plus 标签类型（预留） */
  elTagType?: string
  /** Element Plus 标签自定义类（预留） */
  elTagClass?: string
}
