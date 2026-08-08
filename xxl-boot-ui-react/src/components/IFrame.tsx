/**
 * 组件：IFrame（iframe 内嵌页面容器）
 * 功能：在系统页面内嵌加载外部 url，显示 loading 直至页面加载完成。
 *
 * 用法：<IFrame src="https://example.com" />
 */
import { useEffect, useRef, useState } from 'react'
import { Spin } from 'antd'

interface IFrameProps {
  /** 要嵌入的页面 URL（必传） */
  src: string
}

/**
 * iframe 内嵌页面容器
 */
export default function IFrame({ src }: IFrameProps) {
  const [height, setHeight] = useState(`${document.documentElement.clientHeight - 94.5}px`)
  const [loading, setLoading] = useState(true)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    // 加载状态：300ms 后自动关闭（给 iframe 加载缓冲时间）
    const timer = setTimeout(() => {
      setLoading(false)
    }, 300)

    // 窗口大小变化时重新计算 iframe 高度
    const handleResize = () => {
      setHeight(`${document.documentElement.clientHeight - 94.5}px`)
    }
    window.addEventListener('resize', handleResize)

    // iframe onload 提前关闭 loading
    const onLoad = () => setLoading(false)
    iframeRef.current?.addEventListener('load', onLoad)

    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', handleResize)
      iframeRef.current?.removeEventListener('load', onLoad)
    }
  }, [])

  return (
    <div style={{ height, position: 'relative' }}>
      <Spin spinning={loading} tip="加载中..." style={{ position: 'absolute', top: '50%', left: '50%' }}>
        <iframe ref={iframeRef} src={src} frameBorder="no" style={{ width: '100%', height: '100%' }} scrolling="auto" title="iframe" />
      </Spin>
    </div>
  )
}
