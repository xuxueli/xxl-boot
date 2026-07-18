/**
 * 名称：路由 Store
 * 功能：将后端菜单数据转换为前端路由，维护多套视图路由（侧边栏/顶栏/默认路由）
 *
 * 分支说明：
 *   state   — routes / addRoutes / defaultRoutes / topbarRouters / sidebarRouters
 *   actions — setRoutes / setDefaultRoutes / setTopbarRoutes / setSidebarRouters / generateRoutes
 *   helpers — filterAsyncRouter / filterChildren / loadView
 */
import router, { constantRoutes } from '@/router'
import { getRouters } from '@/api/menu'
import Layout from '@/layout/index'
import ParentView from '@/components/ParentView'
import InnerLink from '@/layout/components/InnerLink'

const modules = import.meta.glob('./../../views/**/*.vue')

const useRoutesStore = defineStore(
  'routes',
  {
    state: () => ({
      routes: [],              // 完整路由表（constantRoutes + addRoutes）
      addRoutes: [],           // 本次动态追加的路由
      defaultRoutes: [],       // 默认路由集合
      topbarRouters: [],       // 顶栏导航路由
      sidebarRouters: []       // 侧边栏菜单路由
    }),
    actions: {
      /** 写入完整路由表（合并 constantRoutes） */
      setRoutes(routes) {
        this.addRoutes = routes
        this.routes = constantRoutes.concat(routes)
      },
      /** 写入默认路由（合并 constantRoutes） */
      setDefaultRoutes(routes) {
        this.defaultRoutes = constantRoutes.concat(routes)
      },
      /** 写入顶栏路由 */
      setTopbarRoutes(routes) {
        this.topbarRouters = routes
      },
      /** 写入侧边栏路由 */
      setSidebarRouters(routes) {
        this.sidebarRouters = routes
      },
      /** 生成权限路由：请求后端菜单 → 深拷贝 → 转换 → 写入 store */
      generateRoutes(roles) {
        return getRouters().then(res => {
          const menuData = res.data
          // 深拷贝两份：侧边栏/默认路由共用一份，重写路由单独一份（需额外拍平）
          const sidebarRoutes = filterAsyncRouter(JSON.parse(JSON.stringify(menuData)))
          const rewriteRoutes = filterAsyncRouter(JSON.parse(JSON.stringify(menuData)), true)

          // 首个路由标记 affix，作为固定首页标签
          const setFirstAffix = (routes) => {
            const first = routes?.[0]
            if (!first) return
            // 有子路由则标记首个子路由，无子路由则标记自身
            if (first.children?.[0]) {
              first.children[0].meta = { ...first.children[0].meta, affix: true }
            } else if (first.meta) {
              first.meta = { ...first.meta, affix: true }
            }
          }
          setFirstAffix(sidebarRoutes)
          setFirstAffix(rewriteRoutes)

          this.setRoutes(rewriteRoutes)
          this.setSidebarRouters(constantRoutes.concat(sidebarRoutes))
          this.setDefaultRoutes(sidebarRoutes)
          this.setTopbarRoutes(sidebarRoutes)

          return rewriteRoutes
        })
      }
    }
  })

/** 字符串组件名 → 真实组件对象，递归处理子路由 */
function filterAsyncRouter(asyncRouterMap, flatten = false) {
  return asyncRouterMap.filter(route => {
    // rewrite 模式：拍平 ParentView 层级
    if (flatten && route.children) {
      route.children = filterChildren(route.children)
    }
    // 映射组件：Layout/ParentView/InnerLink 用固定组件，其余懒加载
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
    // 有子节点则递归，无子节点则删除 children 使叶子节点闭合
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, flatten)
    } else {
      delete route['children']
    }
    return true
  })
}

/** 拍平 ParentView 子路由，将嵌套子节点提升到当前层级 */
function filterChildren(childrenMap) {
  const children = []
  childrenMap.forEach(el => {
    el._rawPath = el.path
    if (el.children && el.children.length && el.component === 'ParentView') {
      // ParentView 节点：递归拍平，子级直接提升至当前数组
      children.push(...filterChildren(el.children))
    } else {
      // 普通节点：直接保留
      children.push(el)
    }
  })
  return children
}

/** 根据 view 路径匹配已收集的页面组件，返回异步组件工厂 */
export const loadView = (view) => {
  let res
  const key = view.replace(/^\//, '')
  for (const path in modules) {
    // ./views/system/user/index.vue → system/user/index
    const relative = path.split('/views/')[1].replace('.vue', '')
    if (relative === key) {
      // 匹配到对应页面组件，返回异步工厂函数
      res = () => modules[path]()
    }
  }
  return res
}

export default useRoutesStore
