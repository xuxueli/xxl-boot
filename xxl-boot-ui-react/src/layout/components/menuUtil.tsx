/**
 * 菜单构建工具（menuUtil.ts）
 * 功能：根据路由树构建 antd Menu items（含"单子路由提升"逻辑），供侧边栏/顶部菜单复用
 */
import type { MenuProps } from 'antd'
import type { ReactNode } from 'react'
import SvgIcon from '@/components/SvgIcon'
import { isExternal } from '@/utils/validate'
import { getNormalPath } from '@/utils/common'
import type { RouteData } from '@/stores/routes'

/**
 * 解析路由路径：外部链接原样返回，绝对路径直接使用，相对路径拼接 basePath
 */
export function resolvePath(routePath: string | undefined, basePath: string): string {
  // 子路由本身是外部链接：直接返回
  if (isExternal(routePath || '')) {
    return routePath as string
  }
  // 父级基准路径是外部链接：返回父级路径
  if (isExternal(basePath)) {
    return basePath
  }
  // 以 / 开头的是绝对路径，无需拼接 basePath
  if (routePath && routePath.startsWith('/')) {
    return getNormalPath(routePath)
  }
  // 相对路径：拼接 basePath / routePath
  return getNormalPath(basePath + '/' + (routePath || ''))
}

/**
 * 标题超长时显示 tooltip
 */
export function hasTitle(title: string | undefined): string {
  if (title && title.length > 5) {
    return title
  }
  return ''
}

/**
 * 菜单标题渲染
 */
export function renderMenuTitle(title: string | undefined): ReactNode {
  return (
    <span className="menu-title" title={hasTitle(title)}>
      {title}
    </span>
  )
}

/**
 * 判断菜单是否只有一个可见子菜单
 */
export function hasOneShowingChild(children: RouteData[] = []) {
  if (!children) {
    children = []
  }
  const showingChildren = children.filter((item) => !item.hidden)
  if (showingChildren.length === 1) {
    return { onlyOneChild: showingChildren[0], expanded: true }
  }
  if (showingChildren.length === 0) {
    return { onlyOneChild: null, expanded: true }
  }
  return { onlyOneChild: null, expanded: false }
}

/**
 * 递归构建菜单项
 */
export function buildMenuItems(routes: RouteData[], basePath = ''): MenuProps['items'] {
  const items: MenuProps['items'] = []
  routes.forEach((item) => {
    if (item.hidden) return
    const { onlyOneChild, expanded } = hasOneShowingChild(item.children)

    if (expanded && onlyOneChild && !onlyOneChild.children) {
      // 单个可见子路由（且子路由为叶子）：直接渲染叶子菜单项
      const child = onlyOneChild
      const path = isExternal(child.path || '') ? (child.path as string) : resolvePath(child.path, basePath)
      items.push({
        key: path,
        label: renderMenuTitle(child.meta?.title),
        icon: <SvgIcon iconClass={child.meta?.icon || (item.meta && item.meta.icon) || 'form'} />
      })
    } else if (expanded && !onlyOneChild) {
      // 无可见子路由：父级自身作为叶子菜单
      const path = resolvePath(item.path, basePath)
      items.push({
        key: path,
        label: renderMenuTitle(item.meta?.title),
        icon: <SvgIcon iconClass={(item.meta && item.meta.icon) || 'form'} />
      })
    } else {
      // 多个可见子路由：渲染为子菜单，递归构建
      const key = resolvePath(item.path, basePath)
      items.push({
        key,
        label: renderMenuTitle(item.meta?.title),
        icon: item.meta && item.meta.icon ? <SvgIcon iconClass={item.meta.icon} /> : undefined,
        children: buildMenuItems(item.children || [], key)
      })
    }
  })
  return items
}
