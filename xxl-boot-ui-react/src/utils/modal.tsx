/**
 * modal - 统一消息 / 对话框 / 通知 / 全局 Loading
 *
 * 封装 antd 交互组件，保持全项目交互风格一致。
 *
 * 用法：
 *   import modal from '@/utils/modal'
 *   modal.msgSuccess('保存成功')
 *   modal.confirm('确认删除？').then(() => {})
 */
import { message, Modal, notification, Input } from 'antd'

// 全局 Loading key：用于关闭全局 loading 提示
const LOADING_KEY = 'xxl-boot-global-loading'

export default {
  // ==================== 一、轻量消息（Message） ====================
  /** 信息消息：用于普通流程提示 */
  msg(content: string): void {
    message.info(content)
  },
  /** 错误消息：用于失败场景提示 */
  msgError(content: string): void {
    message.error(content)
  },
  /** 成功消息：用于操作成功反馈 */
  msgSuccess(content: string): void {
    message.success(content)
  },
  /** 警告消息：用于风险但可继续的提示 */
  msgWarning(content: string): void {
    message.warning(content)
  },

  // ==================== 二、对话框（Modal） ====================
  /** 普通提示框：只需确认，不关心返回值 */
  alert(content: string): void {
    Modal.info({ title: '系统提示', content })
  },
  /** 错误提示框：强调错误语义 */
  alertError(content: string): void {
    Modal.error({ title: '系统提示', content })
  },
  /** 成功提示框：强调成功语义 */
  alertSuccess(content: string): void {
    Modal.success({ title: '系统提示', content })
  },
  /** 警告提示框：强调警告语义 */
  alertWarning(content: string): void {
    Modal.warning({ title: '系统提示', content })
  },

  // ==================== 三、通知（Notification） ====================
  /** 信息通知：通常用于非阻塞式状态提示 */
  notify(content: string): void {
    notification.info({ message: content })
  },
  /** 错误通知 */
  notifyError(content: string): void {
    notification.error({ message: content })
  },
  /** 成功通知 */
  notifySuccess(content: string): void {
    notification.success({ message: content })
  },
  /** 警告通知 */
  notifyWarning(content: string): void {
    notification.warning({ message: content })
  },

  // ==================== 交互确认（返回 Promise） ====================

  /**
   * 确认框：返回 Promise，调用方在 then/catch 中处理"确定/取消"
   *   modal.confirm('确认删除？').then(() => { 确定操作 }).catch(() => { 取消 })
   */
  confirm(content: string): Promise<unknown> {
    return new Promise((resolve, reject) => {
      Modal.confirm({
        title: '系统提示',
        content,
        okText: '确定',
        cancelText: '取消',
        centered: true,
        onOk: () => {
          resolve(undefined)
        },
        onCancel: () => {
          reject(new Error('cancel'))
        }
      })
    })
  },

  /**
   * 输入框：返回 Promise<{ value: string }>，then 中获取用户输入
   *   modal.prompt('请输入原因').then(({ value }) => { ... })
   */
  prompt(content: string): Promise<{ value: string }> {
    return new Promise((resolve, reject) => {
      let inputValue = ''
      Modal.confirm({
        title: '系统提示',
        content: (
          <div>
            <div style={{ marginBottom: 8 }}>{content}</div>
            <Input
              placeholder="请输入"
              onChange={(e) => {
                inputValue = e.target.value
              }}
            />
          </div>
        ),
        okText: '确定',
        cancelText: '取消',
        centered: true,
        onOk: () => {
          resolve({ value: inputValue })
        },
        onCancel: () => {
          reject(new Error('cancel'))
        }
      })
    })
  },

  // ==================== 全局遮罩（Loading） ====================

  /**
   * 打开全局 Loading 提示，记录 key 供 closeLoading 关闭
   * @param content 遮罩上显示的提示文字
   */
  loading(content: string): void {
    message.open({ key: LOADING_KEY, type: 'loading', content, duration: 0 })
  },
  /**
   * 关闭全局 Loading 提示，与 loading 成对调用
   */
  closeLoading(): void {
    message.destroy(LOADING_KEY)
  }
}
