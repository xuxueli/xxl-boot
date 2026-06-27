/**
 * 名称：用户会话 Store
 * 描述：负责管理登录态、当前用户资料、角色权限以及退出登录等用户会话相关能力。
 *
 * 职责划分：
 * 1. state：保存 token、用户基础资料、角色与权限；
 * 2. actions：封装登录、拉取用户信息、退出登录流程；
 * 3. getters：当前模块未定义 getters，页面直接读取 state 中的响应式数据。
 */
import router from '@/router'
import cache from '@/plugins/cache'
import { ElMessageBox, } from 'element-plus'
import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { isHttp, isEmpty } from "@/utils/validate"
import defAva from '@/assets/images/profile.jpg'

/**
 * 模块名称：user（用户状态 Store）
 *
 * 职责概述：
 * - 统一维护当前登录用户在前端的核心身份状态，例如 token、基础资料、角色与权限。
 * - 对接登录、退出登录、获取用户信息等认证相关接口，并同步更新 Pinia 中的响应式状态。
 * - 处理用户头像地址兜底、密码安全提示、会话缓存写入等与登录态强相关的前端逻辑。
 *
 * 结构说明：
 * - state：仅保存当前会话下需要全局共享的用户数据。
 * - actions：承担异步请求与状态更新职责；当前模块未单独定义 getters/mutations，
 *   由 Pinia 直接通过 action 修改 state。
 */
const useUserStore = defineStore(
  'user',
  {
    // 一、状态区：描述“当前登录用户是谁、拥有什么权限、当前凭证是否有效”
    /**
     * 状态定义
     *
     * - token：当前登录令牌，初始化时直接从本地缓存恢复；
     * - id/name/nickName/avatar：当前登录用户的展示资料；
     * - roles/permissions：权限控制依赖的角色与权限标识集合。
     */
    state: () => ({
      // 登录令牌：初始化时优先从本地持久化存储中恢复，支持页面刷新后保持登录态
      token: getToken(),
      // 用户基础信息：在 getInfo 成功后回填，供页面展示与业务判断使用
      id: '',
      name: '',
      nickName: '',
      // 头像地址：支持后端返回绝对地址、相对地址，以及前端默认头像兜底
      avatar: '',
      // 角色与权限：供路由守卫、指令、按钮权限控制等场景实时读取
      roles: [],
      permissions: []
    }),
    // 二、行为区：负责串联接口调用、状态写入，以及登录后附带的前端交互逻辑
    /**
     * 动作方法定义
     *
     * 用户模块的所有核心行为都集中在 actions 中，方便页面以统一入口驱动登录态变化。
     */
    actions: {
      /**
       * 登录
       *
       * 只负责提交登录请求和落地 token；用户详情、角色权限等信息由 getInfo 单独加载。
       */
      login(userInfo) {
        // 先完成表单字段拆解与基础清洗，避免把原始对象直接透传到底层接口
        const username = userInfo.username.trim()
        const password = userInfo.password
        const code = userInfo.code
        const uuid = userInfo.uuid
        return new Promise((resolve, reject) => {
          login(username, password, code, uuid).then(res => {
            // 登录成功后，同时更新持久化 token 与 store 内存态，便于后续请求拦截器直接读取
            setToken(res.token)
            this.token = res.token
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      },
      /**
       * 获取用户信息
       *
       * 处理流程：
       * 1. 请求当前用户资料；
       * 2. 规范化头像地址，兼容默认头像、相对路径和完整 URL；
       * 3. 回填角色、权限和用户基础资料；
       * 4. 记录密码字符类型，并在必要时弹出密码安全提示。
       */
      getInfo() {
        return new Promise((resolve, reject) => {
          getInfo().then(res => {
            // 1）先提取后端返回的用户主体对象，后续资料字段均以此为来源
            const user = res.user

            // 2）头像地址标准化：
            //    - 后端已返回完整 http(s) 地址时直接使用；
            //    - 返回空值时使用默认头像；
            //    - 返回相对路径时，拼接系统配置的文件访问前缀。
            let avatar = user.avatar || ""
            // 头像地址兼容处理：空值走默认头像，相对路径补齐后端访问前缀。
            if (!isHttp(avatar)) {
              avatar = (isEmpty(avatar)) ? defAva : import.meta.env.VITE_APP_BASE_API + avatar
            }
            // 3）角色与权限写回全局状态：
            //    - 正常情况下以后端返回为准；
            //    - 若角色数组为空，则注入默认角色，避免权限链路出现空值分支。
            if (res.roles && res.roles.length > 0) { // 验证返回的roles是否是一个非空数组
              this.roles = res.roles
              this.permissions = res.permissions
            } else {
              this.roles = ['ROLE_DEFAULT']
            }

            // 4）同步基础资料，供页面头部、个人中心、路由守卫等模块复用
            this.id = user.userId
            this.name = user.userName
            this.nickName = user.nickName
            this.avatar = avatar

            // 5）补充会话级缓存，用于登录后其他页面读取密码字符类型等扩展信息
            cache.session.set('pwrChrtype', res.pwdChrtype)
            // 6）密码安全提示：
            //    - 初始密码：提醒用户尽快修改，并跳转至个人中心的修改密码页签；
            //    - 过期密码：仅在非初始密码场景下提示过期风险，避免重复弹窗。
            /* 初始密码提示：首次使用默认密码时，引导用户跳转修改密码页。 */
            if(res.isDefaultModifyPwd) {
              ElMessageBox.confirm('您的密码还是初始密码，请修改密码！',  '安全提示', {  confirmButtonText: '确定',  cancelButtonText: '取消',  type: 'warning' }).then(() => {
                router.push({ name: 'Profile', params: { activeTab: 'resetPwd' } })
              }).catch(() => {})
            }
            /* 过期密码提示：密码过期但不是初始密码时，同样引导尽快修改。 */
            if(!res.isDefaultModifyPwd && res.isPasswordExpired) {
              ElMessageBox.confirm('您的密码已过期，请尽快修改密码！',  '安全提示', {  confirmButtonText: '确定',  cancelButtonText: '取消',  type: 'warning' }).then(() => {
                router.push({ name: 'Profile', params: { activeTab: 'resetPwd' } })
              }).catch(() => {})
            }
            resolve(res)
          }).catch(error => {
            reject(error)
          })
        })
      },
      /**
       * 退出系统
       *
       * 成功退出后同步清空 token、角色、权限和本地令牌缓存，保证会话状态彻底重置。
       */
      logOut() {
        return new Promise((resolve, reject) => {
          logout(this.token).then(() => {
            // 退出成功后清空当前用户敏感状态，并移除本地 token，确保后续请求不会继续携带旧凭证
            this.token = ''
            this.roles = []
            this.permissions = []
            removeToken()
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      }
    }
  })

export default useUserStore
