/**
 * 路由 Store 模块
 *
 * 名称：routes.js
 * 描述：负责把后端返回的菜单路由转换为前端可用的路由对象，并维护侧边栏、顶栏、默认路由等多套路由视图数据。
 *
 * 核心职责：
 *   1. state：保存不同场景下的路由集合（routes/addRoutes/defaultRoutes/topbarRouters/sidebarRouters）；
 *   2. actions：负责生成并分发路由数据（generateRoutes 主入口）；
 *   3. helpers：负责路由组件映射和子路由拍平（filterAsyncRouter / filterChildren / loadView）；
 *   4. getters：当前模块未定义 getters，调用方直接读取 state。
 *
 * 路由数据流：
 *   后端 Menu 数据 → JSON.parse 深拷贝 → filterAsyncRouter 转换 → 多套结果注入 Store → router.addRoute 动态注册
 *
 * 组件映射策略：
 *   - 'Layout' → Layout 组件；
 *   - 'ParentView' → ParentView 组件；
 *   - 'InnerLink' → InnerLink 组件；
 *   - 其余 → loadView(path) 动态加载对应 views 页面组件。
 */
import router, { constantRoutes } from '@/router'
import { getRouters } from '@/api/menu'
import Layout from '@/layout/index'
import ParentView from '@/components/ParentView'
import InnerLink from '@/layout/components/InnerLink'

// 预先收集 views 目录下的页面组件，供后端路由字符串按需映射为真实组件。
// 匹配规则：从完整文件路径提取 `views/` 之后、`.vue` 之前的相对路径（如 system/user/index）。
const modules = import.meta.glob('./../../views/**/*.vue')

const useRoutesStore = defineStore(
  'routes',
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
       * 用于 router.addRoute 的批量注入。
       *
       * @param {Array} routes - 转换后的路由数组
       */
      setRoutes(routes) {
        this.addRoutes = routes
        this.routes = constantRoutes.concat(routes)
      },
      /**
       * 设置默认路由
       *
       * 默认路由同样会和静态常量路由合并，主要用于默认菜单渲染。
       *
       * @param {Array} routes - 转换后的路由数组
       */
      setDefaultRoutes(routes) {
        this.defaultRoutes = constantRoutes.concat(routes)
      },
      /**
       * 设置顶栏路由
       *
       * @param {Array} routes - 转换后的路由数组
       */
      setTopbarRoutes(routes) {
        this.topbarRouters = routes
      },
      /**
       * 设置侧边栏路由
       *
       * 用于侧边栏菜单的递归渲染。
       *
       * @param {Array} routes - 转换后的路由数组
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
       * 4. 回填 store 中的多套路由状态；
       * 5. 返回 rewriteRoutes 供外部 await。
       *
       * @param {string} roles - 用户角色（当前参数未使用，保留接口兼容）
       * @returns {Promise<Array>} - 解析后返回最终的 rewriteRoutes 路由数组
       */
      generateRoutes(roles) {
        return new Promise(resolve => {
          getRouters().then(res => {
            // 深拷贝：分别用于侧边栏、动态注册、默认路由，防止相互修改
            const sdata = JSON.parse(JSON.stringify(res.data))
            const rdata = JSON.parse(JSON.stringify(res.data))
            const defaultData = JSON.parse(JSON.stringify(res.data))

            // 生成不同场景的路由数据
            const sidebarRoutes = filterAsyncRouter(sdata)
            const rewriteRoutes = filterAsyncRouter(rdata, false, true)
            const defaultRoutes = filterAsyncRouter(defaultData)

            // 首页路由补救：isMenuFrame 生成的根 Layout 路由（path="/"）无 redirect，访问 "/" 需跳转到 "/index"
            rewriteRoutes.forEach(route => {
              if (route.path === '/') {
                route.component = Layout
                route.redirect = '/index'
              }
            })

            // 首页固定标签：为首个路由的首个子路由设置 affix
            const setFirstAffix = (routes) => {
              const first = routes?.[0]
              if (!first) return
              if (first.children?.[0]) {
                first.children[0].meta = { ...first.children[0].meta, affix: true }
              } else if (first.meta) {
                first.meta = { ...first.meta, affix: true }
              }
            }
            setFirstAffix(sidebarRoutes)
            setFirstAffix(rewriteRoutes)

            // 回写 store 状态
            this.setRoutes(rewriteRoutes)
            this.setSidebarRouters(constantRoutes.concat(sidebarRoutes))
            this.setDefaultRoutes(sidebarRoutes)
            this.setTopbarRoutes(defaultRoutes)

            resolve(rewriteRoutes)
          })
        })
      }
    }
  })

/**
 * 遍历后台传来的路由配置，将字符串组件名转换为真实组件对象。
 *
 * 处理流程：
 * 1. 过滤掉无权限的路由节点；
 * 2. 将字符串组件名映射为实际组件对象；
 * 3. 递归处理子路由；
 * 4. 叶子节点（无 children）删除 children/redirct 字段。
 *
 * @param {Array} asyncRouterMap - 后端返回的路由数组
 * @param {Object|boolean} lastRouter - 上一级路由对象（用于 ParentView 拍平）
 * @param {boolean} type - 是否执行子路由拍平处理（rewriteRoutes 需要）
 * @returns {Array} 转换后的路由数组
 */
function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
  return asyncRouterMap.filter(route => {
    // 子路由拍平：flatten ParentView 子节点到当前层级
    if (type && route.children) {
      route.children = filterChildren(route.children)
    }
    // 组件映射：字符串 → 实际组件对象
    if (route.component) {
      if (route.component === 'Layout') {
        route.component = Layout
      } else if (route.component === 'ParentView') {
        route.component = ParentView
      } else if (route.component === 'InnerLink') {
        route.component = InnerLink
      } else {
        route.component = loadView(route.path)
      }
    }
    // 递归处理子路由或清理叶子节点
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
 * 递归拍平 ParentView 子路由
 *
 * 该方法用于处理多层级菜单，将组件类型为 ParentView 的子节点“拍平”到当前层级。
 * 拍平后，子节点直接成为当前层级的子节点，父级 ParentView 路由消失。
 *
 * 典型场景：后端返回的目录型菜单（type=menu）携带 component='ParentView'，
 *   其子路由被“吸收”到父路由下，前端只渲染父路由 + 子节点结构。
 *
 * @param {Array} childrenMap - 子路由集合
 * @param {Object} lastRouter - 上一级路由对象（用于路径拼接）
 * @returns {Array} 拍平后的子路由数组
 */
function filterChildren(childrenMap, lastRouter = false) {
  const children = []
  childrenMap.forEach(el => {
    // 子节点路径拼接：父路由 path + 子路由 path
    el._rawPath = el.path
    //el.path = lastRouter ? lastRouter.path + '/' + el.path : el.path
    if (el.children && el.children.length && el.component === 'ParentView') {
      // 递归拍平嵌套的 ParentView
      children.push(...filterChildren(el.children, el))
    } else {
      children.push(el)
    }
  })
  return children
}

/**
 * 视图组件懒加载器
 *
 * 根据后端返回的 view 路径，在 import.meta.glob 收集的页面组件中查找并返回异步组件工厂。
 *
 * 匹配规则：
 * - 后端返回的 view 格式：`system/user/index`（相对 views/ 目录的路径）；
 * - 实际文件路径：`./views/system/user/index.vue`；
 * - 通过 `views/` 分割提取相对路径，与后端 view 字段对齐。
 *
 * @param {string} view - 页面路径（如 "system/user/index"）
 * @returns {Function|undefined} 异步组件工厂函数，未找到则返回 undefined
 */
export const loadView = (view) => {
  let res
  for (const path in modules) {
    const dir = path.split('/views')[1].split('.vue')[0]
    if (dir === view) {
      res = () => modules[path]()
    }
  }
  return res
}

export default useRoutesStore