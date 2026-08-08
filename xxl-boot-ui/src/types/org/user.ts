/**
 * 用户相关类型定义
 * 对应后端 User.java（用户管理 CRUD）与个人中心资料
 */
import type { PageQuery } from '../index'

/** 用户实体（对应 User.java，用户管理 CRUD） */
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
