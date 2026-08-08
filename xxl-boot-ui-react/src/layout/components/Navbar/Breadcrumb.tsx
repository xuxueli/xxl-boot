/**
 * 组件：Breadcrumb（面包屑导航）
 * 功能：基于当前路由和权限路由树生成层级导航，支持按层级回退跳转
 */
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Breadcrumb as AntdBreadcrumb } from 'antd'
import { useRoutesStore } from '@/stores'
import type { RouteData } from '@/stores/routes'

/** 面包屑节点 */
interface BreadcrumbItem {
  path: string
  title: string
  children?: boolean
  isLast?: boolean
}

interface BreadcrumbProps {
  /** 额外类名 */
  className?: string
}

/**
 * 面包屑导航
 */
export default function Breadcrumb({ className = '' }: BreadcrumbProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const dynamicRoutes = useRoutesStore((state) => state.dynamicRoutes)
  const [levelList, setLevelList] = useState<BreadcrumbItem[]>([])

  /*
   * 生成面包屑列表：从路由树中匹配当前路径的层级链路
   */
  const getBreadcrumb = () => {
    if (location.pathname.startsWith('/redirect/')) return
    const items = matchBreadcrumb(dynamicRoutes, location.pathname)
    if (items.length === 0) {
      setLevelList([])
      return
    }
    // 最后一个节点不可点击
    items[items.length - 1].isLast = true
    setLevelList(items)
  }

  // 路由变化时更新面包屑
  useEffect(() => {
    getBreadcrumb()
     
  }, [location.pathname, dynamicRoutes])

  /*
   * 点击面包屑节点跳转
   */
  const handleLink = (item: BreadcrumbItem) => {
    if (item.isLast) return
    navigate(item.path)
  }

  return (
    <AntdBreadcrumb
      separator="/"
      className={`app-breadcrumb ${className}`}
      items={levelList.map((item) => ({
        key: item.path,
        title: item.isLast || item.children ? (
          <span className="no-redirect">{item.title}</span>
        ) : (
          <a onClick={() => handleLink(item)}>{item.title}</a>
        )
      }))}
    />
  )
}

/**
 * 在路由树中匹配当前路径的面包屑链路
 */
function matchBreadcrumb(routes: RouteData[], path: string, trail: BreadcrumbItem[] = []): BreadcrumbItem[] {
  for (const route of routes) {
    if (!route.meta || !route.meta.title) continue
    const nextTrail = [...trail, { path: route.path || '', title: route.meta.title }]
    if (route.path === path) {
      return nextTrail
    }
    if (route.children && route.children.length) {
      const result = matchBreadcrumb(route.children, path, nextTrail)
      if (result.length > 0) {
        return result
      }
    }
  }
  return []
}
