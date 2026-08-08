/**
 * 组件：TopBarMix（混合模式顶部导航 - 导航模式 2）
 * 功能：navType=2 时在顶部渲染一级菜单，选中后左侧侧边栏联动显示对应子菜单
 */
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Menu } from 'antd'
import type { MenuProps } from 'antd'
import SvgIcon from '@/components/SvgIcon'
import { isHttp } from '@/utils/validate'
import { useAppStore, useRoutesStore, useSettingsStore } from '@/stores'
import defaultSettings from '@/default-settings'
import type { RouteData } from '@/stores/routes'
import './topbar.scss'

/**
 * 混合模式顶部导航
 */
export default function TopBarMix() {
  const location = useLocation()
  const navigate = useNavigate()
  const appStore = useAppStore()
  const settingsStore = useSettingsStore()
  const routesStore = useRoutesStore()

  // 可见菜单数量阈值，动态计算
  const [visibleNumber, setVisibleNumber] = useState(5)
  // 隐藏侧边栏的路径（首页等）
  const hideList = [defaultSettings.homePath]

  // 动态路由
  const dynamicRoutes = routesStore.dynamicRoutes

  /*
   * 顶部菜单列表：meta=null 的 Layout 容器用子路由替代
   */
  const topMenus = useMemo<RouteData[]>(() => {
    const list: RouteData[] = []
    dynamicRoutes.forEach((menu) => {
      if (menu.hidden !== true) {
        // meta=null 的菜单是 Layout 父容器，直接取其第一个子路由替代父级
        if (!menu.meta && menu.children && menu.children.length > 0) {
          list.push(menu.children[0] as RouteData)
        } else {
          list.push(menu)
        }
      }
    })
    return list
  }, [dynamicRoutes])

  /*
   * 当前选中顶级菜单路径
   */
  const [activeMenu, setActiveMenu] = useState<string>('')

  // 根据当前路由自动激活对应顶级菜单，并联动侧边栏
  useEffect(() => {
    const path = location.pathname
    let activePath = path

    if (hideList.indexOf(path) !== -1) {
      // hideList 中的页面强制隐藏侧边栏（首页 / 个人中心）
      appStore.hideSideBar(true)
    } else if (path !== undefined && path.lastIndexOf('/') > 0) {
      // 多级路径：查找匹配的顶级菜单
      const matchedTopMenu = findActiveTopMenu(path, dynamicRoutes)
      if (matchedTopMenu) {
        activePath = matchedTopMenu
        appStore.hideSideBar(false)
      } else {
        appStore.hideSideBar(false)
      }
    } else {
      // 根路径：隐藏侧边栏
      appStore.hideSideBar(true)
    }

    // 侧边栏联动 scope 设置
    activeRoutes(activePath, dynamicRoutes, routesStore, appStore)
    setActiveMenu(activePath)
     
  }, [location.pathname, dynamicRoutes])

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
   * 顶部菜单选中
   */
  const handleSelect: MenuProps['onClick'] = ({ key }) => {
    const route = dynamicRoutes.find((item) => item.path === key)

    if (isHttp(key)) {
      // 外部链接分支：新窗口打开
      window.open(key, '_blank')
    } else if (!route || !route.children) {
      // 无子路由分支：直接跳转，隐藏侧边栏
      navigate(key)
      appStore.hideSideBar(true)
    } else {
      // 有子路由分支：联动显示侧边栏子菜单
      activeRoutes(key, dynamicRoutes, routesStore, appStore)
      appStore.hideSideBar(false)
      setActiveMenu(key)
    }
  }

  const items: MenuProps['items'] = topMenus.map((item, index) => ({
    key: item.path || String(index),
    label: item.meta?.title,
    icon: item.meta && item.meta.icon && item.meta.icon !== '#' ? <SvgIcon iconClass={item.meta.icon} /> : undefined
  }))

  const topItems = items.slice(0, visibleNumber)
  const moreItems = items.slice(visibleNumber)
  const finalItems: MenuProps['items'] = moreItems.length
    ? [...topItems, { key: 'more', label: '更多菜单', children: moreItems }]
    : topItems

  return (
    <Menu
      className="topmenu-container"
      mode="horizontal"
      selectedKeys={[activeMenu]}
      items={finalItems}
      onClick={handleSelect}
      style={{ height: 50, lineHeight: '50px', borderBottom: 'none' }}
    />
  )
}

/**
 * 在顶级菜单树中递归查找包含当前路由的顶级菜单
 */
function findActiveTopMenu(currentPath: string, routers: RouteData[]): string | null {
  if (!routers) return null
  for (const menu of routers) {
    if (menu.hidden) continue
    if (menu.path === '/') continue
    if (descendantMatches(menu, currentPath)) {
      return menu.path || ''
    }
  }
  return null
}

/**
 * 判断 targetPath 是否匹配 route 的子孙路由路径
 */
function descendantMatches(route: RouteData, targetPath: string): boolean {
  if (!route.children) return false
  for (const child of route.children) {
    if (!child.path) continue
    // 子节点检测：精确匹配 | 子路径匹配（含 / 和 ? 两种情况）
    if (targetPath === child.path || targetPath.startsWith(child.path + '/') || targetPath.startsWith(child.path + '?')) {
      return true
    }
    // 孙子节点检测：递归
    if (child.children && descendantMatches(child, targetPath)) {
      return true
    }
  }
  return false
}

/**
 * 设置侧边栏联动作用域（存在子路由时 setScope，否则隐藏侧栏）
 */
function activeRoutes(
  key: string,
  routers: RouteData[],
  routesStore: { setScope: (path: string) => void },
  appStore: { hideSideBar: (status: boolean) => void }
) {
  // 匹配子菜单
  const routes: RouteData[] = []
  routers.forEach((menu) => {
    if (!menu.children) return
    menu.children.forEach((child) => {
      if (key === menu.path) {
        routes.push(child)
      }
    })
  })

  // 侧边栏联动
  if (routes.length > 0) {
    routesStore.setScope(key)
  } else {
    appStore.hideSideBar(true)
  }
  return routes
}
