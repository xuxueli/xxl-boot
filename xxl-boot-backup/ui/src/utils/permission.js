/**
 * 权限校验工具模块（permission.js）
 *
 * 职责：
 *   - 提供前端按钮/菜单级别的权限与角色校验工具函数。
 *   - 从 Pinia user store 中读取当前用户的权限标识列表和角色列表。
 *   - 支持超级管理员（权限标识 *:*:* / 角色 admin）自动通过所有校验。
 *   - 通常配合 v-hasPermi、v-hasRole 自定义指令或 v-if 条件渲染使用。
 *
 * 依赖：
 *   - @/store/modules/user   Pinia 用户 store（permissions / roles 字段）
 *
 * 典型用法：
 *   import { checkPermi, checkRole } from '@/utils/permission'
 *   // 在组件中校验
 *   if (checkPermi(['system:user:add'])) { ... }
 *   if (checkRole(['admin'])) { ... }
 */
import useUserStore from '@/store/modules/user'

/**
 * 字符权限校验
 *
 * 判断当前用户是否拥有给定权限标识列表中的任意一个权限。
 * 超级管理员（权限标识包含 *:*:*）始终返回 true。
 *
 * @param {string[]} value - 需要校验的权限标识数组，如 ['system:user:add', 'system:user:edit']
 * @returns {boolean} true 表示有权限，false 表示无权限或参数不合法
 */
export function checkPermi(value) {
  if (value && value instanceof Array && value.length > 0) {
    const permissions = useUserStore().permissions
    const permissionDatas = value
    const all_permission = "*:*:*"

    // some() 短路优化：只要找到一个匹配即返回 true
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
 * 角色权限校验
 *
 * 判断当前用户是否属于给定角色列表中的任意一个角色。
 * 超级管理员角色（admin）始终返回 true。
 *
 * @param {string[]} value - 需要校验的角色名称数组，如 ['admin', 'editor']
 * @returns {boolean} true 表示拥有对应角色，false 表示无对应角色或参数不合法
 */
export function checkRole(value) {
  if (value && value instanceof Array && value.length > 0) {
    const roles = useUserStore().roles
    const permissionRoles = value
    const super_admin = "admin"

    // some() 短路优化：只要找到一个匹配即返回 true
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