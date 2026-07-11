/**
 * 路由定义与守卫模块
 *
 * 职责：
 *   1. 声明静态路由（constantRoutes）——登录、错误页、首页、个人中心等，启动即注册；
 *   2. 创建全局 router 实例（HTML5 history 模式）；
 *   3. 定义全局守卫（beforeEach/afterEach）——鉴权、路由注入、进度条控制。
 *
 * 路由配置项说明：
 *   hidden       - true 时侧边栏不显示（登录、错误页、编辑页等）
 *   alwaysShow   - true 时始终显示根路由，忽略 children 数量规则
 *   redirect     - 'noredirect' 时面包屑不可点击
 *   name         - 路由名称，keep-alive 依赖此字段
 *   permissions  - 菜单权限标识数组，动态路由筛选依据
 *   meta.title   - 侧边栏/面包屑显示名
 *   meta.icon    - 侧边栏图标，对应 src/assets/icons/svg
 *   meta.noCache - true 时不被 keep-alive 缓存
 *   meta.breadcrumb - false 时面包屑不显示
 *   meta.activeMenu - 高亮指定侧边栏菜单
 *
 * 协作：
 *   - store/modules/permission ——后端菜单转路由 + 权限筛选
 *   - utils/request.js isRelogin ——重复登录弹窗控制
 */
import { createWebHistory, createRouter } from 'vue-router'
import Layout from '@/layout'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import { isHttp, isPathMatch } from '@/utils/validate'
import { isRelogin } from '@/utils/request'
import useUserStore from '@/store/modules/user'
import usePermissionStore from '@/store/modules/permission'


/**
 * 静态路由 ——无权限门槛，启动即注册
 * 包含：登录、首页、个人中心、重定向页、404 兜底、401、
 */
export const constantRoutes = [
  {
    // 登录页
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    // 首页：根路径默认跳转
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
  {
    // 个人中心：hidden 控制侧栏不显示
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
  },
  {
    // 重定向：内部重定向承载页
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
    // 401：未授权或会话过期
    path: '/401',
    component: () => import('@/views/error/401'),
    hidden: true
  },
  {
    // 404：访问资源不存在。兜底，必须放在末段
    path: "/:pathMatch(.*)*",
    component: () => import('@/views/error/404'),
    hidden: true
  }
]


/**
 * 路由实例：初始仅加载静态路由，动态路由后续 addRoute 注入
 */
const router = createRouter({
  // HTML5 history 模式
  history: createWebHistory(),
  // 加载静态路由
  routes: constantRoutes,
  scrollBehavior(to, from, savedPosition) {
    // 前进/后退：恢复历史位置，否则回到顶部
    return savedPosition || { top: 0 }
  },
})


// ==================== 全局路由守卫 ====================

NProgress.configure({ showSpinner: false })

const whiteList = ['/login']
const isWhiteList = (path) => whiteList.some(pattern => isPathMatch(pattern, path))

router.beforeEach(async (to, from) => {
  NProgress.start()
  const hasToken = getToken()

  // 已登录
  if (hasToken) {
    // 已登录访问登录页 → 重定向首页
    if (to.path === '/login') {
      NProgress.done()
      return { path: '/' }
    }
    // 白名单直接放行
    if (isWhiteList(to.path)) {
      return true
    }
    // 未获取用户信息 → 拉取用户信息 + 动态路由注入
    if (useUserStore().roles.length === 0) {
      isRelogin.show = true
      try {
        await useUserStore().getInfo()
        isRelogin.show = false
        // 生成并注入动态路由
        const accessRoutes = await usePermissionStore().generateRoutes()
        accessRoutes.forEach(route => {
          if (!isHttp(route.path)) {
            router.addRoute(route)
          }
        })
        // replace: true 避免历史记录残留
        return { ...to, replace: true }
      } catch (err) {
        // 获取信息失败 → 清除 token 并跳转登录
        await useUserStore().logOut()
        ElMessage.error(err)
        return { path: '/' }
      }
    }
    // 已有用户信息，直接放行
    return true
  }

  // 未登录
  // 白名单放行，否则重定向登录页并携带原路径
  if (isWhiteList(to.path)) {
    return true
  }
  NProgress.done()
  return `/login?redirect=${to.fullPath}`
})

router.afterEach(() => {
  NProgress.done()
})

export default router
