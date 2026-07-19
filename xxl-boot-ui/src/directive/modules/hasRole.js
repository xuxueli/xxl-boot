import { useUserStore } from '@/store'

/**
 * 角色权限指令
 *
 * 根据当前登录用户的角色列表，控制元素是否显示。
 * 匹配策略：用户角色与指令传入的角色列表做交集，命中任一即视为通过。
 * admin 角色为超级管理员，直接通过。
 *
 * 用法：
 *   v-hasRole="['admin']"
 *   v-hasRole="['admin','common']"  // 多角色任一命中
 */
export default {
  mounted(el, binding) {
    const userStore = useUserStore()
    // role data
    const { value } = binding
    if (value && Array.isArray(value) && value.length > 0) {
      // 无角色，移除元素
      if (!userStore.checkRole(value)) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      // 参数非法，抛出错误
      throw new Error('请设置角色权限标签值')
    }
  }
}
