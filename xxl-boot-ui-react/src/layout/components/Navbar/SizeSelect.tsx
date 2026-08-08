/**
 * 组件：SizeSelect（布局尺寸选择器）
 * 功能：顶部导航栏下拉菜单，切换 large / default / small 三种布局尺寸
 */
import { useState } from 'react'
import { Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import { useAppStore } from '@/stores'
import modal from '@/utils/modal'
import SvgIcon from '@/components/SvgIcon'

/** 可选尺寸列表 */
const sizeOptions = [
  { label: '较大', value: 'large' },
  { label: '默认', value: 'default' },
  { label: '稍小', value: 'small' }
]

/**
 * 布局尺寸选择器
 */
export default function SizeSelect() {
  const appStore = useAppStore()
  const size = appStore.size

  /*
   * 切换布局尺寸：保存后刷新页面生效
   */
  const handleSetSize = (size: string) => {
    modal.loading('正在设置布局大小，请稍候...')
    appStore.setSize(size)
    setTimeout(function () {
      window.location.reload()
    }, 500)
  }

  const items: MenuProps['items'] = sizeOptions.map((item) => ({
    key: item.value,
    label: item.label,
    disabled: size === item.value
  }))

  return (
    <div>
      <Dropdown
        menu={{ items, onClick: ({ key }) => handleSetSize(key) }}
        trigger={['click']}
        placement="bottomRight"
      >
        <div className="size-icon--style">
          <SvgIcon iconClass="size" className="size-icon" />
        </div>
      </Dropdown>
    </div>
  )
}
