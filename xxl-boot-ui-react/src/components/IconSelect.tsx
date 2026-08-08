/**
 * 组件：IconSelect（SVG 图标选择器）
 * 功能：按名称搜索并选择 SVG 图标，选中后通过 onSelected 回调返回图标名称。
 *
 * 用法：<IconSelect activeIcon={icon} onSelected={handleSelected} />
 */
import { forwardRef, useImperativeHandle, useMemo, useState } from 'react'
import { Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import SvgIcon from '@/components/SvgIcon'
import './iconSelect.scss'

// Svg Icon 全量导入（构建时收集 svg 图标名）
const modules = import.meta.glob('./../assets/icons/svg/*.svg')
const icons = Object.keys(modules).map((path) => path.split('assets/icons/svg/')[1].split('.svg')[0])

export interface IconSelectHandle {
  /** 重置搜索状态 */
  reset: () => void
}

interface IconSelectProps {
  /** 传入默认选中 icon */
  activeIcon?: string
  /** 选中图标事件 */
  onSelected?: (name: string) => void
}

/**
 * SVG 图标选择器
 */
const IconSelect = forwardRef<IconSelectHandle, IconSelectProps>(function IconSelect({ activeIcon, onSelected }, ref) {
  // 搜索关键词
  const [iconName, setIconName] = useState('')

  // 关键词匹配的 icon
  const filteredIcons = useMemo(() => {
    if (!iconName) return icons
    return icons.filter((item) => item.includes(iconName))
  }, [iconName])

  // 选中图标：派发事件
  const selectedIcon = (name: string) => {
    onSelected && onSelected(name)
    document.body.click()
  }

  // 重置搜索状态（供父组件调用）
  const reset = () => {
    setIconName('')
  }

  useImperativeHandle(ref, () => ({
    reset
  }))

  return (
    <div className="icon-body">
      {/* icon 输入 */}
      <Input
        className="icon-search"
        allowClear
        placeholder="请输入图标名称"
        prefix={<SearchOutlined />}
        value={iconName}
        onChange={(e) => setIconName(e.target.value)}
      />

      {/* icon 列表 */}
      <div className="icon-list">
        <div className="list-container">
          {filteredIcons.map((item) => (
            <div className="icon-item-wrapper" key={item} onClick={() => selectedIcon(item)}>
              <div className={`icon-item ${activeIcon === item ? 'active' : ''}`}>
                <SvgIcon iconClass={item} className="icon" style={{ height: 25, width: 16 }} />
                <span>{item}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})

IconSelect.displayName = 'IconSelect'
export default IconSelect
