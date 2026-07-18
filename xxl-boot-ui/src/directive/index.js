/**
 * 自定义指令注册入口
 * 注册三个全局指令：
 *   v-hasPermi  - 根据操作权限字符串控制元素显隐，支持通配符 *:*:*
 *   v-hasRole   - 根据角色标识控制元素显隐，admin 为超级管理员
 *   v-copyText  - 点击元素复制指定文本到剪贴板，支持回调通知
 */
import hasRole from './modules/hasRole'
import hasPermi from './modules/hasPermi'
import copyText from './modules/copyText'

export default function directive(app) {
  app.directive('hasRole', hasRole)
  app.directive('hasPermi', hasPermi)
  app.directive('copyText', copyText)
}
