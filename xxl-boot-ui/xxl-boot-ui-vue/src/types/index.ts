/**
 * 通用基础结构（types/index.ts）
 * 覆盖项目通用类型：后端统一返回、分页、枚举数据、字典数据、登录认证、动态路由、页面 UI 状态等
 * 对应后端 com.xxl.tool.response.Response、com.xxl.sso.core.model.LoginInfo 等
 */
import type { FormRules } from 'element-plus'

// --------------------------------- 通用返回结构 ---------------------------------

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
 * 列表请求参数工具类型
 * 由「搜索栏表单查询类型」派生为「列表接口请求类型」：
 * - 去除前端分页字段（pageNum/pageSize）
 * - 补充后端分页字段（offset/pagesize）
 * - 筛选字段全部可选（允许只传分页或空对象）
 *
 * 用法：export type RoleListQuery = ListQuery<RoleQuery>
 */
export type ListQuery<T extends object> = PageQuery & Partial<Omit<T, 'pageNum' | 'pageSize'>>

// --------------------------------- 枚举数据（loadEnumItem） ---------------------------------

/**
 * 枚举项统一结构
 * 对应 loadEnumItem 接口返回项（如 MessageCategoryEnum、MessageStatusEnum）
 */
export interface EnumOption {
  /** 枚举编码 */
  code: number | string
  /** 展示标题 */
  title?: string
  [key: string]: unknown
}

// --------------------------------- 字典数据（useDict / loadDictItem） ---------------------------------

/**
 * 字典项通用结构（useDict 组合式函数返回的每一项）
 * 由后端 loadDictItem 字段映射为 { label, value }，供 el-option / DictTag 使用
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

// --------------------------------- 登录认证 ---------------------------------

/**
 * 登录用户信息
 * 对应 xxl-sso（com.xxl.sso.core.model.LoginInfo），/auth/loginCheck 返回
 */
export interface LoginInfo {
  /** 用户ID */
  userId: string | number
  /** 用户名 */
  userName: string
  /** 真实姓名 */
  realName: string
  /** 附加信息 */
  extraInfo?: Record<string, string>
  /** 角色标识集合 */
  roleList: string[]
  /** 权限标识集合 */
  permissionList: string[]
  [key: string]: unknown
}

// --------------------------------- 动态路由（后端菜单） ---------------------------------

/**
 * 后端菜单数据 → 前端路由
 * 对应 store/modules/routes.ts transformRoutes 入参
 */
export interface MenuRoute {
  path?: string
  component?: string
  name?: string
  redirect?: string
  hidden?: boolean
  alwaysShow?: boolean
  meta?: {
    title?: string
    icon?: string
    activeMenu?: string
    affix?: boolean
    hidden?: boolean
    query?: Record<string, string>
    [key: string]: unknown
  }
  children?: MenuRoute[]
  [key: string]: unknown
}

// --------------------------------- 页面 UI 状态（列表页通用） ---------------------------------

/**
 * 表格 UI 状态（列表页通用）
 * 覆盖列表/分页/加载/搜索栏/多选等常见表格状态
 */
export interface TableState<T = unknown> {
  /** 数据列表 */
  list: T[]
  /** 总条数（分页接口） */
  total: number
  /** 加载状态 */
  loading: boolean
  /** 是否显示搜索栏 */
  showSearch?: boolean
  /** 选中行 ID 数组 */
  ids: number[]
  /** 是否单选（多选数量不为 1 时禁用"修改"） */
  single?: boolean
  /** 是否多选（无选中时禁用"删除"） */
  multiple?: boolean
}

/**
 * 表单弹窗 UI 状态（列表页通用）
 * 覆盖弹窗显隐、标题、表单数据与校验规则
 */
export interface FormState<T = unknown> {
  /** 弹窗显隐 */
  visible: boolean
  /** 弹窗标题 */
  title: string
  /** 表单数据 */
  form: T
  /** 校验规则 */
  rules: FormRules
}
