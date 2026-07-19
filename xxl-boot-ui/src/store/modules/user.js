/**
 * 名称：用户会话 Store
 * 功能：管理登录态、用户资料、角色权限、退出登录
 *
 * 分支说明：
 *   state   — token、用户资料、角色、权限
 *   actions — login / getInfo / logout
 */
import router from '@/router'
import cache from '@/utils/cache'
import { ElMessageBox, } from 'element-plus'
import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { isHttp, isEmpty } from "@/utils/validate"
import defAva from '@/assets/images/profile.jpg'

const useUserStore = defineStore(
  'user',
  {
    /**
     * state —
     *    - 登录凭证、用户身份
     *    - 角色/权限数据
     */
    state: () => ({
      token: getToken(),       // 登录令牌，页面刷新后恢复
      id: '',                  // 用户 ID
      name: '',                // 用户名
      nickName: '',            // 昵称
      avatar: '',              // 头像地址
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
      login(userInfo) {
        const username = userInfo.username.trim()
        const password = userInfo.password
        const code = userInfo.code
        const uuid = userInfo.uuid

        // 异步操作：
        return new Promise((resolve, reject) => {
          login(username, password, code, uuid).then(res => {
            setToken(res.token)
            this.token = res.token
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
        return new Promise((resolve, reject) => {
          getInfo().then(res => {
            const user = res.user

            // 头像：空值兜底默认头像，相对路径拼接访问前缀
            let avatar = user.avatar || ""
            if (!isHttp(avatar)) {
              avatar = (isEmpty(avatar)) ? defAva : import.meta.env.VITE_APP_BASE_API + avatar
            }
            // 用户基础资料
            this.id = user.userId
            this.name = user.userName
            this.nickName = user.nickName
            this.avatar = avatar
            // 角色权限：后端有值则回填，无值设默认角色兜底
            if (res.roles && res.roles.length > 0) {
              this.roles = res.roles
              this.permissions = res.permissions
            } else {
              this.roles = []
              this.permissions = []
            }

            // 缓存密码字符类型，供其他页面读取
            cache.session.set('pwrChrtype', res.pwdChrtype)
            // 初始密码或密码过期，弹安全提示并引导修改密码
            if(res.isDefaultModifyPwd) {
              ElMessageBox.confirm('您的密码还是初始密码，请修改密码！',  '安全提示', {  confirmButtonText: '确定',  cancelButtonText: '取消',  type: 'warning' }).then(() => {
                router.push({ name: 'Profile', params: { activeTab: 'resetPwd' } })
              }).catch(() => {})
            }
            if(!res.isDefaultModifyPwd && res.isPasswordExpired) {
              ElMessageBox.confirm('您的密码已过期，请尽快修改密码！',  '安全提示', {  confirmButtonText: '确定',  cancelButtonText: '取消',  type: 'warning' }).then(() => {
                router.push({ name: 'Profile', params: { activeTab: 'resetPwd' } })
              }).catch(() => {})
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
        return new Promise((resolve, reject) => {
          logout(this.token).then(() => {
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
      hasPermi(permission) {
        const all_permission = "*:*:*"
        if (permission && permission.length > 0) {
          return this.permissions.some(v => all_permission === v || v === permission)
        }
        return false
      },
      /**
       * 校验多个权限（或逻辑）
       */
      hasPermiOr(permissions) {
        return permissions.some(item => this.hasPermi(item))
      },
      /**
       * 校验多个权限（与逻辑）
       */
      hasPermiAnd(permissions) {
        return permissions.every(item => this.hasPermi(item))
      },
      /**
       * 校验角色
       */
      hasRole(role) {
        const super_admin = "admin"
        if (role && role.length > 0) {
          return this.roles.some(v => super_admin === v || v === role)
        }
        return false
      },
      /**
       * 校验多个角色（或逻辑）
       */
      hasRoleOr(roles) {
        return roles.some(item => this.hasRole(item))
      },
      /**
       * 校验多个角色（与逻辑）
       */
      hasRoleAnd(roles) {
        return roles.every(item => this.hasRole(item))
      },
      /**
       * 校验权限数组（或逻辑），供指令使用
       */
      checkPermi(value) {
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
      checkRole(value) {
        if (value && Array.isArray(value) && value.length > 0) {
          const super_admin = "admin"
          return this.roles.some(role => super_admin === role || value.includes(role))
        }
        return false
      }
    }
  })

export default useUserStore
