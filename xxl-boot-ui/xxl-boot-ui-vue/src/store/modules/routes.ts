/**
 * 名称：路由 Store
 * 功能：将后端菜单数据转换为前端路由
 */
import { defineStore } from 'pinia'
import { markRaw } from 'vue'
import { constantRoutes } from '@/router'
import { getMenus } from '@/modules/framework/auth/api'
import type { MenuNode } from '@/types'
import { isHttp } from '@/utils/validate'
import Layout from '@/layout/index.vue'
import { InnerLink, ParentView } from '@/layout/components'

// 预先收集 modules 目录下所有 .vue 文件，供后端路由字符串按需映射
const modules = import.meta.glob('./../../modules/**/*.vue')

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

/** 前端路由节点（由后端菜单转换而来，component 为真实组件或懒加载工厂） */
export interface RouteData {
  path?: string
  component?: unknown
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
  /**
   * 纯动态路由（不含 constantRoutes）：初始化菜单入口
   */
  dynamicRoutes: RouteData[]
  /**
   * dynamicRoutes 拍平处理后版本：供路由初始化 router.addRoute 取用
   */
  flattenRoutes: RouteData[]
}

const useRoutesStore = defineStore('routes', {
  state: (): RoutesState => ({
    dynamicRoutes: [],
    flattenRoutes: []
  }),
  getters: {
    /**
     * 静态+动态 全量路由（constantRoutes + dynamicRoutes）
     */
    fullRoutes: (state) => [...constantRoutes, ...state.dynamicRoutes]
  },
  actions: {
    /**
     * 初始化：请求后端菜单 → 适配为前端路由 → 转换组件映射 → 写入 dynamicRoutes，同时缓存拍平路由
     */
    initRoutes(roles?: string[]) {
      return getMenus().then((res) => {
        // 后端纯菜单数据 → 前端内部路由结构
        const raw = adaptMenusToRoutes(res.data || [])

        // 未拍平：保留树结构，供菜单渲染
        const dynamicRoutes = transformRoutes(JSON.parse(JSON.stringify(raw)))
        setFirstAffix(dynamicRoutes)
        this.dynamicRoutes = dynamicRoutes

        // 拍平：供 router.addRoute 直接取用
        this.flattenRoutes = transformRoutes(JSON.parse(JSON.stringify(raw)), true)
        setFirstAffix(this.flattenRoutes)
      })
    },
    /**
     * 获取拍平路由：返回 initRoutes 时生成的数据，供 router.addRoute
     */
    getFlattenRoutes() {
      return this.flattenRoutes
    }
  }
})

/**
 * 适配菜单：后端纯菜单树 → 前端内部路由结构
 *   - 目录：根级用 Layout、非根级用 ParentView，递归 children；
 *   - 菜单：url 同时作为路由 path 与页面定位 key；
 *   - 根级菜单：包装为 Layout + 单子节点，兼容侧栏叶子菜单逻辑；
 *   - 外链：component 用 InnerLink 占位，注入路由时跳过；
 *   - visible：0-显示、1-隐藏，转换为前端 hidden。
 */
function adaptMenusToRoutes(menuList: MenuNode[], depth = 0): RouteData[] {
  return menuList.map((menu) => {
    const hidden = menu.visible === 1
    const url = menu.url || ''
    const meta = { title: menu.name, icon: menu.icon }

    // 目录：按层级选择容器组件
    if (menu.type === 0) {
      const route: RouteData = {
        name: `menu_${menu.id}`,
        path: url,
        hidden,
        meta,
        component: depth === 0 ? 'Layout' : 'ParentView'
      }
      if (menu.children?.length) {
        route.children = adaptMenusToRoutes(menu.children, depth + 1)
      }
      return route
    }

    // 根级菜单：包装为 Layout + 单子节点，供侧栏提升为叶子菜单
    if (depth === 0) {
      return {
        name: `menu_${menu.id}`,
        path: url,
        hidden,
        component: 'Layout',
        children: [
          {
            name: `child_menu_${menu.id}`,
            path: url,
            component: isHttp(url) ? 'InnerLink' : url,
            meta
          }
        ]
      }
    }

    // 普通菜单：外链用 InnerLink，内部页面由 url 定位
    return {
      name: `menu_${menu.id}`,
      path: url,
      hidden,
      component: isHttp(url) ? 'InnerLink' : url,
      meta
    }
  })
}

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
      // flatten=true 时拍平 ParentView 层级（用于 router.addRoute）
      if (flatten && route.children) {
        route.children = filterChildren(route.children)
      }

      // 组件映射：Layout/ParentView/InnerLink 用固定组件，其余按路径懒加载
      if (route.component) {
        if (route.component === 'Layout') {
          route.component = markRaw(Layout)
        } else if (route.component === 'ParentView') {
          route.component = markRaw(ParentView)
        } else if (route.component === 'InnerLink') {
          route.component = markRaw(InnerLink)
        } else {
          // 普通页面-1：定制 component 定位组件位置，通过 loadView 异步加载
          const _component = loadView(route.component as string)
          if (typeof _component === 'undefined') {
            console.error(`transformRoutes loadView fail, route.component：[${route.component}]，重定向到 404`)
            route.component = markRaw(() => import('@/modules/framework/common/pages/404.vue'))
          } else {
            route.component = markRaw(_component)
          }
        }
      } else if (route.path) {
        // 普通页面-2：默认通过 path 匹配组件位置
        const _component = loadView(route.path)
        if (typeof _component === 'undefined') {
          console.error(`transformRoutes loadView fail, route.path：[${route.path}]，重定向到 404`)
          route.component = markRaw(() => import('@/modules/framework/common/pages/404.vue'))
        } else {
          route.component = markRaw(_component)
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
 *   1) /path/index   → 匹配 modules/framework|business/{path}/pages/index.vue
 *   2) /path         → 尝试匹配 modules/framework|business/{path}/pages/index.vue（目录格式，自动补全 index）
 */
export const loadView = (view: string): (() => Promise<unknown>) | undefined => {
  let res: (() => Promise<unknown>) | undefined
  // 去掉 view 可能携带的前导 "/"，统一匹配格式
  const key = view.replace(/^\//, '')
  for (const path in modules) {
    // 剥离 category（framework|business）与页面目录（pages）段：modules/.../{pages/index.vue} → {path}/index
    const relative = path.split('/modules/')[1].replace(/\.vue$/, '').replace(/^(framework|business)\//, '').replace('/pages/', '/')
    if (relative === key) {
      // 匹配到页面组件，返回 () => import() 异步工厂
      res = () => modules[path]()
    }
  }
  // 未匹配到，尝试 /path 格式 → 补全 /path/index
  if (!res) {
    const keyWithIndex = key + '/index'
    for (const path in modules) {
      const relative = path.split('/modules/')[1].replace(/\.vue$/, '').replace(/^(framework|business)\//, '').replace('/pages/', '/')
      if (relative === keyWithIndex) {
        res = () => modules[path]()
      }
    }
  }
  return res
}

export default useRoutesStore
