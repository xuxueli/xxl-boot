/**
 * 名称：用户会话 Store
 * 功能：管理登录态、用户资料、角色权限、退出登录
 *
 * 分支说明：
 *   state   — token、用户资料、角色、权限
 *   actions — login / getInfo / logout
 */
import { defineStore } from 'pinia'
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
}

const useUserStore = defineStore(
  'user',
  {
    /**
     * state —
     *    - 登录凭证、用户身份
     *    - 角色/权限数据
     */
    state: (): UserState => ({
      token: getToken(),       // 登录令牌，页面刷新后恢复
      id: '',                  // 用户 ID
      name: '',                // 用户名
      realName: '',            // 用户名称
      roles: [],               // 角色标识集合
      permissions: []          // 权限标识集合
    }),
    /**
     * actions
     *    — 登录 / 获取登录用户信息 / 退出登录
     *    - 权限校验
      */
    actions: {
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
          login(username, password, captchaUuid, captchaResult).then(res => {
            this.token = res.data
            const age = rememberMe ? 365 : 2 / 24     // 记住我：365天；默认，2H过期；

            // 记住我：365天有效期，否则 session 过期
            setTokenWithAge(this.token, age)

            // 操作成功：
            resolve()
          }).catch(error => {
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
          getInfo().then(res => {
            const data = res.data

            // 用户基础资料
            this.id = data.userId
            this.name = data.userName
            this.realName = data.realName
            // 角色权限：后端有值则回填，无值设默认角色兜底
            if (data.roleList && data.roleList.length > 0) {
              this.roles = data.roleList
              this.permissions = data.permissionList
            } else {
              this.roles = []
              this.permissions = []
            }

            // success
            resolve(res)
          }).catch(error => {
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
          logout().then(() => {
            this.token = ''
            this.roles = []
            this.permissions = []
            removeToken()
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      },
      /**
       * 校验单个权限
       */
      hasPermi(permission: string) {
        const all_permission = "*:*:*"
        if (permission && permission.length > 0) {
          return this.permissions.some(v => all_permission === v || v === permission)
        }
        return false
      },
      /**
       * 校验多个权限（或逻辑）
       */
      hasPermiOr(permissions: string[]) {
        return permissions.some(item => this.hasPermi(item))
      },
      /**
       * 校验多个权限（与逻辑）
       */
      hasPermiAnd(permissions: string[]) {
        return permissions.every(item => this.hasPermi(item))
      },
      /**
       * 校验角色
       */
      hasRole(role: string) {
        const super_admin = "admin"
        if (role && role.length > 0) {
          return this.roles.some(v => super_admin === v || v === role)
        }
        return false
      },
      /**
       * 校验多个角色（或逻辑）
       */
      hasRoleOr(roles: string[]) {
        return roles.some(item => this.hasRole(item))
      },
      /**
       * 校验多个角色（与逻辑）
       */
      hasRoleAnd(roles: string[]) {
        return roles.every(item => this.hasRole(item))
      },
      /**
       * 校验权限数组（或逻辑），供指令使用
       */
      checkPermi(value: string[]) {
        if (value && Array.isArray(value) && value.length > 0) {
          const all_permission = "*:*:*"
          return this.permissions.some(permission =>
            all_permission === permission || value.includes(permission)
          )
        }
        return false
      },
      /**
       * 校验角色数组（或逻辑），供指令使用
       */
      checkRole(value: string[]) {
        if (value && Array.isArray(value) && value.length > 0) {
          const super_admin = "admin"
          return this.roles.some(role => super_admin === role || value.includes(role))
        }
        return false
      }
    }
  })

export default useUserStore
