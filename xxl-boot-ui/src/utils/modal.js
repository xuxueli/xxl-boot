/**
 * modal - 统一消息 / 对话框 / 通知 / 全局 Loading
 *
 * 封装 element-plus 交互组件，保持全项目交互风格一致。
 *
 * 用法（Options API）：
 *   this.$modal.msgSuccess('保存成功')
 *   this.$modal.confirm('确认删除？').then(() => {})
 *
 * 用法（Composition API）：
 *   import modal from '@/utils/modal'
 *   modal.msgSuccess('保存成功')
 */
import { ElMessage, ElMessageBox, ElNotification, ElLoading } from 'element-plus'

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

  // ==================== 交互确认（ElMessageBox，返回 Promise） ====================

  /**
   * 确认框：返回 Promise，调用方在 then/catch 中处理"确定/取消"
   *   modal.confirm('确认删除？').then(() => { 确定操作 }).catch(() => { 取消 })
   */
  confirm(content) {
    return ElMessageBox.confirm(content, "系统提示", {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: "warning",
    })
  },
  /**
   * 输入框：返回 Promise<{ value: string }>，then 中获取用户输入
   *   modal.prompt('请输入原因').then(({ value }) => { ... })
   */
  prompt(content) {
    return ElMessageBox.prompt(content, "系统提示", {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: "warning",
    })
  },

  // ==================== 全局遮罩（ElLoading） ====================

  /**
   * 打开全屏遮罩，记录实例引用供 closeLoading 关闭
   * @param {string} content - 遮罩上显示的提示文字
   */
  loading(content) {
    loadingInstance = ElLoading.service({
      lock: true,
      text: content,
      background: "rgba(0, 0, 0, 0.7)",
    })
  },
  /**
   * 关闭全屏遮罩，与 loading 成对调用
   */
  closeLoading() {
    loadingInstance.close()
  }
}
