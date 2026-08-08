/**
 * 名称：路由 Store
 * 功能：将后端菜单数据转换为前端路由
 */
import { create } from 'zustand'
import { lazy, type ComponentType, type LazyExoticComponent } from 'react'
import { getRouters } from '@/api/login'
import Layout from '@/layout/index'
import ParentView from '@/layout/components/ParentView'
import InnerLink from '@/layout/components/InnerLink'

// 预先收集 views 目录下所有 .tsx 文件，供后端路由字符串按需映射
const modules = import.meta.glob('./../views/**/*.tsx')

/** 路由 meta 数据 */
export interface RouteMetaData {
  title?: string
  icon?: string
  activeMenu?: string
  affix?: boolean
  hidden?: boolean
  query?: Record<string, string>
  [key: string]: unknown
}

/** 前端路由节点（由后端菜单转换而来，component 为真实组件或懒加载组件） */
export interface RouteData {
  path?: string
  /** 组件：转换前为后端字符串（Layout/ParentView/InnerLink/路径），转换后为真实组件或懒加载组件 */
  component?: string | ComponentType | LazyExoticComponent<ComponentType>
  name?: string
  redirect?: string
  hidden?: boolean
  alwaysShow?: boolean
  meta?: RouteMetaData
  children?: RouteData[]
  [key: string]: unknown
}

/** 路由 Store 状态 */
interface RoutesState {
  /** 纯动态路由（不含 constantRoutes）：初始化菜单入口 */
  dynamicRoutes: RouteData[]
  /** dynamicRoutes 拍平处理后版本：供路由初始化取用 */
  flattenRoutes: RouteData[]
  /** 混合布局模式下当前激活的顶级菜单路径（Sidebar 联动过滤用） */
  _scope: string
  /** 路由是否已初始化完成（防止重复初始化） */
  routesReady: boolean
  /** 静态+动态 全量路由（constantRoutes + dynamicRoutes） */
  fullRoutes: RouteData[]
  /** 初始化：请求后端菜单 → 转换组件映射 → 写入 dynamicRoutes，同时缓存拍平路由 */
  initRoutes: () => Promise<void>
  /** 获取拍平路由 */
  getFlattenRoutes: () => RouteData[]
  /** 设置混合模式下侧边栏联动过滤的顶级菜单路径 */
  setScope: (path: string) => void
}

export const useRoutesStore = create<RoutesState>((set, get) => ({
  dynamicRoutes: [],
  flattenRoutes: [],
  _scope: '',
  routesReady: false,
  // 全量路由：动态路由 + 静态路由合并由各消费方（Sidebar/TopBar 等）按需拼接；
  // 此处仅维护动态路由，避免与 router/constant 产生循环依赖（constant 依赖 layout，layout 依赖 stores）
  fullRoutes: [],

  /**
   * 初始化：请求后端菜单 → 转换组件映射 → 写入 dynamicRoutes，同时缓存拍平路由
   */
  initRoutes() {
    return getRouters().then((res) => {
      const raw = res.data as unknown as RouteData[]

      // 未拍平：保留树结构，供菜单渲染
      const dynamicRoutes = transformRoutes(JSON.parse(JSON.stringify(raw)))
      setFirstAffix(dynamicRoutes)
      // 拍平：供直接取用
      const flattenRoutes = transformRoutes(JSON.parse(JSON.stringify(raw)), true)
      setFirstAffix(flattenRoutes)

      set({
        dynamicRoutes,
        flattenRoutes,
        routesReady: true,
        fullRoutes: dynamicRoutes
      })
    })
  },

  /**
   * 获取拍平路由：返回 initRoutes 时生成的数据
   */
  getFlattenRoutes() {
    return get().flattenRoutes
  },

  /**
   * 设置混合模式下侧边栏联动过滤的顶级菜单路径：支持 混合菜单 模式
   */
  setScope(path: string) {
    set({ _scope: path })
  }
}))

/**
 * 首个标签 affix 固定：首个路由标记 affix，作为 TagsView 固定首页标签
 */
function setFirstAffix(routes: RouteData[]) {
  const first = routes?.[0]
  if (!first) return
  // 有子路由则标记首个子路由，无子路由则标记自身
  if (first.children?.[0]) {
    first.children[0].meta = { ...first.children[0].meta, affix: true }
  } else if (first.meta) {
    first.meta = { ...first.meta, affix: true }
  }
}

/**
 * 转换路由：字符串组件名 → 真实组件对象，递归处理子路由
 */
function transformRoutes(routerMap: RouteData[], flatten = false): RouteData[] {
  return routerMap.filter((route) => {
    try {
      // flatten=true 时拍平 ParentView 层级
      if (flatten && route.children) {
        route.children = filterChildren(route.children)
      }

      // 组件映射：Layout/ParentView/InnerLink 用固定组件，其余按路径懒加载
      if (route.component) {
        if (route.component === 'Layout') {
          route.component = Layout
        } else if (route.component === 'ParentView') {
          route.component = ParentView
        } else if (route.component === 'InnerLink') {
          route.component = InnerLink
        } else {
          // 普通页面-1：定制 component 定位组件位置，通过 loadView 异步加载
          const _component = loadView(route.component as string)
          if (typeof _component === 'undefined') {
            console.error(`transformRoutes loadView fail, route.component：[${route.component}]，重定向到 404`)
            route.component = lazy(() => import('@/views/common/404'))
          } else {
            route.component = _component
          }
        }
      } else if (route.path) {
        // 普通页面-2：默认通过 path 匹配组件位置
        const _component = loadView(route.path)
        if (typeof _component === 'undefined') {
          console.error(`transformRoutes loadView fail, route.path：[${route.path}]，重定向到 404`)
          route.component = lazy(() => import('@/views/common/404'))
        } else {
          route.component = _component
        }
      }

      // 有子节点则递归转换，无子节点则删除 children 使叶子闭合
      if (route.children != null && route.children && route.children.length) {
        route.children = transformRoutes(route.children, flatten)
      } else {
        delete route['children']
      }

      return true
    } catch (error) {
      throw new Error(`transformRoutes error：${error} \n route：[${JSON.stringify(route)}]`)
    }
  })
}

/**
 * 拍平 ParentView 子路由层级：将嵌套子节点提升到当前层级
 */
function filterChildren(childrenMap: RouteData[]): RouteData[] {
  const children: RouteData[] = []
  childrenMap.forEach((el) => {
    el._rawPath = el.path
    if (el.children && el.children.length && el.component === 'ParentView') {
      // ParentView 节点：递归拍平，子节点直接提升至当前数组
      children.push(...filterChildren(el.children))
    } else {
      // 普通节点：直接保留
      children.push(el)
    }
  })
  return children
}

/**
 * 按 view 路径匹配页面组件
 *
 * 支持两种格式匹配：
 *   1) /path/index   → 匹配 views/path/index.tsx
 *   2) /path         → 尝试匹配 views/path/index.tsx（目录格式，自动补全 index）
 */
export const loadView = (view: string): LazyExoticComponent<ComponentType> | undefined => {
  let res: LazyExoticComponent<ComponentType> | undefined
  // 去掉 view 可能携带的前导 "/"，统一匹配格式
  const key = view.replace(/^\//, '')
  for (const path in modules) {
    // ../views/{org/user/index}.tsx → org/user/index
    const relative = path.split('/views/')[1].replace(/\.tsx$/, '')
    if (relative === key) {
      // 匹配到页面组件，返回 lazy 工厂
      res = lazy(() => modules[path]() as Promise<{ default: ComponentType }>)
    }
  }
  // 未匹配到，尝试 /path 格式 → 补全 /path/index
  if (!res) {
    const keyWithIndex = key + '/index'
    for (const path in modules) {
      const relative = path.split('/views/')[1].replace(/\.tsx$/, '')
      if (relative === keyWithIndex) {
        res = lazy(() => modules[path]() as Promise<{ default: ComponentType }>)
      }
    }
  }
  return res
}
