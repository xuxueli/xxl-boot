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
export default {
  beforeMount(el, { value, arg }) {
    // callback 模式：只注册回调，不绑定点击
    if (arg === "callback") {
      el.$copyCallback = value
    } else {
      // 默认模式：绑定点击复制
      el.$copyValue = value
      const handler = () => {
        copyTextToClipboard(el.$copyValue)
        // 触发回调
        if (el.$copyCallback) {
          el.$copyCallback(el.$copyValue)
        }
      }
      el.addEventListener("click", handler)
      // 保存解绑函数，供 unmounted 阶段清理
      el.$destroyCopy = () => el.removeEventListener("click", handler)
    }
  },
  unmounted(el) {
    // 组件卸载，清理事件监听和临时属性
    if (el.$destroyCopy) {
      el.$destroyCopy()
      delete el.$destroyCopy
    }
    delete el.$copyValue
    delete el.$copyCallback
  }
}

function copyTextToClipboard(input, { target = document.body } = {}) {
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
  const originalRange = selection.rangeCount > 0 && selection.getRangeAt(0)

  target.append(element)
  element.select()
  // iOS 兼容：显式设置选区范围
  element.selectionStart = 0
  element.selectionEnd = input.length

  // 执行复制
  let isSuccess = false
  try {
    isSuccess = document.execCommand('copy')
  } catch { }

  element.remove()

  // 恢复原选区
  if (originalRange) {
    selection.removeAllRanges()
    selection.addRange(originalRange)
  }
  // 恢复原焦点
  if (previouslyFocusedElement) {
    previouslyFocusedElement.focus()
  }

  return isSuccess
}
