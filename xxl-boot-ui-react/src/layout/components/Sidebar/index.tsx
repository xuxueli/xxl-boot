/**
 * 组件：Sidebar（侧边栏）
 * 功能：左侧菜单容器，含 Logo、菜单树、折叠切换。
 *       混合模式下只显示当前顶级菜单的子路由。
 */
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Menu } from 'antd'
import type { MenuProps } from 'antd'
import SidebarLogo from './SidebarLogo'
import { isExternal } from '@/utils/validate'
import { buildMenuItems } from '../menuUtil'
import { useAppStore, useRoutesStore, useSettingsStore } from '@/stores'
import variables from '@/assets/styles/variables'
import type { RouteData } from '@/stores/routes'
import './sidebar.scss'

/**
 * 侧边栏
 */
export default function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const appStore = useAppStore()
  const settingsStore = useSettingsStore()
  const routesStore = useRoutesStore()

  // 当前激活菜单：优先取 meta.activeMenu，否则取 route.path
  const activeMenu = useMemo(() => {
    const meta = findRouteMetaByPath(location.pathname)
    if (meta && meta.activeMenu) {
      return meta.activeMenu
    }
    return location.pathname
  }, [location.pathname])
  // 折叠状态
  const isCollapse = !appStore.sidebar.opened
  // 展开的子菜单 key（unique-opened 单开）
  const [openKeys, setOpenKeys] = useState<string[]>([])

  // 当前路由匹配的前缀子菜单 key：用于自动展开
  useEffect(() => {
    const prefix = findTopPrefix(location.pathname)
    setOpenKeys(prefix ? [prefix] : [])
     
  }, [location.pathname])

  /*
   * 侧边栏路由列表：混合模式（navType=2）且存在 _scope 时只显示对应顶级菜单的子路由
   */
  const sidebarRouters = useMemo<RouteData[]>(() => {
    const routes = routesStore.fullRoutes
    if (settingsStore.navType === 2 && routesStore._scope) {
      const menu = routes.find((r) => r.path === routesStore._scope)
      if (menu && menu.children) return menu.children
    }
    return routes
  }, [routesStore.fullRoutes, settingsStore.navType, routesStore._scope])

  /*
   * 构建 antd 菜单项（递归）
   */
  const menuItems = useMemo<MenuProps['items']>(() => buildMenuItems(sidebarRouters, ''), [sidebarRouters])

  /*
   * 菜单背景色：深色模式 / theme-dark / theme-light
   */
  const getMenuBackground = () => {
    if (settingsStore.isDark) {
      return 'var(--sidebar-bg)'
    }
    return settingsStore.sideTheme === 'theme-dark' ? variables.menuBg : variables.menuLightBg
  }

  /*
   * 菜单文字色：深色模式 / theme-dark / theme-light
   */
  const getMenuTextColor = () => {
    if (settingsStore.isDark) {
      return 'var(--sidebar-text)'
    }
    return settingsStore.sideTheme === 'theme-dark' ? variables.menuText : variables.menuLightText
  }

  /*
   * 菜单点击：外部链接新窗口，内部路由跳转
   */
  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (isExternal(String(key))) {
      window.open(String(key), '_blank')
    } else {
      navigate(String(key))
    }
  }

  /*
   * 展开变化：仅保留最后展开的子菜单（unique-opened 效果）
   */
  const handleOpenChange = (keys: string[]) => {
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1)
    setOpenKeys(latestOpenKey ? [latestOpenKey] : [])
  }

  return (
    <div className={`sidebar-container ${settingsStore.sideTheme} ${settingsStore.sidebarLogo ? 'has-logo' : ''}`}>
      {settingsStore.sidebarLogo && <SidebarLogo collapse={isCollapse} />}
      <div
        className="sidebar-menu-scroll"
        style={{ background: getMenuBackground() }}
        onClick={(e) => {
          // 折叠态点击空白收起 popup 选择行为由 antd 处理
          e.stopPropagation()
        }}
      >
        <Menu
          className="sidebar-menu"
          theme={settingsStore.sideTheme === 'theme-dark' ? 'dark' : 'light'}
          mode="inline"
          inlineCollapsed={isCollapse}
          selectedKeys={[activeMenu]}
          openKeys={isCollapse ? undefined : openKeys}
          onOpenChange={handleOpenChange}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ color: getMenuTextColor() }}
        />
      </div>
    </div>
  )
}

/**
 * 查找路由 meta（供侧边栏 activeMenu 使用）
 * @param path 当前路由路径
 * @returns meta 或 undefined
 */
function findRouteMetaByPath(path: string): { activeMenu?: string; [key: string]: unknown } | undefined {
  const allRoutes = useRoutesStore.getState().fullRoutes
  const stack = [...allRoutes]
  while (stack.length > 0) {
    const route = stack.pop()
    if (!route) continue
    if (route.children && route.children.length) {
      stack.push(...(route.children as RouteData[]))
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
 * 查找当前路由对应顶级菜单前缀（用于自动展开子菜单）
 * @param path 当前路由路径
 * @returns 顶级菜单路径或空
 */
function findTopPrefix(path: string): string {
  const dynamicRoutes = useRoutesStore.getState().dynamicRoutes
  for (const route of dynamicRoutes) {
    if (route.hidden || route.path === '/') continue
    if (route.path && path.startsWith(route.path) && route.children && route.children.length > 0) {
      return route.path
    }
  }
  return ''
}
