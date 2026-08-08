/**
 * 名称：InnerLink
 * 功能：外链 iframe 容器组件，用于动态路由中的外部链接页面
 */
import { useEffect, useRef, useState } from 'react'
import { Spin } from 'antd'

interface InnerLinkProps {
  /** iframe 地址 */
  src?: string
  /** iframe id */
  iframeId?: string
}

/**
 * iframe 容器：加载外链页面，加载完成后隐藏 Loading
 */
export default function InnerLink({ src = '/', iframeId = '' }: InnerLinkProps) {
  // 加载状态
  const [loading, setLoading] = useState(true)
  // iframe ref
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // iframe 高度：视口高度 - 94.5px（适配固定头部）
  const height = `${document.documentElement.clientHeight - 94.5}px`

  useEffect(() => {
    // iframe 加载完成：隐藏 Loading
    const onLoad = () => {
      setLoading(false)
    }
    iframeRef.current?.addEventListener('load', onLoad)
    return () => {
      iframeRef.current?.removeEventListener('load', onLoad)
    }
  }, [])

  return (
    <div className="inner-link">
      <Spin spinning={loading} tip="加载中..." wrapperClassName="inner-link-loading">
        <iframe ref={iframeRef} id={iframeId} title="inner-link" src={src} style={{ height }} className="iframe" />
      </Spin>
    </div>
  )
}
