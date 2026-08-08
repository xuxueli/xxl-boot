/**
 * 路由定义与守卫模块（router/index.tsx）
 *
 * 职责：
 *   1. 声明静态路由（constantRoutes）——登录、错误页、个人中心等，启动即注册；
 *   2. 将静态/动态路由（RouteData）渲染为 <Route> 元素；
 *   3. 定义全局守卫组件（Guard）——鉴权、动态路由初始化、进度条控制、动态标题。
 */
import { Suspense, useEffect, useState, type ReactElement, type ReactNode } from 'react'
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { message, Spin } from 'antd'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { constantRoutes, businessRoutes, type AppRouteObject } from './constant'
import type { RouteData } from '@/stores/routes'
import { useUserStore, useRoutesStore, useSettingsStore } from '@/stores'
import { getToken } from '@/utils/auth'
import { isHttp } from '@/utils/validate'
import { isRelogin } from '@/utils/request'
import { setNavigation } from '@/utils/navigation'

// 登录白名单
const whiteList = ['/login']
const isWhiteList = (path: string) => whiteList.includes(path)

NProgress.configure({ showSpinner: false })

/** 页面加载占位 */
function PageLoading() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
      <Spin size="large" />
    </div>
  )
}

/**
 * 将路由配置（RouteData）渲染为 <Route> 元素
 *
 * @param routes 路由配置数组
 * @returns Route 元素数组
 */
function renderRoutes(routes: RouteData[] | AppRouteObject[]): ReactElement[] {
  return routes.map((route, index) => {
    const children = route.children && route.children.length ? renderRoutes(route.children) : undefined

    let element: ReactNode | undefined
    if (route.component) {
      const Component = route.component as React.ElementType
      element = (
        <Suspense fallback={<PageLoading />}>
          <Component />
        </Suspense>
      )
    } else if (route.redirect && route.redirect !== 'noredirect') {
      // 重定向路由
      element = <Navigate to={route.redirect} replace />
    }

    return (
      <Route key={route.path || route.name || `route-${index}`} path={route.path} element={element}>
        {children}
      </Route>
    )
  })
}

/**
 * 全局路由守卫组件
 *
 * 处理逻辑：
 *   1、白名单（/login）：直接放行；
 *   2、已登录：访问 /login 踢回首页；首次加载时初始化用户信息 + 动态路由；
 *   3、未登录：跳转登录页并回传原路径供登录后重定向。
 */
function Guard({ children }: { children: ReactNode }) {
  const location = useLocation()
  const navigate = useNavigate()
  const userStore = useUserStore()
  const routesStore = useRoutesStore()
  const settingsStore = useSettingsStore()
  // 初始化加载状态：初始化期间不渲染路由，避免 404 闪烁
  const [ready, setReady] = useState(false)

  // 同步导航桥接（供非组件模块 utils/tab 等使用）
  useEffect(() => {
    setNavigation(navigate, location)
  }, [navigate, location])

  useEffect(() => {
    let cancelled = false
    const run = async () => {
      NProgress.start()

      // 1、白名单：直接放行（登录页等无需鉴权的页面）
      if (isWhiteList(location.pathname)) {
        if (!cancelled) {
          setReady(true)
          NProgress.done()
        }
        return
      }

      // 2、已登录
      const hasToken = getToken()
      if (hasToken) {
        // 2.1、已登录 & 访问登录页：踢回首页
        if (location.pathname === '/login') {
          NProgress.done()
          navigate({ pathname: '/' }, { replace: true })
          return
        }

        // 2.2、设置动态标题
        const meta = findRouteMeta(location.pathname)
        if (meta && meta.title) {
          settingsStore.setMenuTitle(meta.title)
        }

        // 2.3、roles 为空：说明尚未拉取用户信息（首次登录或刷新页面后），需要初始化动态路由
        if (userStore.roles.length === 0 && !routesStore.routesReady) {
          try {
            // a、获取用户信息：用户 + 角色权限信息
            isRelogin.show = true
            await userStore.getInfo()
            isRelogin.show = false

            // b、初始化动态路由
            await routesStore.initRoutes()
          } catch (err) {
            // 路由初始化异常：退出登录
            await userStore.logout()
            const errMsg = err instanceof Error ? err.message : JSON.stringify(err)
            message.error('Init Router Error:' + errMsg)
            navigate({ pathname: '/' }, { replace: true })
            NProgress.done()
            return
          }
        }
        if (!cancelled) {
          setReady(true)
          NProgress.done()
        }
        return
      }

      // 3、未登录：跳转登录页并回传原路径供登录后重定向
      NProgress.done()
      navigate(`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`, { replace: true })
    }

    run()
    return () => {
      cancelled = true
    }
     
  }, [location.pathname])

  // 初始化未完成：不渲染路由内容
  if (!ready) {
    return <PageLoading />
  }

  return <>{children}</>
}

/**
 * 在动态/静态路由配置中按路径查找路由 meta
 *
 * @param path 路由路径
 * @returns 匹配到的 meta，未匹配返回 undefined
 */
function findRouteMeta(path: string): { title?: string; [key: string]: unknown } | undefined {
  const allRoutes = [...constantRoutes, ...businessRoutes, ...useRoutesStore.getState().dynamicRoutes]
  const stack = [...allRoutes]
  while (stack.length > 0) {
    const route = stack.pop()
    if (!route) continue
    if (route.children && route.children.length) {
      stack.push(...(route.children as AppRouteObject[]))
    }
    if (route.path && (route.path === path || (path.startsWith(route.path) && route.path !== '*'))) {
      if (route.meta) {
        return route.meta
      }
    }
  }
  return undefined
}

/**
 * 根路由组件：挂载全局守卫 + 静态/动态路由
 */
export default function AppRouter() {
  const dynamicRoutes = useRoutesStore((state) => state.dynamicRoutes)
  const routesReady = useRoutesStore((state) => state.routesReady)

  return (
    <BrowserRouter>
      <Guard>
        <Routes>
          {renderRoutes(constantRoutes)}
          {renderRoutes(businessRoutes)}
          {routesReady && renderRoutes(dynamicRoutes)}
        </Routes>
      </Guard>
    </BrowserRouter>
  )
}
