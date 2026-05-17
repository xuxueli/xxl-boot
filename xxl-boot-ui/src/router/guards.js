/**
 * 名称：全局路由守卫注册模块
 * 描述：集中管理路由切换前后的鉴权流程、进度反馈与异常兜底，确保“先鉴权再进入页面”。
 *
 * 模块职责（从全局到细节）：
 * 1. 统一前置守卫流程：在 `beforeEach` 中串联 token 校验、白名单放行、用户信息初始化与动态路由注入；
 * 2. 统一后置守卫流程：在 `afterEach` 中收口进度条，避免因分支跳转导致加载状态残留；
 * 3. 统一异常处理：当拉取用户信息或生成路由失败时，执行登出并回退到安全入口；
 * 4. 统一辅助判断：使用 `isPathMatch` 处理白名单匹配，使用 `isHttp` 过滤外链路由，减少分散判断。
 *
 * 关键执行路径：
 * - 已登录：
 *   - 访问登录页：直接回首页，避免重复登录；
 *   - 访问白名单：直接放行；
 *   - 首次进入（roles 为空）：先拉取用户信息，再按权限生成并注册动态路由，最后 replace 重入目标页；
 *   - 非首次进入：直接放行。
 * - 未登录：
 *   - 访问白名单：放行；
 *   - 访问受控页：重定向至登录页并携带 redirect 参数。
 */
import router from './index'
import { ElMessage } from 'element-plus'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import { isHttp, isPathMatch } from '@/utils/validate'
import { isRelogin } from '@/utils/request'
import useUserStore from '@/store/modules/user'
import useSettingsStore from '@/store/modules/settings'
import usePermissionStore from '@/store/modules/permission'

NProgress.configure({ showSpinner: false })

// 路由白名单：无需登录即可访问；采用模式匹配，便于后续扩展通配规则。
const whiteList = ['/login']

const isWhiteList = (path) => {
  return whiteList.some(pattern => isPathMatch(pattern, path))
}

router.beforeEach(async (to, from) => {
  // 所有跳转先启动顶部进度条；后续由各分支或 afterEach 负责结束。
  NProgress.start()
  if (getToken()) {
    // 已登录场景：先同步设置当前页面标题，确保菜单/标签页文案一致。
    to.meta.title && useSettingsStore().setMenuTitle(to.meta.title)
    if (to.path === '/login') {
      // 已登录访问登录页：重定向到首页，阻止进入重复登录流程。
      NProgress.done()
      return { path: '/' }
    }
    if (isWhiteList(to.path)) {
      // 已登录访问白名单路由：直接放行。
      return true
    }
    /*if (to.path === '/lock') {
      NProgress.done()
      return { path: '/' }
    }*/
    if (useUserStore().roles.length === 0) {
      // 角色为空通常意味着页面刷新后的首次进入，需要重新初始化权限上下文。
      isRelogin.show = true
      try {
        // 1) 拉取 user_info（含角色/权限）。
        await useUserStore().getInfo()
        isRelogin.show = false
        // 2) 根据角色生成可访问的动态路由。
        const accessRoutes = await usePermissionStore().generateRoutes()
        accessRoutes.forEach(route => {
          // 外链路由不注入 vue-router，避免与内部路由系统混用。
          if (!isHttp(route.path)) {
            router.addRoute(route)
          }
        })
        // 3) 使用 replace 重新进入目标路由，确保本次匹配能命中新注册路由且不新增历史记录。
        return { ...to, replace: true }
      } catch (err) {
        // 任一初始化步骤失败时，统一清理登录态并回到安全入口。
        await useUserStore().logOut()
        ElMessage.error(err)
        return { path: '/' }
      }
    }
    // 角色信息已就绪：正常放行。
    return true
  } else {
    // 未登录场景：仅白名单放行，其余统一引导登录。
    if (isWhiteList(to.path)) {
      // 在免登录白名单，直接进入。
      return true
    }
    // 当前分支提前返回到登录页，需要手动结束进度条。
    NProgress.done()
    // 携带 redirect，登录成功后可回跳原目标页。
    return `/login?redirect=${to.fullPath}`
  }
})

// 后置守卫兜底收口：不论前置分支如何返回，都确保进度条关闭。
router.afterEach(() => {
  NProgress.done()
})
