/**
 * CopyText - 点击复制文本组件
 *
 * 等价 v-copyText 指令（React 无指令机制，用组件替代）。
 *
 * 用法：
 *   <CopyText text="复制的内容" onCopied={copyTextSuccess}>
 *     <span>点击复制</span>
 *   </CopyText>
 *
 * 实现原理：通过隐藏 textarea + execCommand('copy') 完成复制，
 * 复制后自动恢复用户原选区和焦点，兼容 iOS 选区行为。
 */
import { type MouseEvent, type ReactNode } from 'react'

interface CopyTextProps {
  /** 待复制的文本 */
  text: string
  /** 复制完成回调（等价 v-copyText:callback） */
  onCopied?: (message: string) => void
  /** 内容 */
  children?: ReactNode
  /** 额外类名 */
  className?: string
}

/**
 * 复制文本到剪贴板（隐藏 textarea + execCommand）
 *
 * @param input 待复制文本
 * @returns 是否复制成功
 */
export function copyTextToClipboard(input: string, { target = document.body }: { target?: HTMLElement } = {}): boolean {
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

/**
 * 点击复制组件
 */
export default function CopyText({ text, onCopied, children, className }: CopyTextProps) {
  const handleClick = (e: MouseEvent) => {
    e.stopPropagation()
    copyTextToClipboard(text)
    onCopied && onCopied(text)
  }

  return (
    <span className={className} style={{ cursor: 'pointer' }} onClick={handleClick}>
      {children}
    </span>
  )
}
