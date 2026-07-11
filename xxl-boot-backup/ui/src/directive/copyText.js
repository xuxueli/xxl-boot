/**
 * v-copyText 指令（点击复制文本）
 *
 * 【总体能力】
 * 1) 给任意元素增加“点击后复制文本到剪贴板”的能力；
 * 2) 支持 callback 参数模式，用于接收复制完成后的回调通知；
 * 3) 内部兼容移动端/iOS 选择行为，尽量恢复原选区与焦点，降低对页面交互的影响。
 *
 * 【使用方式】
 * - 默认复制模式：v-copyText="text"
 *   说明：点击绑定元素时，复制 text。
 *
 * - 回调注册模式：v-copyText:callback="onCopied"
 *   说明：仅注册回调函数；回调在复制动作完成后触发，参数为复制文本。
 *
 * 【实现思路（总 -> 分）】
 * - 总：指令阶段负责“绑定/解绑事件 + 保存复制值/回调”，复制函数负责“执行复制动作”。
 * - 分：
 *   a) beforeMount：按 arg 决定是注册回调还是绑定点击复制；
 *   b) unmounted：安全解绑点击事件，避免组件卸载后残留监听；
 *   c) copyTextToClipboard：创建隐藏 textarea，选中文本并执行 copy，再恢复现场。
 */
export default {
  beforeMount(el, { value, arg }) {
    // 总：根据参数类型分流处理；callback 只注册回调，默认分支负责复制能力绑定。
    // 分 1：callback 分支 —— 不绑点击事件，只保存复制后的回调函数。
    if (arg === "callback") {
      el.$copyCallback = value
    } else {
      // 分 2：默认分支 —— 保存待复制文本，并绑定点击处理逻辑。
      el.$copyValue = value
      const handler = () => {
        // 分 2.1：执行复制动作（核心复制逻辑在下方函数）。
        copyTextToClipboard(el.$copyValue)
        // 分 2.2：若存在回调，则把本次复制文本回传给业务侧。
        if (el.$copyCallback) {
          el.$copyCallback(el.$copyValue)
        }
      }
      // 分 2.3：把点击处理器挂载到元素上。
      el.addEventListener("click", handler)
      // 分 2.4：保存解绑函数，供 unmounted 阶段安全清理。
      el.$destroyCopy = () => el.removeEventListener("click", handler)
    }
  },
  unmounted(el) {
    // 总：组件卸载时做资源回收，避免重复挂载场景产生监听残留。
    // 分：若存在解绑函数则执行，并清理临时挂载字段。
    if (el.$destroyCopy) {
      el.$destroyCopy()
      delete el.$destroyCopy
    }
    delete el.$copyValue
    delete el.$copyCallback
  }
}

function copyTextToClipboard(input, { target = document.body } = {}) {
  // 总：通过临时 textarea + execCommand('copy') 完成复制，并尽量恢复用户操作现场。
  // 分 1：创建复制载体并记录当前焦点。
  const element = document.createElement('textarea')
  const previouslyFocusedElement = document.activeElement

  // 分 2：写入待复制文本。
  element.value = input

  // 分 3：设置只读，避免移动端弹出软键盘影响体验。
  element.setAttribute('readonly', '')

  // 分 4：设置不可见且不影响布局的样式，并规避 iOS 缩放。
  element.style.contain = 'strict'
  element.style.position = 'absolute'
  element.style.left = '-9999px'
  element.style.fontSize = '12pt'

  // 分 5：保存当前选区，复制后用于恢复。
  const selection = document.getSelection()
  const originalRange = selection.rangeCount > 0 && selection.getRangeAt(0)

  // 分 6：挂载临时元素并选中其内容。
  target.append(element)
  element.select()

  // 分 7：iOS 兼容处理，显式设置选区范围。
  element.selectionStart = 0
  element.selectionEnd = input.length

  // 分 8：执行复制命令并记录结果。
  let isSuccess = false
  try {
    isSuccess = document.execCommand('copy')
  } catch { }

  // 分 9：移除临时元素，回收 DOM。
  element.remove()

  // 分 10：恢复原选区，减少对用户操作的干扰。
  if (originalRange) {
    selection.removeAllRanges()
    selection.addRange(originalRange)
  }

  // 分 11：恢复原焦点，保持交互连贯性。
  if (previouslyFocusedElement) {
    previouslyFocusedElement.focus()
  }

  // 分 12：返回复制是否成功。
  return isSuccess
}
