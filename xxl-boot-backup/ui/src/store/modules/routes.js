/**
 * 名称：路由 Store
 * 功能：将后端菜单数据转换为前端路由
 *
 * 数据语义：
 *   dynamicRoutes  — state，纯动态路由（不含 constantRoutes），可被运行时覆写
 *   fullRoutes     — getter，constantRoutes + dynamicRoutes，全量路由
 *   sidebarRoutes  — getter，dynamicRoutes，供菜单渲染
 *   topbarRoutes   — getter，初始动态路由快照，供 TopNav（不受覆写影响）
 */
import { constantRoutes } from '@/router'
import { getRouters } from '@/api/menu'
import Layout from '@/layout/index'
import ParentView from '@/components/ParentView'
import InnerLink from '@/layout/components/InnerLink'

const modules = import.meta.glob('./../../views/**/*.vue')

// generateRoutes 生成的初始快照，供 resetDynamicRoutes 和 topbarRoutes 使用
let _baselineRoutes = []
let _topbarRoutes = []

const useRoutesStore = defineStore(
  'routes',
  {
    state: () => ({
      dynamicRoutes: []
    }),
    getters: {
      // 全量路由（静态+动态），供 TagsView / Breadcrumb / HeaderSearch
      fullRoutes: (state) => [...constantRoutes, ...state.dynamicRoutes],
      // 菜单路由（仅动态），随 dynamicRoutes 变化，供 Sidebar / TopBar
      sidebarRoutes: (state) => state.dynamicRoutes,
      // 顶栏路由（初始快照，不受覆写影响），供 TopNav
      topbarRoutes: () => _topbarRoutes
    },
    actions: {
      /** 请求后端菜单 → 转换 → 写入 dynamicRoutes，返回拍平路由供 router.addRoute */
      generateRoutes(roles) {
        return getRouters().then(res => {
          const menuData = res.data
          // 未拍平：写入 dynamicRoutes，供菜单渲染
          const dynamicRoutes = filterAsyncRouter(JSON.parse(JSON.stringify(menuData)))
          // 拍平（展开 ParentView）：返回给 router.addRoute
          const flattenRoutes = filterAsyncRouter(JSON.parse(JSON.stringify(menuData)), true)

          // 首个路由标记 affix，作为TagsView固定标签
          const setFirstAffix = (routes) => {
            const first = routes?.[0]
            if (!first) return
            // 优先标记首个子路由，无子路由则标记自身
            if (first.children?.[0]) {
              first.children[0].meta = { ...first.children[0].meta, affix: true }
            } else if (first.meta) {
              first.meta = { ...first.meta, affix: true }
            }
          }
          setFirstAffix(dynamicRoutes)
          setFirstAffix(flattenRoutes)

          this.dynamicRoutes = dynamicRoutes
          _topbarRoutes = dynamicRoutes
          _baselineRoutes = JSON.parse(JSON.stringify(dynamicRoutes))

          return flattenRoutes
        })
      },
      /** 覆写 dynamicRoutes（TopNav 切换顶栏菜单时调用） */
      setDynamicRoutes(routes) {
        this.dynamicRoutes = routes
      },
      /** 恢复 dynamicRoutes 为初始快照（Settings 切换布局模式时调用） */
      resetDynamicRoutes() {
        this.dynamicRoutes = JSON.parse(JSON.stringify(_baselineRoutes))
      }
    }
  })

/** 字符串组件名 → 真实组件对象，递归处理子路由 */
function filterAsyncRouter(asyncRouterMap, flatten = false) {
  return asyncRouterMap.filter(route => {
    // flatten 模式：拍平 ParentView 层级，用于 router.addRoute
    if (flatten && route.children) {
      route.children = filterChildren(route.children)
    }
    // 组件映射：Layout/ParentView/InnerLink 为固定组件，其余动态懒加载
    if (route.component) {
      if (route.component === 'Layout') {
        route.component = Layout
      } else if (route.component === 'ParentView') {
        route.component = ParentView
      } else if (route.component === 'InnerLink') {
        route.component = InnerLink
      } else {
        route.component = loadView(route.component || route.path)
      }
    }
    // 有子节点则递归，无子节点则删除 children 使叶子闭合
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, flatten)
    } else {
      delete route['children']
    }
    return true
  })
}

/** 拍平 ParentView 子路由：将嵌套子节点提升到当前层级 */
function filterChildren(childrenMap) {
  const children = []
  childrenMap.forEach(el => {
    el._rawPath = el.path
    // ParentView 节点：递归拍平，子节点直接提升
    if (el.children && el.children.length && el.component === 'ParentView') {
      children.push(...filterChildren(el.children))
    } else {
      children.push(el)
    }
  })
  return children
}

/** 根据 view 路径匹配已收集的页面组件，返回异步组件工厂 */
export const loadView = (view) => {
  let res
  // 去除 view 前导 "/"，统一匹配格式
  const key = view.replace(/^\//, '')
  for (const path in modules) {
    // ./views/system/user/index.vue → system/user/index
    const relative = path.split('/views/')[1].replace('.vue', '')
    if (relative === key) {
      // 匹配到页面组件，返回 () => import() 工厂
      res = () => modules[path]()
    }
  }
  return res
}

export default useRoutesStore
