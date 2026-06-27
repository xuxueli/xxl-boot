/**
 * 名称：路由定义与路由实例模块
 * 描述：声明系统静态路由与权限动态路由，并创建全局 router 实例供应用挂载与守卫模块复用。
 *
 * 结构总览（从全局到细节）：
 * 1. `constantRoutes`：无权限门槛的基础路由，应用启动即注册（登录、错误页、首页、个人中心等）；
 * 2. `dynamicRoutes`：带权限标记的增量路由，通常在登录后由权限模块按角色筛选并动态注入；
 * 3. `router` 实例：统一使用 HTML5 history，默认加载静态路由，并定义滚动行为恢复策略。
 *
 * 协作关系：
 * - `guards.js` 负责鉴权与路由注入时机；
 * - `store/modules/permission` 负责把后端菜单转换并筛选为可注入路由；
 * - 本文件仅负责“声明路由”和“创建实例”，不承载运行期权限判断逻辑。
 */
import { createWebHistory, createRouter } from 'vue-router'
/* Layout */
import Layout from '@/layout'

/**
 * Note: 路由配置项
 *
 * hidden: true                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "ry"}' // 访问路由的默认传递参数
 * roles: ['admin', 'common']       // 访问路由的角色权限
 * permissions: ['a:a:a', 'b:b:b']  // 访问路由的菜单权限
 * meta : {
    noCache: true                   // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
  }
 */

// 公共路由（constantRoutes）：
// - 这些路由在 createRouter 时一次性注册；
// - 覆盖登录、错误、首页和个人中心等基础访问路径；
// - 即使动态路由加载失败，公共路由仍可保障基础导航能力。
export const constantRoutes = [
  {
    // 内部重定向承载页：用于统一处理需要跳转回原路径的场景。
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index.vue')
      }
    ]
  },
  {
    // 登录页：未登录用户的默认入口。
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },
  /*{
    path: '/register',
    component: () => import('@/views/register'),
    hidden: true
  },*/
  {
    // 404 兜底路由：应放在常量路由末段，匹配所有未命中路径。
    path: "/:pathMatch(.*)*",
    component: () => import('@/views/error/404'),
    hidden: true
  },
  {
    // 401 权限异常页：用于展示“已登录但无权限”的结果页。
    path: '/401',
    component: () => import('@/views/error/401'),
    hidden: true
  },
  {
    // 根路径默认跳转：首页作为系统主工作台。
    path: '',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: '/index',
        component: () => import('@/views/index'),
        name: 'Index',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  /*{
    path: '/lock',
    component: () => import('@/views/lock'),
    hidden: true,
    meta: { title: '锁定屏幕' }
  },*/
  {
    // 个人中心：挂在主布局下，通过 hidden 控制不在侧栏直接展示。
    path: '/user',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'profile/:activeTab?',
        component: () => import('@/views/system/user/profile/index'),
        name: 'Profile',
        meta: { title: '个人中心', icon: 'user' }
      }
    ]
  }
]

// 动态路由（dynamicRoutes）：
// - 路由定义中携带 permissions 字段，作为权限筛选依据；
// - 实际注入动作由权限模块和路由守卫触发；
// - 主要用于“入口隐藏但允许直达”的授权页面（如分配角色、分配用户、字典详情、代码生成编辑页）。
export const dynamicRoutes = [
  {
    path: '/system/user-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:user:edit'],
    children: [
      {
        path: 'role/:userId(\\d+)',
        component: () => import('@/views/system/user/authRole'),
        name: 'AuthRole',
        meta: { title: '分配角色', activeMenu: '/system/user' }
      }
    ]
  },
  {
    path: '/system/role-auth',
    component: Layout,
    hidden: true,
    permissions: ['system:role:edit'],
    children: [
      {
        path: 'user/:roleId(\\d+)',
        component: () => import('@/views/system/role/authUser'),
        name: 'AuthUser',
        meta: { title: '分配用户', activeMenu: '/system/role' }
      }
    ]
  },
  {
    path: '/sys/dict-data',
    component: Layout,
    hidden: true,
    permissions: ['system:dict:list'],
    children: [
      {
        path: 'index/:dictId(\\d+)',
        component: () => import('@/views/sys/dict/data'),
        name: 'Data',
        meta: { title: '字典数据', activeMenu: '/system/dict' }
      }
    ]
  },
  {
    path: '/tool/gen-edit',
    component: Layout,
    hidden: true,
    permissions: ['tool:gen:edit'],
    children: [
      {
        path: 'index/:tableId(\\d+)',
        component: () => import('@/views/tool/gen/editTable'),
        name: 'GenEdit',
        meta: { title: '修改生成配置', activeMenu: '/tool/gen' }
      }
    ]
  }
]

// 创建路由实例：
// - history 使用 createWebHistory（标准 History 模式）；
// - routes 初始仅加载 constantRoutes，动态路由后续按需 addRoute；
// - scrollBehavior 保持“有缓存位置优先恢复，否则回到顶部”的统一体验。
const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
  scrollBehavior(to, from, savedPosition) {
    // 浏览器前进/后退时优先恢复历史滚动位置，保持原生体验。
    if (savedPosition) {
      return savedPosition
    }
    // 常规路由跳转默认回到页面顶部，避免沿用上个页面滚动状态。
    return { top: 0 }
  },
})

export default router
