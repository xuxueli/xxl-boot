/**
 * 名称：路由 Store
 * 功能：将后端菜单数据转换为前端路由
 *
 * 数据语义：
 *   dynamicRoutes  — state，纯动态路由（不含 constantRoutes），初始化后不变
 *   fullRoutes     — getter，constantRoutes + dynamicRoutes，全量路由
 */
import { constantRoutes } from '@/router'
import { getRouters } from '@/api/menu'
import Layout from '@/layout/index'
import ParentView from '@/components/ParentView'
import InnerLink from '@/layout/components/InnerLink'

const modules = import.meta.glob('./../../views/**/*.vue')

const useRoutesStore = defineStore(
  'routes',
  {
    state: () => ({
      dynamicRoutes: [],
      _scope: ''
    }),
    getters: {
      fullRoutes: (state) => [...constantRoutes, ...state.dynamicRoutes]
    },
    actions: {
      generateRoutes(roles) {
        return getRouters().then(res => {
          const menuData = res.data
          const dynamicRoutes = filterAsyncRouter(JSON.parse(JSON.stringify(menuData)))
          const flattenRoutes = filterAsyncRouter(JSON.parse(JSON.stringify(menuData)), true)

          const setFirstAffix = (routes) => {
            const first = routes?.[0]
            if (!first) return
            if (first.children?.[0]) {
              first.children[0].meta = { ...first.children[0].meta, affix: true }
            } else if (first.meta) {
              first.meta = { ...first.meta, affix: true }
            }
          }
          setFirstAffix(dynamicRoutes)
          setFirstAffix(flattenRoutes)

          this.dynamicRoutes = dynamicRoutes
          return flattenRoutes
        })
      },
      setScope(path) {
        this._scope = path
      }
    }
  })

function filterAsyncRouter(asyncRouterMap, flatten = false) {
  return asyncRouterMap.filter(route => {
    if (flatten && route.children) {
      route.children = filterChildren(route.children)
    }
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
