/**
 * 名称：路由 Store
 * 功能：将后端菜单数据转换为前端路由
 */
import { markRaw } from 'vue'
import { constantRoutes } from '@/router'
import { getRouters } from '@/api/menu'
import Layout from '@/layout/index'
import ParentView from '@/layout/components/ParentView'
import InnerLink from '@/layout/components/InnerLink'

// 预先收集 views 目录下所有 .vue 文件，供后端路由字符串按需映射
const modules = import.meta.glob('./../../views/**/*.vue')

const useRoutesStore = defineStore(
  'routes',
  {
    state: () => ({
      /**
       * 纯动态路由（不含 constantRoutes）：初始化菜单入口
       */
      dynamicRoutes: [],
      /**
       * dynamicRoutes 拍平处理后版本：供路由初始化 router.addRoute 取用
       */
      flattenRoutes: [],
      /**
       *  混合布局模式下当前激活的顶级菜单路径，
       *  - 用于 Sidebar 联动过滤：只显示该菜单下的子路由。
       *  - 空字符串表示不过滤，显示全部动态路由。
       *  - 由 TopNav 选中菜单时写入，Settings 切换布局时清除。
       */
      _scope: ''
    }),
    getters: {
      /**
       * 静态+动态 全量路由（constantRoutes + dynamicRoutes）
       */
      fullRoutes: (state) => [...constantRoutes, ...state.dynamicRoutes]
    },
    actions: {
      /**
       * 初始化：请求后端菜单 → 转换组件映射 → 写入 dynamicRoutes，同时缓存拍平路由
       */
      initRoutes(roles) {
        return getRouters().then(res => {
          const raw = res.data

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
      },
      /**
       * 设置混合模式下侧边栏联动过滤的顶级菜单路径：支持 混合菜单 模式；
       */
      setScope(path) {
        this._scope = path
      }
    }
  })

/**
 * 首个标签 affix 固定：首个路由标记 affix，作为 TagsView 固定首页标签
 */
function setFirstAffix(routes) {
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
function transformRoutes(asyncRouterMap, flatten = false) {
  return asyncRouterMap.filter(route => {
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
          // 普通页面：定制 component 定位组件位置，通过 loadView 异步加载
          route.component = markRaw(loadView(route.component))
        }
      } else if (route.path) {
        // 普通页面：默认通过 path 匹配组件位置
        route.component = markRaw(loadView(route.path))
      }
      // 有子节点则递归转换，无子节点则删除 children 使叶子闭合
      if (route.children != null && route.children && route.children.length) {
        route.children = transformRoutes(route.children, flatten)
      } else {
        delete route['children']
      }
      return true
    } catch (error) {
      throw error
    }
  })
}

/**
 * 拍平 ParentView 子路由层级：将嵌套子节点提升到当前层级
 */
function filterChildren(childrenMap) {
  const children = []
  childrenMap.forEach(el => {
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
 */
export const loadView = (view) => {
  let res
  // 去掉 view 可能携带的前导 "/"，统一匹配格式
  const key = view.replace(/^\//, '')
  for (const path in modules) {
    // ./views/system/user/index.vue → system/user/index
    const relative = path.split('/views/')[1].replace('.vue', '')
    if (relative === key) {
      // 匹配到页面组件，返回 () => import() 异步工厂
      res = () => modules[path]()
    }
  }
  return res
}

export default useRoutesStore
