/**
 * 名称：用户会话 Store
 * 功能：管理登录态、用户资料、角色权限、退出登录
 *
 * 分支说明：
 *   state   — token、用户资料、角色、权限
 *   actions — login / getInfo / logout
 */
import { create } from 'zustand'
import { login, logout, getInfo } from '@/api/login'
import { getToken, removeToken, setTokenWithAge } from '@/utils/auth'
import type { LoginInfo, LoginParams, Response } from '@/types'

/** 用户会话状态 */
interface UserState {
  /** 登录令牌，页面刷新后恢复 */
  token: string | undefined
  /** 用户 ID */
  id: string | number
  /** 用户名 */
  name: string
  /** 用户名称 */
  realName: string
  /** 角色标识集合 */
  roles: string[]
  /** 权限标识集合 */
  permissions: string[]
  /** 登录：提交凭证，保存 token */
  login: (userInfo: LoginParams) => Promise<void>
  /** 获取登录用户信息：拉取资料、角色、权限 */
  getInfo: () => Promise<Response<LoginInfo>>
  /** 退出登录：服务端登出，清空本地 token 与用户状态 */
  logout: () => Promise<void>
  /** 校验单个权限 */
  hasPermi: (permission: string) => boolean
  /** 校验多个权限（或逻辑） */
  hasPermiOr: (permissions: string[]) => boolean
  /** 校验多个权限（与逻辑） */
  hasPermiAnd: (permissions: string[]) => boolean
  /** 校验角色 */
  hasRole: (role: string) => boolean
  /** 校验多个角色（或逻辑） */
  hasRoleOr: (roles: string[]) => boolean
  /** 校验多个角色（与逻辑） */
  hasRoleAnd: (roles: string[]) => boolean
  /** 校验权限数组（或逻辑），供 Auth 组件使用 */
  checkPermi: (value: string[]) => boolean
  /** 校验角色数组（或逻辑），供 Auth 组件使用 */
  checkRole: (value: string[]) => boolean
}

/** 超级管理员角色标识 */
const SUPER_ADMIN_ROLE = 'admin'
/** 全权限通配符 */
const ALL_PERMISSION = '*:*:*'

export const useUserStore = create<UserState>((set, get) => ({
  // 登录令牌，页面刷新后恢复
  token: getToken(),
  // 用户 ID
  id: '',
  // 用户名
  name: '',
  // 用户名称
  realName: '',
  // 角色标识集合
  roles: [],
  // 权限标识集合
  permissions: [],

  /**
   * 登录：提交凭证，保存 token
   */
  login(userInfo: LoginParams) {
    const username = userInfo.username.trim()
    const password = userInfo.password
    const captchaResult = userInfo.captchaResult
    const captchaUuid = userInfo.captchaUuid
    const rememberMe = userInfo.rememberMe

    // 异步操作：
    return new Promise<void>((resolve, reject) => {
      login(username, password, captchaUuid, captchaResult)
        .then((res) => {
          const token = res.data
          const age = rememberMe ? 365 : 2 / 24 // 记住我：365天；默认，2H过期；
          set({ token })
          // 记住我：365天有效期，否则 session 过期
          setTokenWithAge(token, age)
          // 操作成功：
          resolve()
        })
        .catch((error) => {
          // 操作失败：
          reject(error)
        })
    })
  },

  /**
   * 获取登录用户信息：拉取资料、角色、权限，检查密码状态
   */
  getInfo() {
    return new Promise<Response<LoginInfo>>((resolve, reject) => {
      getInfo()
        .then((res) => {
          const data = res.data

          // 用户基础资料
          // 角色权限：后端有值则回填，无值设默认角色兜底
          if (data.roleList && data.roleList.length > 0) {
            set({
              id: data.userId,
              name: data.userName,
              realName: data.realName,
              roles: data.roleList,
              permissions: data.permissionList
            })
          } else {
            set({
              id: data.userId,
              name: data.userName,
              realName: data.realName,
              roles: [],
              permissions: []
            })
          }

          // success
          resolve(res)
        })
        .catch((error) => {
          // fail
          reject(error)
        })
    })
  },

  /**
   * 退出登录：服务端登出，清空本地 token 与用户状态
   */
  logout() {
    return new Promise<void>((resolve, reject) => {
      logout()
        .then(() => {
          set({ token: '', roles: [], permissions: [] })
          removeToken()
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  /**
   * 校验单个权限
   */
  hasPermi(permission: string) {
    if (permission && permission.length > 0) {
      return get().permissions.some((v) => ALL_PERMISSION === v || v === permission)
    }
    return false
  },

  /**
   * 校验多个权限（或逻辑）
   */
  hasPermiOr(permissions: string[]) {
    return permissions.some((item) => get().hasPermi(item))
  },

  /**
   * 校验多个权限（与逻辑）
   */
  hasPermiAnd(permissions: string[]) {
    return permissions.every((item) => get().hasPermi(item))
  },

  /**
   * 校验角色
   */
  hasRole(role: string) {
    if (role && role.length > 0) {
      return get().roles.some((v) => SUPER_ADMIN_ROLE === v || v === role)
    }
    return false
  },

  /**
   * 校验多个角色（或逻辑）
   */
  hasRoleOr(roles: string[]) {
    return roles.some((item) => get().hasRole(item))
  },

  /**
   * 校验多个角色（与逻辑）
   */
  hasRoleAnd(roles: string[]) {
    return roles.every((item) => get().hasRole(item))
  },

  /**
   * 校验权限数组（或逻辑），供 Auth 组件使用
   */
  checkPermi(value: string[]) {
    if (value && Array.isArray(value) && value.length > 0) {
      return get().permissions.some((permission) => ALL_PERMISSION === permission || value.includes(permission))
    }
    return false
  },

  /**
   * 校验角色数组（或逻辑），供 Auth 组件使用
   */
  checkRole(value: string[]) {
    if (value && Array.isArray(value) && value.length > 0) {
      return get().roles.some((role) => SUPER_ADMIN_ROLE === role || value.includes(role))
    }
    return false
  }
}))
