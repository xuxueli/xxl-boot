/**
 * 权限校验工具模块
 *
 * 职责：
 *   - 统一处理权限（permission）和角色（role）校验逻辑；
 *   - 支持“与”“或”逻辑组合（hasPermiAnd / hasPermiOr / hasRoleAnd / hasRoleOr）；
 *   - 提供指令层级的校验接口（hasPermi / hasRole）。
 *
 * 权限模型：
 *   - 超级管理员：`*:*:*`（权限）或 `admin`（角色）拥有全局所有权限；
 *   - 非超管用户：仅限拥有的具体权限/角色集合。
 *
 * 使用示例：
 *   - 指令：v-permission="['system:user:add']"
 *   - 方法：checkPermi(['system:user:add', 'system:user:edit'])
 */

import { useUserStore } from '@/store'

/**
 * 内部权限校验函数
 * @param {string} permission - 待校验的权限字符串（如 "system:user:add"）
 * @returns {boolean} - 当前用户是否拥有该权限
 */
function authPermission(permission) {
  const all_permission = "*:*:*"
  const permissions = useUserStore().permissions
  if (permission && permission.length > 0) {
    return permissions.some(v => {
      return all_permission === v || v === permission
    })
  } else {
    return false
  }
}

/**
 * 内部角色校验函数
 * @param {string} role - 待校验的角色标识（如 "admin"）
 * @returns {boolean} - 当前用户是否拥有该角色
 */
function authRole(role) {
  const super_admin = "admin"
  const roles = useUserStore().roles
  if (role && role.length > 0) {
    return roles.some(v => {
      return super_admin === v || v === role
    })
  } else {
    return false
  }
}

/**
 * 校验用户是否拥有指定权限（数组形式，支持“或”逻辑）
 * @param {string[]} value - 权限标识数组（如 ['system:user:add', 'system:user:edit']）
 * @returns {boolean} - 当前用户是否拥有任意一个权限
 */
export function checkPermi(value) {
  if (value && value instanceof Array && value.length > 0) {
    const permissions = useUserStore().permissions
    const permissionDatas = value
    const all_permission = "*:*:*"
    const hasPermission = permissions.some(permission => {
      return all_permission === permission || permissionDatas.includes(permission)
    })
    if (!hasPermission) {
      return false
    }
    return true
  } else {
    console.error(`need roles! Like checkPermi="['system:user:add','system:user:edit']"`)
    return false
  }
}

/**
 * 校验用户是否拥有指定角色（数组形式，支持“或”逻辑）
 * @param {string[]} value - 角色标识数组（如 ['admin', 'editor']）
 * @returns {boolean} - 当前用户是否拥有任意一个角色
 */
export function checkRole(value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = useUserStore().roles
    const permissionRoles = value
    const super_admin = "admin"
    const hasRole = roles.some(role => {
      return super_admin === role || permissionRoles.includes(role)
    })
    if (!hasRole) {
      return false
    }
    return true
  } else {
    console.error(`need roles! Like checkRole="['admin','editor']"`)
    return false
  }
}

/**
 * 指令级权限/角色校验模块
 *
 * 供 v-permission 指令和 v-role 指令使用，封装了“与”“或”逻辑的便捷方法。
 */
export default {
  /**
   * 校验用户是否拥有指定权限（“或”逻辑）
   * @param {string} permission - 单个权限标识
   * @returns {boolean}
   */
  hasPermi(permission) {
    return authPermission(permission)
  },

  /**
   * 校验用户是否拥有权限数组中的任意一个（“或”逻辑）
   * @param {string[]} permissions - 权限标识数组
   * @returns {boolean}
   */
  hasPermiOr(permissions) {
    return permissions.some(item => {
      return authPermission(item)
    })
  },

  /**
   * 校验用户是否同时拥有权限数组中的所有权限（“与”逻辑）
   * @param {string[]} permissions - 权限标识数组
   * @returns {boolean}
   */
  hasPermiAnd(permissions) {
    return permissions.every(item => {
      return authPermission(item)
    })
  },

  /**
   * 校验用户是否拥有指定角色（“或”逻辑）
   * @param {string} role - 单个角色标识
   * @returns {boolean}
   */
  hasRole(role) {
    return authRole(role)
  },

  /**
   * 校验用户是否拥有角色数组中的任意一个（“或”逻辑）
   * @param {string[]} roles - 角色标识数组
   * @returns {boolean}
   */
  hasRoleOr(roles) {
    return roles.some(item => {
      return authRole(item)
    })
  },

  /**
   * 校验用户是否同时拥有角色数组中的所有角色（“与”逻辑）
   * @param {string[]} roles - 角色标识数组
   * @returns {boolean}
   */
  hasRoleAnd(roles) {
    return roles.every(item => {
      return authRole(item)
    })
  }
}