/**
 * 菜单领域工具模块（menu.ts）
 *
 * 职责：
 *   - 提供"后端路由树 → UI 菜单渲染"所需的工具，供 Sidebar、TopBar、TopBarMix、HeaderSearch 等组件复用；
 *   - 收敛"菜单/目录"判断、包裹节点提升、子路由拍平、路径解析、递归查找、可见菜单数量计算等重复逻辑；
 *   - 包含纯函数（无状态、无副作用）与组合式函数 useVisibleMenuCount（顶部可见菜单数量计算）。
 */
import { isExternal, isHttp } from '@/utils/validate'
import { getNormalPath } from '@/utils/common'
import type { RouteData } from '@/store/modules/routes'
import { onBeforeUnmount, onMounted, ref } from 'vue'

/**
 * 判断顶级菜单是否为"菜单"（自身即页面，无真实下级菜单可展开）
 *   - 根节点"菜单"由后端构建为 meta=null 的包装节点，包裹单个模拟子路由，属叶节点；
 *   - 根节点"目录" meta 存在，需展开左侧菜单展示下级子菜单。
 */
export function isLeafMenu(route: RouteData): boolean {
  return !route.meta
}

/**
 * 过滤隐藏菜单（hidden 标记为 true 的路由不展示）
 */
export function filterMenuRoutes(routes: RouteData[]): RouteData[] {
  return routes.filter((route) => !route.hidden)
}

/**
 * 提升 meta=null 的包装节点为首个子路由
 *   - 后端构建根节点"菜单"时会生成 meta=null 的 Layout 包装节点，仅含单个模拟子路由；
 *   - 渲染顶层菜单时直接用该子路由替代包装节点，避免多一层无效层级。
 */
export function promoteSingleChildRoutes(routes: RouteData[]): RouteData[] {
  return routes.map((menu) => {
    if (!menu.meta && menu.children && menu.children.length > 0) {
      return menu.children[0] as RouteData
    }
    return menu
  })
}

/**
 * 拍平一级子路由列表，补充 parentPath 指向父级路由
 *   - 用于 mix 模式下"顶级目录 → 左侧子菜单"的联动匹配；
 *   - 语义：仅取每一级顶级菜单的直接 children，与 mix 联动过滤所需数据一致。
 */
export function flattenChildrenRoutes(routes: RouteData[]): RouteData[] {
  const children: RouteData[] = []
  routes.forEach((menu) => {
    if (!menu.children) return
    menu.children.forEach((child) => {
      if (child.parentPath === undefined) {
        child.parentPath = menu.path
      }
      children.push(child)
    })
  })
  return children
}

/**
 * 判断 targetPath 是否匹配 route 的子孙路由路径
 *   - 递归：先查直接子路由，再查孙子路由；
 *   - 匹配条件：targetPath === child.path 或 targetPath 以 child.path + '/' 或 '?' 开头。
 */
export function matchMenuDescendant(route: RouteData, targetPath: string): boolean {
  if (!route.children) return false
  for (const child of route.children) {
    if (!child.path) continue

    /* 子节点检测：精确匹配 | 子路径匹配（含 / 和 ? 两种情况） */
    if (targetPath === child.path || targetPath.startsWith(child.path + '/') || targetPath.startsWith(child.path + '?')) {
      return true
    }

    /* 孙子节点检测：递归 */
    if (child.children && matchMenuDescendant(child, targetPath)) {
      return true
    }
  }
  return false
}

/**
 * 在顶级菜单树中递归查找包含指定路由的顶级菜单对象
 *   - 遍历顶级菜单，对每个菜单调用 matchMenuDescendant 判断当前路径是否在其子孙中；
 *   - 命中时返回顶级菜单对象本身，供调用方判断是"菜单"还是"目录"。
 */
export function findActiveTopMenu(routes: RouteData[], currentPath: string): RouteData | null {
  for (const menu of routes) {
    if (menu.hidden) continue
    if (menu.path === '/') continue
    if (matchMenuDescendant(menu, currentPath)) {
      return menu
    }
  }
  return null
}

/**
 * 在路由树中递归查找指定路径的路由节点
 *   - 用于跳转前读取 route.query 等元信息；
 *   - 匹配条件：route.path === targetPath。
 */
export function findMenuByPath(routes: RouteData[], targetPath: string): RouteData | null {
  for (const route of routes) {
    if (route.path === targetPath) return route
    if (route.children) {
      const found = findMenuByPath(route.children, targetPath)
      if (found) return found
    }
  }
  return null
}

/**
 * 解析菜单路由路径（内部路由 / 外部链接 / query 统一处理）
 *   - 子路由本身是外部链接：直接返回，不走内部路由拼接；
 *   - 父级基准路径是外部链接：子路由也无法拼接，直接返回父级路径；
 *   - 绝对路径（以 / 开头）：直接使用（getNormalPath 规范化）；
 *   - 相对路径：拼接 basePath / routePath；
 *   - routeQuery 存在时一并返回，用于携带路由参数。
 */
export function resolveMenuPath(routePath: string | undefined, basePath?: string): string
export function resolveMenuPath(
  routePath: string | undefined,
  basePath?: string,
  routeQuery?: string
): string | { path: string; query: Record<string, unknown> }
export function resolveMenuPath(
  routePath: string | undefined,
  basePath = '',
  routeQuery?: string
): string | { path: string; query: Record<string, unknown> } {
  /* 子路由本身是外部链接：直接返回，不走内部路由拼接 */
  if (isExternal(routePath || '')) {
    return routePath as string
  }

  /* 父级基准路径是外部链接：子路由也无法拼接，直接返回父级路径 */
  if (isExternal(basePath)) {
    return basePath
  }

  /* 以 / 开头的是绝对路径，无需拼接 basePath */
  if (routePath && routePath.startsWith('/')) {
    /* routeQuery 是 JSON 字符串，解析为对象后和 path 一起返回 */
    if (routeQuery) {
      return { path: getNormalPath(routePath), query: JSON.parse(routeQuery) as Record<string, unknown> }
    }
    return getNormalPath(routePath)
  }

  /* 相对路径：拼接 basePath / routePath；有 query 时一并携带 */
  if (routeQuery) {
    return { path: getNormalPath(basePath + '/' + routePath), query: JSON.parse(routeQuery) as Record<string, unknown> }
  }
  return getNormalPath(basePath + '/' + (routePath || ''))
}

/**
 * 菜单搜索项：可搜索菜单节点
 */
export interface MenuSearchItem {
  path: string
  title: string[]
  icon: string
  query?: string
}

/**
 * 递归遍历路由树生成可搜索菜单列表
 *   - 每项含 path / title（路径层级串联）/ icon / query；
 *   - 叶节点（无 children 或 children 为空）才加入结果，非叶节点作为前缀聚合；
 *   - 供 HeaderSearch 菜单搜索复用。
 */
export function resolveMenuSearchItems(routes: RouteData[], basePath = '', prefixTitle: string[] = []): MenuSearchItem[] {
  let res: MenuSearchItem[] = []
  for (const r of routes) {
    /* 跳过隐藏路由 */
    if (r.hidden) {
      continue
    }

    /* 节点初始化：无 path 的纯目录节点以空串占位，仅作子路由前缀 */
    const p = r.path ? (r.path.length > 0 && r.path[0] === '/' ? r.path : '/' + r.path) : ''
    const data: MenuSearchItem = {
      path: !isHttp(r.path as string) ? getNormalPath(p) : (r.path as string),
      title: [...prefixTitle],
      icon: ''
    }

    /* 有 meta.title 时追加到标题链中 */
    if (r.meta && r.meta.title) {
      data.title = [...data.title, r.meta.title]
      data.icon = r.meta.icon as string

      /* 叶节点：加入搜索结果 */
      if (!r.children || r.children.length === 0) {
        res.push(data)
      }
    }

    /* 携带 query 参数 */
    if (r.query) {
      data.query = r.query as string
    }

    /* 递归子路由 */
    if (r.children) {
      const tempRoutes = resolveMenuSearchItems(r.children, data.path, data.title)
      if (tempRoutes.length >= 1) {
        res = [...res, ...tempRoutes]
      }
    }
  }
  return res
}

/**
 * 组合式函数：顶部可见菜单数量（useVisibleMenuCount）
 *   - 根据容器宽度动态计算顶部可显示的菜单数量，超出部分折叠到"更多"下拉；
 *   - 供 TopBar、TopBarMix 顶部导航复用。
 *
 * @param defaultValue - 初始可见数量，挂载后立即根据容器宽度重新计算
 * @returns visibleNumber：可见菜单数量（响应式）
 */
export function useVisibleMenuCount(defaultValue = 5) {
  const visibleNumber = ref(defaultValue) /* 可见菜单数量阈值，动态计算 */

  /*
   * 根据容器宽度计算可显示的菜单数量
   */
  function setVisibleNumber() {
    /* 可视区域1/3计算可显示菜单 */
    const width = document.body.getBoundingClientRect().width / 3
    visibleNumber.value = Math.max(1, parseInt(String(width / 85)))
  }

  onMounted(() => {
    setVisibleNumber()
    window.addEventListener('resize', setVisibleNumber)
  })
  onBeforeUnmount(() => {
    window.removeEventListener('resize', setVisibleNumber)
  })

  return { visibleNumber }
}
