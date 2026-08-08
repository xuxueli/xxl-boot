/**
 * tab - 多标签页管理
 *
 * 封装 tagsView store + 路由的编排逻辑，提供打开、关闭、刷新、批量关闭等操作。
 *
 * 用法：
 *   import tab from '@/utils/tab'
 *   tab.openPage('用户管理', '/system/user', { id: 1 })
 */
import { useTagsViewStore } from '@/stores'
import type { TagView } from '@/stores/tagsView'
import { navigation } from '@/utils/navigation'
import { alive } from '@/utils/alive'

/** 标签页操作对象（含 name/path/query） */
interface TabObj {
  name?: string
  path?: string
  query?: Record<string, unknown>
  fullPath?: string
  meta?: { title?: string; affix?: boolean; [key: string]: unknown }
  [key: string]: unknown
}

export default {
  /**
   * 刷新当前标签页（强制重新挂载组件）
   *
   * 实现原理：
   *   1. 先从 tagsView 中删除该页面的缓存视图（delCachedView），触发缓存销毁。
   *   2. 再通过 replace 跳转到 /redirect + 原路径，携带原始 query。
   *   3. /redirect 路由会立即重定向回原路径，组件完整重新挂载，实现刷新。
   *
   * @param obj - { name, path, query }，省略时自动取当前路由
   * @returns Promise
   */
  refreshPage(obj?: TabObj) {
    const { path, query } = navigation.currentRoute
    // 已在 /redirect/ 路径，说明重定向尚未完成，跳过
    if (path.startsWith('/redirect/')) {
      return Promise.resolve()
    }
    if (obj === undefined) {
      // 未传对象：使用当前路由信息
      obj = { path, query }
    }
    // 先删缓存视图（组件销毁），再跳 /redirect（组件重新挂载）
    return useTagsViewStore
      .getState()
      .delCachedView(obj as TagView)
      .then(() => {
        const target = obj as TabObj
        navigation.replace({
          pathname: '/redirect' + target.path,
          search: target.query ? toSearchString(target.query) : ''
        })
      })
  },

  /**
   * 关闭当前标签页，并跳转到指定页面
   *
   * @param obj - 目标路由对象，省略时仅关闭不做跳转
   */
  closeOpenPage(obj?: TabObj) {
    useTagsViewStore.getState().delView(navigation.currentRoute as unknown as TagView)
    if (obj !== undefined) {
      if (typeof obj === 'string') {
        return navigation.push(obj)
      }
      return navigation.push({
        pathname: obj.path || '/',
        search: obj.query ? toSearchString(obj.query) : ''
      })
    }
  },

  /**
   * 关闭指定标签页（默认为当前页）
   *
   * @param obj - 目标路由对象，省略时关闭当前页
   * @returns Promise
   */
  closePage(obj?: TabObj) {
    if (obj === undefined) {
      // 关闭当前页：删除后跳转到上一个访问页
      const current = navigation.currentRoute
      return useTagsViewStore
        .getState()
        .delView(current as unknown as TagView)
        .then(({ visitedViews }) => {
          // 销毁被关闭页面的缓存（若存在）
          alive.drop(current.path)
          const latestView = visitedViews.slice(-1)[0]
          if (latestView) {
            return navigation.push(latestView.fullPath || '/')
          }
          return navigation.push('/')
        })
    }
    // 关闭指定页：仅删除，不做跳转
    return useTagsViewStore.getState().delView(obj as unknown as TagView).then(() => {
      if (obj.path) {
        alive.drop(obj.path)
      }
    })
  },

  /**
   * 关闭所有标签页
   */
  closeAllPage() {
    return useTagsViewStore
      .getState()
      .delAllViews()
      .then(({ visitedViews }) => {
        // 销毁全部缓存节点（保留 affix 标签）
        useTagsViewStore.getState().cachedViews.forEach((name) => alive.drop(name))
        return visitedViews
      })
  },

  /**
   * 关闭左侧标签
   *
   * @param obj - 基准路由，省略时取当前路由
   */
  closeLeftPage(obj?: TabObj) {
    const tag = (obj || navigation.currentRoute) as unknown as TagView
    return useTagsViewStore.getState().delLeftTags(tag).then(() => {
      alive.drop(tag.path || '')
      return useTagsViewStore.getState().visitedViews
    })
  },

  /**
   * 关闭右侧标签
   *
   * @param obj - 基准路由，省略时取当前路由
   */
  closeRightPage(obj?: TabObj) {
    const tag = (obj || navigation.currentRoute) as unknown as TagView
    return useTagsViewStore.getState().delRightTags(tag).then(() => {
      alive.drop(tag.path || '')
      return useTagsViewStore.getState().visitedViews
    })
  },

  /**
   * 关闭其他：关闭除指定标签外的其他所有标签
   *
   * @param obj - 需要保留的路由，省略时保留当前路由
   */
  closeOtherPage(obj?: TabObj) {
    const tag = (obj || navigation.currentRoute) as unknown as TagView
    return useTagsViewStore.getState().delOthersViews(tag).then(() => {
      // 销毁除当前外的其他缓存节点
      useTagsViewStore.getState().cachedViews.forEach((name) => {
        if (name !== tag.path) {
          alive.drop(name)
        }
      })
      return useTagsViewStore.getState().visitedViews
    })
  },

  /**
   * 打开新标签页，并跳转
   *
   * @param title  - 标签标题
   * @param url    - 路由路径
   * @param params - query 参数，如 { id: 1 } → ?id=1
   */
  openPage(title: string, url: string, params?: Record<string, unknown>) {
    const obj = { path: url, meta: { title } }
    useTagsViewStore.getState().addView(obj)
    return navigation.push({
      pathname: url,
      search: params ? toSearchString(params) : ''
    })
  },

  /**
   * 更新页面信息：更新 tagsView 中已访问页面的信息
   *
   * @param obj - 路由对象（需含 path 等匹配字段）
   */
  updatePage(obj: TabObj) {
    return useTagsViewStore.getState().updateVisitedView(obj as unknown as TagView)
  }
}

/**
 * 查询参数对象转 URL search 字符串
 * @param query 查询参数对象
 * @returns 以 ? 开头的 search 字符串
 */
function toSearchString(query: Record<string, unknown>): string {
  const searchParams = new URLSearchParams()
  Object.keys(query).forEach((key) => {
    const value = query[key]
    if (value != null && value !== '') {
      searchParams.set(key, String(value))
    }
  })
  const str = searchParams.toString()
  return str ? `?${str}` : ''
}
