import { useUserStore } from '@/store'

/**
 * 操作权限指令
 *
 * 根据当前登录用户的权限列表，控制元素是否显示。
 * 匹配策略：用户权限与指令传入的权限列表做交集，命中任一即视为通过。
 * 超级通配符 *:*:* 表示拥有全部操作权限，直接通过。
 *
 * 用法：
 *   v-hasPermi="['system:user:add']"
 *   v-hasPermi="['system:user:add','system:user:edit']"  // 多权限任一命中
 */
export default {
  mounted(el, binding) {
    const { value } = binding
    if (value && Array.isArray(value) && value.length > 0) {
      if (!useUserStore().checkPermi(value)) {
        // 无权限，移除元素
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      // 参数非法，抛出错误
      throw new Error('请设置操作权限标签值')
    }
  }
}
