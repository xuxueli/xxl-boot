/**
 * 点击复制文本指令
 *
 * 两种用法：
 *   v-copyText="text"            — 点击元素复制 text 到剪贴板
 *   v-copyText:callback="fn"     — 注册回调函数，复制完成后触发 fn(text)
 *
 * 实现原理：通过隐藏 textarea + execCommand('copy') 完成复制，
 * 复制后自动恢复用户原选区和焦点，兼容 iOS 选区行为。
 */
import type { Directive, DirectiveBinding } from 'vue'
import { readonly } from 'vue'

export default {
  beforeMount(el: HTMLElement, binding: DirectiveBinding) {
    const { value, arg } = binding
    // callback 模式：只注册回调，不绑定点击
    if (arg === 'callback') {
      el.$copyCallback = value as (msg: string) => void
    } else {
      // 默认模式：绑定点击复制
      el.$copyValue = String(value)
      const handler = () => {
        copyTextToClipboard(el.$copyValue || '')
        // 触发回调
        if (el.$copyCallback) {
          el.$copyCallback(el.$copyValue || '')
        }
      }
      el.addEventListener('click', handler)
      // 保存解绑函数，供 unmounted 阶段清理
      el.$destroyCopy = () => el.removeEventListener('click', handler)
    }
  },
  unmounted(el: HTMLElement) {
    // 组件卸载，清理事件监听和临时属性
    if (el.$destroyCopy) {
      el.$destroyCopy()
      delete el.$destroyCopy
    }
    delete el.$copyValue
    delete el.$copyCallback
  }
} as Directive<HTMLElement>

function copyTextToClipboard(input: string, { target = document.body }: { target?: HTMLElement } = {}): boolean {
  // 创建隐藏 textarea 作为复制载体
  const element = document.createElement('textarea')
  const previouslyFocusedElement = document.activeElement

  element.value = input
  element.setAttribute('readonly', '')
  // 防止移动端弹出软键盘，absolute + 负偏移隐藏元素
  element.style.contain = 'strict'
  element.style.position = 'absolute'
  element.style.left = '-9999px'
  element.style.fontSize = '12pt'

  // 保存当前选区，复制后恢复
  const selection = document.getSelection()
  const originalRange = selection && selection.rangeCount > 0 ? selection.getRangeAt(0) : null

  target.append(element)
  element.select()
  // iOS 兼容：显式设置选区范围
  element.selectionStart = 0
  element.selectionEnd = input.length

  // 执行复制
  let isSuccess = false
  try {
    isSuccess = document.execCommand('copy')
  } catch {
    /* ignore */
  }

  element.remove()

  // 恢复原选区
  if (originalRange && selection) {
    selection.removeAllRanges()
    selection.addRange(originalRange)
  }
  // 恢复原焦点
  if (previouslyFocusedElement instanceof HTMLElement) {
    previouslyFocusedElement.focus()
  }

  return isSuccess
}
