/**
 * navigation - 路由导航桥接
 *
 * React Router 没有全局 router 实例（BrowserRouter + Routes 模式），
 * 本模块持有导航函数与当前路由信息，供 utils/tab.ts 等非组件模块调用。
 * 由 AppRouter（router/index.tsx）在渲染时同步更新。
 */
import type { Location, NavigateFunction, NavigateOptions, To } from 'react-router-dom'

/** 当前导航函数 */
let navigateFn: NavigateFunction | null = null
/** 当前路由位置 */
let currentLocation: Location | null = null

/**
 * 更新导航桥接（由路由组件调用）
 * @param navigate 导航函数
 * @param location 当前路由位置
 */
export function setNavigation(navigate: NavigateFunction, location: Location): void {
  navigateFn = navigate
  currentLocation = location
}

/** 导航桥接对象：供非组件模块使用 */
export const navigation = {
  /**
   * 当前路由信息（Vue router.currentRoute 的近似子集）
   */
  get currentRoute() {
    const path = currentLocation?.pathname || ''
    const fullPath = path + (currentLocation?.search || '')
    const query: Record<string, string> = {}
    if (currentLocation) {
      new URLSearchParams(currentLocation.search).forEach((value, key) => {
        query[key] = value
      })
    }
    return {
      path,
      fullPath,
      query,
      matched: []
    }
  },
  /**
   * 跳转
   * @param to 目标（路径字符串或路由对象）
   * @param opts 选项（replace/state 等）
   */
  navigate(to: To | number, opts?: NavigateOptions) {
    if (navigateFn) {
      navigateFn(to as any, opts)
    }
  },
  /**
   * push 跳转
   * @param to 目标
   */
  push(to: To) {
    if (navigateFn) {
      navigateFn(to)
    }
  },
  /**
   * replace 跳转
   * @param to 目标
   */
  replace(to: To) {
    if (navigateFn) {
      navigateFn(to, { replace: true })
    }
  },
  /**
   * 后退
   * @param delta 步数，默认 -1
   */
  go(delta = -1) {
    if (navigateFn) {
      navigateFn(delta)
    }
  }
}
