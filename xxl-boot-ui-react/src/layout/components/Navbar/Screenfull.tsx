/**
 * 组件：Screenfull（全屏切换）
 * 功能：点击切换浏览器全屏/退出全屏模式
 */
import { useEffect, useState } from 'react'
import screenfull from 'screenfull'
import SvgIcon from '@/components/SvgIcon'

/**
 * 全屏切换
 */
export default function Screenfull() {
  const [isFullscreen, setIsFullscreen] = useState(false)

  // 监听全屏状态变化
  useEffect(() => {
    if (!screenfull.isEnabled) return
    const handler = () => {
      setIsFullscreen(screenfull.isFullscreen)
    }
    screenfull.on('change', handler)
    return () => {
      screenfull.off('change', handler)
    }
  }, [])

  const toggle = () => {
    if (screenfull.isEnabled) {
      screenfull.toggle()
    }
  }

  return (
    <div className="screenfull" onClick={toggle}>
      <SvgIcon iconClass={isFullscreen ? 'exit-fullscreen' : 'fullscreen'} className="screenfull-svg" />
    </div>
  )
}
