/**
 * 插件名称：auth（权限与角色校验插件）
 *
 * 能力说明：
 * - 提供基于权限标识（permission）的鉴权工具函数：单权限、任一权限、全部权限三种模式
 * - 提供基于角色标识（role）的鉴权工具函数：单角色、任一角色、全部角色三种模式
 * - 超级管理员角色 "admin" 以及全局通配符权限 "*:*:*" 均可直接通过校验
 * - 权限数据和角色数据均从 Pinia 用户 store 中实时读取，无需手动传参
 *
 * 设计说明：
 * - 底层由两个私有函数 authPermission / authRole 完成实际比对逻辑
 * - 对外导出一个包含 6 个方法的对象，挂载到 Vue 全局属性（$auth）后可在组件中直接调用
 *
 * 典型用法（组件内）：
 *   // 判断是否具备单个权限
 *   this.$auth.hasPermi('system:user:add')
 *
 *   // 判断是否具备其中一个权限（OR 逻辑）
 *   this.$auth.hasPermiOr(['system:user:add', 'system:user:edit'])
 *
 *   // 判断是否同时具备所有权限（AND 逻辑）
 *   this.$auth.hasPermiAnd(['system:user:add', 'system:user:edit'])
 *
 *   // 角色判断同理
 *   this.$auth.hasRole('admin')
 *   this.$auth.hasRoleOr(['admin', 'editor'])
 *   this.$auth.hasRoleAnd(['admin', 'editor'])
 */
import useUserStore from '@/store/modules/user'

/**
 * 内部函数：校验当前用户是否拥有指定的单个权限标识
 *
 * 处理流程：
 * 1. 从用户 store 中读取当前用户的权限列表
 * 2. 若传入的 permission 有效，则遍历权限列表进行匹配
 * 3. 匹配规则：拥有全局通配符 "*:*:*" 或与目标权限完全相等，则视为通过
 * 4. permission 为空或无效时直接返回 false
 *
 * @param {string} permission - 需要校验的权限标识，例如 'system:user:add'
 * @returns {boolean} 是否通过校验
 */
function authPermission(permission) {
  // 全局通配符权限，拥有此权限的用户视为超级管理员，直接放行所有操作
  const all_permission = "*:*:*"
  // 从 Pinia store 实时获取当前登录用户的权限列表
  const permissions = useUserStore().permissions
  if (permission && permission.length > 0) {
    // 遍历权限列表：满足全局通配符或精确匹配目标权限，则返回 true
    return permissions.some(v => {
      return all_permission === v || v === permission
    })
  } else {
    // permission 参数为空，无法完成校验，直接返回 false
    return false
  }
}

/**
 * 内部函数：校验当前用户是否拥有指定的单个角色标识
 *
 * 处理流程：
 * 1. 从用户 store 中读取当前用户的角色列表
 * 2. 若传入的 role 有效，则遍历角色列表进行匹配
 * 3. 匹配规则：拥有超级管理员角色 "admin" 或与目标角色完全相等，则视为通过
 * 4. role 为空或无效时直接返回 false
 *
 * @param {string} role - 需要校验的角色标识，例如 'editor'
 * @returns {boolean} 是否通过校验
 */
function authRole(role) {
  // 超级管理员角色标识，拥有此角色直接放行所有角色校验
  const super_admin = "admin"
  // 从 Pinia store 实时获取当前登录用户的角色列表
  const roles = useUserStore().roles
  if (role && role.length > 0) {
    // 遍历角色列表：满足超级管理员或精确匹配目标角色，则返回 true
    return roles.some(v => {
      return super_admin === v || v === role
    })
  } else {
    // role 参数为空，无法完成校验，直接返回 false
    return false
  }
}

/**
 * 对外导出的鉴权工具对象
 *
 * 包含 6 个方法，分为权限（Permi）和角色（Role）两大类，
 * 每类各有三种校验模式：单项、任一（OR）、全部（AND）。
 *
 * 挂载方式（main.js）：
 *   app.config.globalProperties.$auth = auth
 *
 * 使用方式（组件内）：
 *   import { useAuth } from '@/plugins/auth'  // 直接引用
 *   或通过全局属性 this.$auth 调用
 */
export default {
  /**
   * 验证用户是否具备某单一权限
   *
   * @param {string} permission - 权限标识，例如 'system:user:add'
   * @returns {boolean} 是否拥有该权限
   */
  hasPermi(permission) {
    return authPermission(permission)
  },

  /**
   * 验证用户是否含有指定权限中的任意一个（OR 逻辑）
   * 只需匹配数组中的一项即视为通过
   *
   * @param {string[]} permissions - 权限标识数组，例如 ['system:user:add', 'system:user:edit']
   * @returns {boolean} 是否至少拥有其中一个权限
   */
  hasPermiOr(permissions) {
    return permissions.some(item => {
      return authPermission(item)
    })
  },

  /**
   * 验证用户是否同时拥有所有指定权限（AND 逻辑）
   * 必须全部命中才视为通过
   *
   * @param {string[]} permissions - 权限标识数组，例如 ['system:user:add', 'system:user:edit']
   * @returns {boolean} 是否拥有全部权限
   */
  hasPermiAnd(permissions) {
    return permissions.every(item => {
      return authPermission(item)
    })
  },

  /**
   * 验证用户是否具备某单一角色
   *
   * @param {string} role - 角色标识，例如 'editor'
   * @returns {boolean} 是否拥有该角色
   */
  hasRole(role) {
    return authRole(role)
  },

  /**
   * 验证用户是否含有指定角色中的任意一个（OR 逻辑）
   * 只需匹配数组中的一项即视为通过
   *
   * @param {string[]} roles - 角色标识数组，例如 ['admin', 'editor']
   * @returns {boolean} 是否至少拥有其中一个角色
   */
  hasRoleOr(roles) {
    return roles.some(item => {
      return authRole(item)
    })
  },

  /**
   * 验证用户是否同时拥有所有指定角色（AND 逻辑）
   * 必须全部命中才视为通过
   *
   * @param {string[]} roles - 角色标识数组，例如 ['admin', 'editor']
   * @returns {boolean} 是否拥有全部角色
   */
  hasRoleAnd(roles) {
    return roles.every(item => {
      return authRole(item)
    })
  }
}
