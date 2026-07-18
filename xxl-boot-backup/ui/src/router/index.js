/**
 * 路由定义与守卫模块
 *
 * 职责：
 *   1. 声明静态路由（constantRoutes）——登录、错误页、个人中心等，启动即注册；
 *   2. 创建全局 router 实例（HTML5 history 模式）；
 *   3. 定义全局守卫（beforeEach/afterEach）——鉴权、路由注入、进度条控制。
 */
import { createWebHistory, createRouter } from 'vue-router'
import Layout from '@/layout'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import { isHttp, isPathMatch } from '@/utils/validate'
import { isRelogin } from '@/utils/request'
import { useUserStore, useRoutesStore, useSettingsStore } from '@/store'


/**
 * 静态路由 ——无权限门槛，启动即注册
 * 包含：登录、个人中心、重定向页、404 兜底、401、
 */
export const constantRoutes = [
  {
    // 登录页
    path: '/login',
    component: () => import('@/views/login'),
    hidden: true
  },
  {
    // 首页：默认跳转 “/index”
    path: '',
    redirect: '/index'
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
  // 自定义路由切换时的页面滚动行为：前进/后退 恢复历史位置，否则回到顶部
  scrollBehavior(to,
                 from,
                 savedPosition) {
    return savedPosition || { top: 0 }
  },
})


// ==================== 全局路由守卫 ====================

NProgress.configure({ showSpinner: false })

// 登录白名单
const whiteList = ['/login']
const isWhiteList = (path) => whiteList.includes(path)

// 全局前置拦截
router.beforeEach(async (to, from) => {
  NProgress.start()

  // 1、白名单：直接放行（登录页、404 等无需鉴权的页面）
  if (isWhiteList(to.path)) return true

  // 2、已登录：动态路由初始化
  const hasToken = getToken()
  if (hasToken) {

    // 2.1、已登录 & 访问登录页： 踢回首页
    if (to.path === '/login') {
      NProgress.done()
      return { path: '/' }
    }

    // 2.2、已登录：设置浏览器标签页标题（动态标题）
    to.meta && to.meta.title && useSettingsStore().setMenuTitle(to.meta.title)

    // 2.2、已登录 & roles 为空：说明尚未拉取用户信息（首次登录或刷新页面后），需要初始化动态路由
    if (useUserStore().roles.length === 0) {
      try {
        // a、获取用户信息：用户 + 角色权限信息
        isRelogin.show = true
        await useUserStore().getInfo()
        isRelogin.show = false

        // b、初始化动态路由：初始化路由（后端菜单 → 前端路由） -> 获取拍平后数据 -> 过滤 http 链接后逐条注入
        await useRoutesStore().initRoutes()
        const accessRoutes = useRoutesStore().getFlattenRoutes()
        accessRoutes.forEach(route => {
          if (!isHttp(route.path)) {
            router.addRoute(route)
          }
        })

        // c、replace: true：注入的路由需当前导航重新匹配，同时避免历史记录残留 “空路由条目”
        return { ...to, replace: true }
      } catch (err) {
        // 路由初始化异常：退出登录
        await useUserStore().logout()
        ElMessage.error('Init Router Error:' + JSON.stringify(err))
        return { path: '/' }
      }
    }
    return true
  }

  // 3、未登录：跳转登录页并回传原路径供登录后重定向

  NProgress.done()
  return `/login?redirect=${to.fullPath}`
})

// 全局后置拦截
router.afterEach((to) => {
  NProgress.done()
  to.meta && to.meta.title && useSettingsStore().setMenuTitle(to.meta.title)
})

export default router
