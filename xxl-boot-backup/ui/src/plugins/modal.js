import { ElMessage, ElMessageBox, ElNotification, ElLoading } from 'element-plus'

/**
 * Plugin（插件模块）说明：`modal.js`
 *
 * 一、定义（是什么）
 * - Plugin 是“面向应用级能力注入”的模块，通常通过 `app.config.globalProperties` 暴露统一入口。
 * - 本文件提供统一的消息提示、通知、确认框、输入框、全局遮罩等交互能力，避免页面重复封装。
 *
 * 二、特性（与 util 的职责差异）
 * - plugin：偏全局能力、可注入、可统一约束交互风格。
 * - util：偏局部工具、即引即用、通常更接近纯函数。
 * - plugin 常与 UI 框架/运行上下文耦合；util 更强调输入输出与算法复用。
 *
 * 三、能力（本文件提供）
 * - 消息：info / success / warning / error。
 * - 提示框：alert / confirm / prompt。
 * - 通知：ElNotification 四种类型统一封装。
 * - 遮罩：打开/关闭全局 loading，并复用同一实例引用。
 *
 * 四、典型用法
 * ```js
 * // main.js 中注入后（见 plugins/index.js）
 * app.config.globalProperties.$modal = modal
 *
 * // Options API
 * this.$modal.msgSuccess('保存成功')
 *
 * // Composition API
 * const { proxy } = getCurrentInstance()
 * proxy.$modal.confirm('确认删除？').then(() => {})
 * ```
 *
 * 五、plugin vs util 对比（维护参考）
 * - 定义：plugin 是“应用能力扩展层”；util 是“通用函数能力层”。
 * - 特性：plugin 偏全局入口与副作用；util 偏低耦合、可独立复用。
 * - 能力：plugin 适合弹窗、缓存、下载、页签等系统能力；util 适合数据处理、格式化、校验。
 * - 用法：plugin 先安装再使用；util 直接 import 调用。
 *
 * 六、导出模式示例（维护参考）
 * 1) 默认导出对象（本文件采用）
 * ```js
 * export default { msgSuccess() {} }
 * import modal from '@/plugins/modal'
 * ```
 *    - 优势：语义直观、调用简单，适合作为单模块默认入口。
 *    - 适合场景：`modal.js` 这类“一个文件对应一个能力对象”的插件文件。
 * 2) install 插件导出
 * ```js
 * export default { install(app) { app.config.globalProperties.$modal = modal } }
 * app.use(modalPlugin)
 * ```
 *    - 优势：可标准化接入 Vue 插件生命周期，便于统一注册与扩展。
 *    - 适合场景：需要在安装阶段注入多个全局能力，或需要按环境做初始化逻辑。
 * 3) 命名导出 + 聚合导出
 * ```js
 * export const modal = { msgSuccess() {} }
 * export { modal } from './modal'
 * ```
 *    - 优势：便于按需引入与多模块聚合导出，命名更清晰。
 *    - 适合场景：插件能力被拆分为多个子模块，需在 `plugins/index.js` 统一组织时。
 */
let loadingInstance

export default {
  // ==================== 一、轻量消息（Message） ====================
  // 信息消息：用于普通流程提示
  msg(content) {
    ElMessage.info(content)
  },
  // 错误消息：用于失败场景提示
  msgError(content) {
    ElMessage.error(content)
  },
  // 成功消息：用于操作成功反馈
  msgSuccess(content) {
    ElMessage.success(content)
  },
  // 警告消息：用于风险但可继续的提示
  msgWarning(content) {
    ElMessage.warning(content)
  },
  // ==================== 二、对话框（MessageBox） ====================
  // 普通提示框：只需确认，不关心返回值
  alert(content) {
    ElMessageBox.alert(content, "系统提示")
  },
  // 错误提示框：强调错误语义（type = error）
  alertError(content) {
    ElMessageBox.alert(content, "系统提示", { type: 'error' })
  },
  // 成功提示框：强调成功语义（type = success）
  alertSuccess(content) {
    ElMessageBox.alert(content, "系统提示", { type: 'success' })
  },
  // 警告提示框：强调警告语义（type = warning）
  alertWarning(content) {
    ElMessageBox.alert(content, "系统提示", { type: 'warning' })
  },
  // ==================== 三、通知（Notification） ====================
  // 信息通知：通常用于非阻塞式状态提示
  notify(content) {
    ElNotification.info(content)
  },
  // 错误通知
  notifyError(content) {
    ElNotification.error(content)
  },
  // 成功通知
  notifySuccess(content) {
    ElNotification.success(content)
  },
  // 警告通知
  notifyWarning(content) {
    ElNotification.warning(content)
  },
  // ==================== 四、交互确认（Promise） ====================
  // 确认框：返回 Promise，调用方可在 then/catch 中处理“确定/取消”
  confirm(content) {
    return ElMessageBox.confirm(content, "系统提示", {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: "warning",
    })
  },
  // 输入框：返回 Promise，调用方可获取输入结果
  // 与 confirm 对比：confirm 只确认“是否继续”；prompt 额外采集用户输入（如备注、原因、名称）
  prompt(content) {
    return ElMessageBox.prompt(content, "系统提示", {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: "warning",
    })
  },
  // ==================== 五、全局遮罩（Loading） ====================
  // 打开遮罩层：记录实例引用，便于后续统一关闭
  loading(content) {
    loadingInstance = ElLoading.service({
      lock: true,
      text: content,
      background: "rgba(0, 0, 0, 0.7)",
    })
  },
  // 关闭遮罩层：与 loading 成对调用
  closeLoading() {
    loadingInstance.close()
  }
}
