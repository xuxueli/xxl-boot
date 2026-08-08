/**
 * 业务实体类型定义
 * 参照后端 Java 实体（xxl-boot-admin / xxl-boot-api 的 framework/model/entity/*.java）与前端实际使用字段
 */
import type { PageQuery } from './index'

/* ------------------------------ 用户 / 登录 ------------------------------ */

/** 用户实体（对应 User.java） */
export interface User {
  id?: number
  /** 组织ID */
  orgId?: number
  /** 组织名称（前端列表联查字段） */
  orgName?: string
  /** 账号 */
  username?: string
  /** 密码 */
  password?: string
  /** 真实姓名 */
  realName?: string
  /** 状态：0-正常、1-停用 */
  status?: number
  addTime?: string
  updateTime?: string
  [key: string]: unknown
}

/** 用户分页查询参数 */
export type UserQuery = PageQuery & {
  username?: string
  orgIds?: number[] | string
  status?: number
}

/** 用户表单（新增/修改入参） */
export type UserForm = Pick<User, 'id' | 'orgId' | 'username' | 'realName' | 'status' | 'password'> & {
  roleIds?: number[]
}

/** 登录入参 */
export interface LoginParams {
  username: string
  password: string
  captchaUuid?: string
  captchaResult?: string
  rememberMe?: boolean
}

/** 当前登录用户信息（getInfo/loginCheck 返回） */
export interface UserInfo {
  userId: number
  userName: string
  realName: string
  /** 角色标识集合 */
  roleList: string[]
  /** 权限标识集合 */
  permissionList: string[]
  [key: string]: unknown
}

/** 个人中心资料 */
export interface ProfileInfo {
  id?: number
  username?: string
  realName?: string
  orgId?: number
  orgName?: string
  email?: string
  phone?: string
  [key: string]: unknown
}

/* ------------------------------ 组织 ------------------------------ */

/** 组织实体（对应 Org.java） */
export interface Org {
  id?: number
  /** 父组织ID */
  parentId?: number
  name?: string
  order?: number
  /** 状态：0-正常、1-停用 */
  status?: number
  /** 负责人 */
  manager?: string
  addTime?: string
  updateTime?: string
  children?: Org[]
  [key: string]: unknown
}

/* ------------------------------ 菜单资源 ------------------------------ */

/** 资源实体（对应 Resource.java） */
export interface Resource {
  id?: number
  /** 父级资源ID */
  parentId?: number
  name?: string
  /** 资源类型：1-菜单、2-按钮等 */
  type?: number
  /** 权限标识 */
  permission?: string
  url?: string
  icon?: string
  order?: number
  /** 状态：0-正常、1-停用 */
  status?: number
  /** 是否可见：0-可见、1-隐藏 */
  visible?: number
  addTime?: string
  updateTime?: string
  children?: Resource[]
  [key: string]: unknown
}

/* ------------------------------ 角色 ------------------------------ */

/** 角色实体（对应 Role.java） */
export interface Role {
  id?: number
  name?: string
  /** 角色标识 */
  code?: string
  /** 状态：0-正常、1-停用 */
  status?: number
  order?: number
  addTime?: string
  updateTime?: string
  [key: string]: unknown
}

/* ------------------------------ 系统配置 / 字典 ------------------------------ */

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

/* ------------------------------ 日志 ------------------------------ */

/** 日志实体（对应 Log.java） */
export interface Log {
  id?: number
  /** 日志类型：0-操作日志、1-登录日志 */
  type?: number
  /** 系统模块编码 */
  module?: number
  title?: string
  content?: string
  /** 操作人 */
  operator?: string
  /** 操作IP */
  ip?: string
  addTime?: string
  updateTime?: string
  [key: string]: unknown
}

/* ------------------------------ 站内消息 ------------------------------ */

/** 站内消息实体（对应 Message.java） */
export interface Message {
  id?: number
  /** 分类：0-通知、1-公告 */
  category?: number
  title?: string
  content?: string
  /** 发送人 */
  sender?: string
  /** 状态：0-正常、1-下线 */
  status?: number
  addTime?: string
  updateTime?: string
  [key: string]: unknown
}

/* ------------------------------ 动态路由（后端菜单） ------------------------------ */

/** 后端菜单数据 → 前端路由（routes store transformRoutes 入参） */
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
