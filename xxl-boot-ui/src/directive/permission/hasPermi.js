/**
 * v-hasPermi 指令（操作权限控制）
 *
 * 【总体能力】
 * 1) 基于当前登录用户的权限集合，决定某个 DOM 元素是否可见；
 * 2) 支持“只要命中任一权限即通过”的权限匹配策略；
 * 3) 支持通配权限 `*:*:*`，命中后视为拥有全部操作权限。
 *
 * 【使用方式】
 * - 基础写法：v-hasPermi="['system:user:add']"
 * - 多权限任一命中：v-hasPermi="['system:user:add','system:user:edit']"
 *
 * 【实现思路（总 -> 分）】
 * - 总：在 mounted 阶段读取用户权限，校验指令入参，按规则判断是否有权限；
 * - 分：
 *   a) 参数合法时，执行权限匹配；
 *   b) 未命中权限时，直接从父节点移除当前元素；
 *   c) 参数不合法时，抛出明确错误，提醒按数组格式传入。
 */
import useUserStore from '@/store/modules/user'

export default {
  mounted(el, binding, vnode) {
    // 总：先准备“指令值 + 通配权限 + 当前用户权限集合”，再进入判断流程。
    // 分 1：获取指令传入的权限标识数组（期望类型：Array）。
    const { value } = binding
    // 分 2：定义“拥有全部权限”的通配标识。
    const all_permission = "*:*:*"
    // 分 3：读取当前用户的权限列表。
    const permissions = useUserStore().permissions

    // 总：仅在参数合法时执行权限判断；否则直接抛错提示。
    // 分 4：参数合法性校验（必须是非空数组）。
    if (value && value instanceof Array && value.length > 0) {
      // 分 5：保存指令要求的权限集合（满足其中任一项即可）。
      const permissionFlag = value

      // 分 6：进行权限匹配：
      // - 命中通配权限 `*:*:*` => 通过；
      // - 或用户任一权限存在于 permissionFlag 中 => 通过。
      const hasPermissions = permissions.some(permission => {
        return all_permission === permission || permissionFlag.includes(permission)
      })

      // 分 7：未命中任何权限时，移除当前元素，实现“无权限不可见”。
      if (!hasPermissions) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      // 分 8：入参不符合规范时，抛出错误提示调用方修正写法。
      throw new Error(`请设置操作权限标签值`)
    }
  }
}
