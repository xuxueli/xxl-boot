/**
 * 组件：AppMain（主内容区）
 * 功能：路由页面渲染容器，含 react-activation 页面缓存（等价 keep-alive）、底部版权
 */
import { useEffect } from 'react'
import { useLocation, useOutlet } from 'react-router-dom'
import { KeepAlive, useAliveController } from 'react-activation'
import Copyright from './Copyright'
import { setAliveController } from '@/utils/alive'
import './appmain.scss'

/**
 * 主内容区
 */
export default function AppMain() {
  const outlet = useOutlet()
  const location = useLocation()
  const { drop, refresh } = useAliveController()

  // 注册 alive 控制器（供 utils/tab 等非组件模块调用）
  useEffect(() => {
    setAliveController(
      (key) => {
        try {
          drop(key)
        } catch (e) {
          /* 缓存节点不存在时忽略 */
        }
      },
      (key) => {
        try {
          refresh(key)
        } catch (e) {
          /* 缓存节点不存在时忽略 */
        }
      }
    )
  }, [drop, refresh])

  return (
    <section className="app-main">
      {/* 页面缓存：以路由 path 为缓存 key，切换标签时保留页面状态 */}
      <KeepAlive cacheKey={location.pathname} name={location.pathname} saveScrollPosition>
        {outlet}
      </KeepAlive>
      {/* 底部版权组件：不随路由切换销毁重建 */}
      <Copyright />
    </section>
  )
}
