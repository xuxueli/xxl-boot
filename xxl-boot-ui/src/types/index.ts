/**
 * 通用基础结构（types/index.ts）
 * 覆盖项目通用类型：后端统一返回、分页、枚举数据、字典数据、登录认证、动态路由等
 * 对应后端 com.xxl.tool.response.Response、com.xxl.sso.core.model.LoginInfo 等
 */


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
 * 登录入参
 * 对应 /auth/login 登录接口请求体
 */
export interface LoginParams {
  username: string
  password: string
  captchaUuid?: string
  captchaResult?: string
  rememberMe?: boolean
}

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
