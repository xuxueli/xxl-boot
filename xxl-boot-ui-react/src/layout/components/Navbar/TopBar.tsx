/**
 * 组件：TopBar（顶部菜单栏 - 导航模式 3）
 * 功能：navType=3 时在顶部渲染一级菜单，超出数量折叠到"更多菜单"。
 */
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Menu } from 'antd'
import type { MenuProps } from 'antd'
import { buildMenuItems } from '../menuUtil'
import { isExternal } from '@/utils/validate'
import { useRoutesStore, useSettingsStore } from '@/stores'
import './topbar.scss'

/**
 * 顶部菜单栏
 */
export default function TopBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const settingsStore = useSettingsStore()
  const routesStore = useRoutesStore()

  // 可见菜单数量阈值，动态计算
  const [visibleNumber, setVisibleNumber] = useState(5)

  /*
   * 顶部一级菜单：过滤隐藏路由
   */
  const topRoutes = useMemo(() => routesStore.fullRoutes.filter((f) => !f.hidden), [routesStore.fullRoutes])

  /*
   * 构建顶部菜单项
   */
  const allItems = useMemo<MenuProps['items']>(() => buildMenuItems(topRoutes, ''), [topRoutes])

  // 当前激活菜单
  const activeMenu = findActiveMenu(location.pathname)

  /*
   * 根据容器宽度计算可显示的菜单数量
   */
  const setVisible = () => {
    const width = document.body.getBoundingClientRect().width / 3
    setVisibleNumber(Math.max(1, parseInt(String(width / 85))))
  }

  useEffect(() => {
    setVisible()
    window.addEventListener('resize', setVisible)
    return () => {
      window.removeEventListener('resize', setVisible)
    }
  }, [])

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

  const topMenus = (allItems || []).slice(0, visibleNumber)
  const moreMenus = (allItems || []).slice(visibleNumber)
  const items: MenuProps['items'] = moreMenus.length
    ? [...topMenus, { key: 'more', label: <span>更多菜单</span>, children: moreMenus }]
    : topMenus

  return (
    <Menu
      className="topbar-menu"
      mode="horizontal"
      selectedKeys={[activeMenu]}
      items={items}
      onClick={handleMenuClick}
      style={{ height: 50, lineHeight: '50px' }}
    />
  )
}

/**
 * 当前激活菜单：优先取 meta.activeMenu（路由配置的激活项），否则取 route.path
 */
function findActiveMenu(path: string): string {
  const routes = useRoutesStore.getState().fullRoutes
  const stack = [...routes]
  while (stack.length > 0) {
    const route = stack.pop()
    if (!route) continue
    if (route.children && route.children.length) {
      stack.push(...(route.children as typeof route[]))
    }
    if (route.path && (route.path === path || (path.startsWith(route.path) && route.path !== '*'))) {
      if (route.meta && route.meta.activeMenu) {
        return route.meta.activeMenu
      }
    }
  }
  return path
}
