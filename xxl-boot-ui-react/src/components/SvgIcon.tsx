/**
 * SvgIcon - SVG 图标组件
 *
 * 使用 vite-plugin-svg-icons 生成的 symbol sprite，通过 <use> 引用。
 *
 * 用法：
 *   <SvgIcon iconClass="dashboard" />
 */
import type { CSSProperties, MouseEvent } from 'react'

interface SvgIconProps {
  /** 图标名称（对应 assets/icons/svg 下的文件名，不含 .svg 后缀） */
  iconClass: string
  /** 额外类名 */
  className?: string
  /** 填充颜色 */
  color?: string
  /** 内联样式 */
  style?: CSSProperties
  /** 点击事件 */
  onClick?: (e: MouseEvent<SVGSVGElement>) => void
}

export default function SvgIcon({ iconClass, className = '', color, style, onClick }: SvgIconProps) {
  return (
    <svg className={`svg-icon ${className}`} style={style} aria-hidden="true" onClick={onClick}>
      <use xlinkHref={`#icon-${iconClass}`} fill={color} />
    </svg>
  )
}
