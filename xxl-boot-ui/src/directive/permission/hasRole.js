/**
 * v-hasRole 指令（角色权限控制）
 *
 * 【总体能力】
 * 1) 基于当前登录用户的角色集合，决定某个 DOM 元素是否可见；
 * 2) 支持“只要命中任一角色即通过”的角色匹配策略；
 * 3) 支持超级管理员角色 `admin`，命中后视为拥有全部角色权限。
 *
 * 【使用方式】
 * - 基础写法：v-hasRole="['admin']"
 * - 多角色任一命中：v-hasRole="['admin','common']"
 *
 * 【实现思路（总 -> 分）】
 * - 总：在 mounted 阶段读取用户角色，校验指令入参，按规则判断是否有角色权限；
 * - 分：
 *   a) 参数合法时，执行角色匹配；
 *   b) 未命中角色时，直接从父节点移除当前元素；
 *   c) 参数不合法时，抛出明确错误，提醒按数组格式传入。
 */
import useUserStore from '@/store/modules/user'

export default {
  mounted(el, binding, vnode) {
    // 总：先准备“指令值 + 超级管理员角色 + 当前用户角色集合”，再进入判断流程。
    // 分 1：获取指令传入的角色标识数组（期望类型：Array）。
    const { value } = binding
    // 分 2：定义“拥有全部角色权限”的超级管理员角色标识。
    const super_admin = "admin"
    // 分 3：读取当前用户的角色列表。
    const roles = useUserStore().roles

    // 总：仅在参数合法时执行角色判断；否则直接抛错提示。
    // 分 4：参数合法性校验（必须是非空数组）。
    if (value && value instanceof Array && value.length > 0) {
      // 分 5：保存指令要求的角色集合（满足其中任一项即可）。
      const roleFlag = value

      // 分 6：进行角色匹配：
      // - 命中超级管理员 `admin` => 通过；
      // - 或用户任一角色存在于 roleFlag 中 => 通过。
      const hasRole = roles.some(role => {
        return super_admin === role || roleFlag.includes(role)
      })

      // 分 7：未命中任何角色时，移除当前元素，实现“无角色不可见”。
      if (!hasRole) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      // 分 8：入参不符合规范时，抛出错误提示调用方修正写法。
      throw new Error(`请设置角色权限标签值`)
    }
  }
}
