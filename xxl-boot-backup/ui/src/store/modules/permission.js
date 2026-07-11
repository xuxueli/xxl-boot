/**
 * 名称：路由权限 Store
 * 描述：负责把后端返回的菜单路由转换为前端可用的路由对象，并维护侧边栏、顶栏、默认路由等多套路由视图数据。
 *
 * 职责划分：
 * 1. state：保存不同场景下的路由集合；
 * 2. actions：负责生成并分发路由数据；
 * 3. helpers：负责路由组件映射和子路由拍平；
 * 4. getters：当前模块未定义 getters，调用方直接读取 state。
 */
import router, { constantRoutes } from '@/router'
import { getRouters } from '@/api/menu'
import Layout from '@/layout/index'
import ParentView from '@/components/ParentView'
import InnerLink from '@/layout/components/InnerLink'

// 预先收集 views 目录下的页面组件，供后端路由字符串按需映射为真实组件。
const modules = import.meta.glob('./../../views/**/*.vue')

const usePermissionStore = defineStore(
  'permission',
  {
    /**
     * 状态定义
     *
     * - routes：最终用于权限路由合并的完整路由表；
     * - addRoutes：本次动态追加的路由；
     * - defaultRoutes：默认展示的路由集合；
     * - topbarRouters：顶栏导航使用的路由；
     * - sidebarRouters：侧边栏菜单使用的路由。
     */
    state: () => ({
      routes: [],
      addRoutes: [],
      defaultRoutes: [],
      topbarRouters: [],
      sidebarRouters: []
    }),
    /**
     * 动作方法定义
     *
     * 本模块的核心工作是请求后端菜单数据，并拆分出不同 UI 场景需要的路由结果。
     */
    actions: {
      /**
       * 设置完整权限路由
       *
       * 最终结果会与 constantRoutes 合并，形成前端真正生效的路由表。
       */
      setRoutes(routes) {
        this.addRoutes = routes
        this.routes = constantRoutes.concat(routes)
      },
      /**
       * 设置默认路由
       *
       * 默认路由同样会和静态常量路由合并，主要用于默认菜单渲染。
       */
      setDefaultRoutes(routes) {
        this.defaultRoutes = constantRoutes.concat(routes)
      },
      /**
       * 设置顶栏路由
       */
      setTopbarRoutes(routes) {
        this.topbarRouters = routes
      },
      /**
       * 设置侧边栏路由: 用于侧边栏菜单
       * @param routes
       */
      setSidebarRouters(routes) {
        this.sidebarRouters = routes
      },
      /**
       * 生成权限路由
       *
       * 处理流程：
       * 1. 请求后端菜单数据；
       * 2. 深拷贝多份路由数据，避免不同转换过程互相影响；
       * 3. 生成侧边栏、重写路由、默认路由等不同结果；
       * 4. 回填 store 中的多套路由状态。
       */
      generateRoutes(roles) {
        /**
         * 这里显式返回 Promise，目的是把"菜单请求 + 路由转换 + 动态注册"这整套异步初始化流程
         * 暴露给外部调用方（通常是路由守卫或应用启动流程）统一等待；
         * 当全部路由都整理完成后，再通过 resolve(rewriteRoutes) 把最终可用的动态路由返回出去，
         * 这样调用方就可以在路由已准备就绪的前提下继续执行后续导航逻辑，避免出现页面跳转早于路由注册完成的问题。
         */
        return new Promise(resolve => {
          // 向后端请求路由数据
          getRouters().then(res => {
            const sdata = JSON.parse(JSON.stringify(res.data))
            const rdata = JSON.parse(JSON.stringify(res.data))
            const defaultData = JSON.parse(JSON.stringify(res.data))
            const sidebarRoutes = filterAsyncRouter(sdata)
            const rewriteRoutes = filterAsyncRouter(rdata, false, true)
            const defaultRoutes = filterAsyncRouter(defaultData)

            // isMenuFrame 生成的根 Layout 路由（path="/"）无 redirect，补充后访问 "/" 才能跳转到 "/index"
            rewriteRoutes.forEach(route => {
              if (route.path === '/' && route.component === Layout && !route.redirect) {
                route.redirect = '/index'
              }
            })

            // 首页固定标签：isMenuFrame 生成 Layout 父路由 + 子路由结构，需在子路由上设置 affix
            const setFirstAffix = (routes) => {
              const first = routes?.[0];
              if (!first) return;
              if (first.children?.[0]) {
                first.children[0].meta = { ...first.children[0].meta, affix: true };
              } else if (first.meta) {
                first.meta = { ...first.meta, affix: true };
              }
            };
            setFirstAffix(sidebarRoutes);
            setFirstAffix(rewriteRoutes);

            // 设置路由
            this.setRoutes(rewriteRoutes)                                   // 设置完整权限路由
            this.setSidebarRouters(constantRoutes.concat(sidebarRoutes))    // 设置侧边栏路由
            this.setDefaultRoutes(sidebarRoutes)                            // 设置默认路由
            this.setTopbarRoutes(defaultRoutes)                             // 设置顶栏路由

            resolve(rewriteRoutes)
          })
        })
      }
    }
  })

/**
 * 遍历后台传来的路由配置，将字符串组件名转换为真实组件对象。
 *
 * @param {Array} asyncRouterMap 后端返回的路由数组
 * @param {Object|boolean} lastRouter 上一级路由，用于拼接多级路径
 * @param {boolean} type 是否执行子路由拍平处理
 * @returns {Array}
 */
function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
  return asyncRouterMap.filter(route => {
    if (type && route.children) {
      route.children = filterChildren(route.children)
    }
    if (route.component) {
      // 框架级容器组件使用固定映射，普通页面组件再走动态加载。
      if (route.component === 'Layout') {
        route.component = Layout
      } else if (route.component === 'ParentView') {
        route.component = ParentView
      } else if (route.component === 'InnerLink') {
        route.component = InnerLink
      } else {
        route.component = loadView(route.component)
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type)
    } else {
      delete route['children']
      delete route['redirect']
    }
    return true
  })
}

/**
 * 递归拍平 ParentView 子路由。
 *
 * 该方法用于处理多层级菜单，把需要继承父级 path 的子节点展开成前端更易消费的结构。
 *
 * @param {Array} childrenMap 子路由集合
 * @param {Object|boolean} lastRouter 上一级路由
 * @returns {Array}
 */
function filterChildren(childrenMap, lastRouter = false) {
  var children = []
  childrenMap.forEach(el => {
    el.path = lastRouter ? lastRouter.path + '/' + el.path : el.path
    if (el.children && el.children.length && el.component === 'ParentView') {
      children = children.concat(filterChildren(el.children, el))
    } else {
      children.push(el)
    }
  })
  return children
}

/**
 * 视图组件懒加载器
 *
 * 根据后端返回的 view 字符串，在 import.meta.glob 收集的页面组件中查找并返回异步组件工厂。
 *
 * @param {string} view 页面路径
 * @returns {Function|undefined}
 */
export const loadView = (view) => {
  let res
  for (const path in modules) {
    /**
     * import.meta.glob 收集到的是完整文件路径，例如：
     * `../views/system/user/index.vue`
     * 这里统一截取 `views/` 之后、`.vue` 之前的相对路径，转换成 `system/user/index`，
     * 以便与后端路由里返回的 view 字段直接对比；两边约定一致时，才能定位到正确的页面组件。
     */
    const dir = path.split('views/')[1].split('.vue')[0]
    if (dir === view) {
      res = () => modules[path]()
    }
  }
  return res
}

export default usePermissionStore
