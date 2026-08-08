/**
 * 静态路由常量（router/constant.ts）
 * 职责：声明登录、个人中心、重定向、错误页等启动即注册的路由（无权限门槛）
 *      以及业务隐藏路由（businessRoutes，供 tab.openPage 等内部跳转使用）
 */
import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import Layout from '@/layout/index'
import defaultSettings from '@/default-settings'

/** 应用路由记录：自定义字段（hidden/alwaysShow/meta） */
export type AppRouteObject = {
  path?: string
  component?: ComponentType | LazyExoticComponent<ComponentType>
  name?: string
  redirect?: string
  hidden?: boolean
  alwaysShow?: boolean
  meta?: {
    title?: string
    icon?: string
    activeMenu?: string
    affix?: boolean
    hidden?: boolean
    query?: Record<string, string>
    [key: string]: unknown
  }
  children?: AppRouteObject[]
  [key: string]: unknown
}

/**
 * 静态路由 —— 无权限门槛，启动即注册
 * 包含：登录、个人中心、重定向页、301 未授权、404 兜底
 */
export const constantRoutes: AppRouteObject[] = [
  // 登录
  {
    path: '/login',
    component: lazy(() => import('@/views/login')),
    hidden: true
  },
  // 首页：默认跳转 “/index”
  {
    path: '',
    redirect: defaultSettings.homePath
  },
  // 个人中心：hidden 控制侧栏不显示
  {
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        name: 'Profile',
        path: '/user/profile/:activeTab?',
        component: lazy(() => import('@/views/org/user/profile/index')),
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  },
  // 重定向：内部重定向承载页
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/*',
        component: lazy(() => import('@/views/redirect/index'))
      }
    ]
  },
  // 301：未授权或会话过期
  {
    path: '/301',
    component: lazy(() => import('@/views/common/301')),
    hidden: true
  },
  // 404：访问资源不存在。兜底，必须放在末段
  {
    path: '*',
    component: lazy(() => import('@/views/common/404')),
    hidden: true
  }
]

/**
 * 业务路由 —— 通常为业务子页面（下钻页等）、隐藏状态；单独维护、单独注册
 * 说明：hidden 不显示在侧栏，供 tab.openPage 等内部跳转使用
 */
export const businessRoutes: AppRouteObject[] = [
  // 字典管理-子页面：字典数据页面
  {
    path: '/system/dict/data',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        name: 'DictData',
        path: '/system/dict/data',
        component: lazy(() => import('@/views/system/dict/data')),
        meta: { title: '字典数据', activeMenu: '/system/dict' }
      }
    ]
  }
]
