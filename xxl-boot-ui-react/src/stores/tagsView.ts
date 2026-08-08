/**
 * 名称：标签页视图 Store
 * 描述：负责管理多页签导航所需的访问标签和缓存页面数据，并按设置决定是否持久化访问记录。
 */
import { create } from 'zustand'
import cache from '@/utils/cache'
import { useSettingsStore } from '@/stores'

// 持久化 key：用于保存普通访问标签页，affix 固定标签不参与持久化。
const PERSIST_KEY = 'tags-view-visited'

/** 标签页对象（路由信息子集） */
export interface TagView {
  path: string
  fullPath?: string
  name?: string | symbol
  title?: string
  query?: Record<string, unknown>
  meta?: {
    title?: string
    affix?: boolean
    [key: string]: unknown
  }
  [key: string]: unknown
}

/** 删除当前标签外的其他标签/缓存标签时的返回结构 */
interface ViewsResult {
  visitedViews: TagView[]
  cachedViews: string[]
}

/**
 * 判断当前是否开启 tags-view 持久化。
 */
function isPersistEnabled(): boolean {
  return useSettingsStore.getState().tagsViewPersist
}

/**
 * 保存访问过的标签页（只持久化最小字段集合，过滤 affix 固定标签）。
 */
function saveVisitedViews(views: TagView[]): void {
  if (!isPersistEnabled()) return
  const toSave = views
    .filter((v) => !(v.meta && v.meta.affix))
    .map((v) => ({ path: v.path, fullPath: v.fullPath, name: v.name, title: v.title, query: v.query, meta: v.meta }))
  cache.local.setJSON(PERSIST_KEY, toSave)
}

/**
 * 读取已持久化的标签页数据。
 */
function loadVisitedViews(): TagView[] {
  return cache.local.getJSON<TagView[]>(PERSIST_KEY) || []
}

/**
 * 清空 tags-view 缓存
 */
function clearVisitedViewsData(): void {
  cache.local.remove(PERSIST_KEY)
}

interface TagsViewState {
  /** 访问标签（可导航标签对象） */
  visitedViews: TagView[]
  /** 缓存标签（组件 name 集合，对应缓存白名单） */
  cachedViews: string[]
  /** 同时新增访问标签和缓存标签 */
  addView: (view: TagView) => void
  /** 新增普通访问标签 */
  addVisitedView: (view: TagView) => void
  /** 新增固定标签 */
  addAffixView: (view: TagView) => void
  /** 新增缓存标签 */
  addCachedView: (view: TagView) => void
  /** 删除单个标签的统一入口 */
  delView: (view: TagView) => Promise<ViewsResult>
  /** 删除单个访问标签 */
  delVisitedView: (view: TagView) => Promise<TagView[]>
  /** 删除单个缓存标签 */
  delCachedView: (view: TagView) => Promise<string[]>
  /** 删除当前标签之外的其他标签 */
  delOthersViews: (view: TagView) => Promise<ViewsResult>
  /** 删除其他访问标签，保留固定标签和当前标签 */
  delOthersVisitedViews: (view: TagView) => Promise<TagView[]>
  /** 删除其他缓存标签，只保留当前页对应的缓存项 */
  delOthersCachedViews: (view: TagView) => Promise<string[]>
  /** 删除全部标签的统一入口 */
  delAllViews: (view?: TagView) => Promise<ViewsResult>
  /** 删除全部访问标签，固定标签始终保留 */
  delAllVisitedViews: (view?: TagView) => Promise<TagView[]>
  /** 删除全部缓存标签 */
  delAllCachedViews: (view?: TagView) => Promise<string[]>
  /** 对外暴露的清理持久化缓存入口 */
  clearVisitedViews: () => void
  /** 更新单个访问标签的最新信息 */
  updateVisitedView: (view: TagView) => void
  /** 删除当前标签右侧的所有标签 */
  delRightTags: (view: TagView) => Promise<TagView[]>
  /** 删除当前标签左侧的所有标签 */
  delLeftTags: (view: TagView) => Promise<TagView[]>
  /** 恢复持久化的 tags */
  loadPersistedViews: () => void
}

export const useTagsViewStore = create<TagsViewState>((set, get) => ({
  visitedViews: [],
  cachedViews: [],

  /**
   * 同时新增访问标签和缓存标签，是页面进入时最常用的统一入口。
   */
  addView(view: TagView) {
    get().addVisitedView(view)
    get().addCachedView(view)
  },

  /**
   * 新增普通访问标签，并在成功新增后刷新持久化数据。
   */
  addVisitedView(view: TagView) {
    if (get().visitedViews.some((v) => v.path === view.path)) return
    const item = Object.assign({}, view, {
      title: view.meta && view.meta.title ? view.meta.title : 'no-name'
    })
    set({ visitedViews: [...get().visitedViews, item] })
    saveVisitedViews(get().visitedViews)
  },

  /**
   * 新增固定标签（unshift 保持固定标签靠前展示）。
   */
  addAffixView(view: TagView) {
    if (get().visitedViews.some((v) => v.path === view.path)) return
    const item = Object.assign({}, view, {
      title: view.meta && view.meta.title ? view.meta.title : 'no-name'
    })
    set({ visitedViews: [item, ...get().visitedViews] })
  },

  /**
   * 新增缓存标签（页面声明了 name 时进入缓存列表）。
   */
  addCachedView(view: TagView) {
    if (typeof view.name !== 'string') return
    if (view.name === '') return
    if (get().cachedViews.includes(view.name)) return
    set({ cachedViews: [...get().cachedViews, view.name] })
  },

  /**
   * 删除单个标签的统一入口，同时删除访问记录与缓存记录。
   */
  delView(view: TagView) {
    return new Promise<ViewsResult>((resolve) => {
      get().delVisitedView(view)
      get().delCachedView(view)
      resolve({ visitedViews: [...get().visitedViews], cachedViews: [...get().cachedViews] })
    })
  },

  /**
   * 删除单个访问标签，同时刷新持久化缓存。
   */
  delVisitedView(view: TagView) {
    return new Promise<TagView[]>((resolve) => {
      const visitedViews = get().visitedViews.filter((v) => v.path !== view.path)
      set({ visitedViews })
      saveVisitedViews(visitedViews)
      resolve([...visitedViews])
    })
  },

  /**
   * 删除单个缓存标签。
   */
  delCachedView(view: TagView) {
    return new Promise<string[]>((resolve) => {
      const index = typeof view.name === 'string' ? get().cachedViews.indexOf(view.name) : -1
      const cachedViews = [...get().cachedViews]
      if (index > -1) {
        cachedViews.splice(index, 1)
        set({ cachedViews })
      }
      resolve([...cachedViews])
    })
  },

  /**
   * 删除当前标签之外的其他标签，是"关闭其他"操作的统一入口。
   */
  delOthersViews(view: TagView) {
    return new Promise<ViewsResult>((resolve) => {
      get().delOthersVisitedViews(view)
      get().delOthersCachedViews(view)
      resolve({ visitedViews: [...get().visitedViews], cachedViews: [...get().cachedViews] })
    })
  },

  /**
   * 删除其他访问标签，但保留固定标签和当前标签。
   */
  delOthersVisitedViews(view: TagView) {
    return new Promise<TagView[]>((resolve) => {
      const visitedViews = get().visitedViews.filter((v) => (v.meta && v.meta.affix) || v.path === view.path)
      set({ visitedViews })
      saveVisitedViews(visitedViews)
      resolve([...visitedViews])
    })
  },

  /**
   * 删除其他缓存标签，只保留当前页对应的缓存项。
   */
  delOthersCachedViews(view: TagView) {
    return new Promise<string[]>((resolve) => {
      const index = typeof view.name === 'string' ? get().cachedViews.indexOf(view.name) : -1
      let cachedViews: string[]
      if (index > -1) {
        cachedViews = get().cachedViews.slice(index, index + 1)
      } else {
        cachedViews = []
      }
      set({ cachedViews })
      resolve([...cachedViews])
    })
  },

  /**
   * 删除全部标签的统一入口。
   */
  delAllViews(view?: TagView) {
    return new Promise<ViewsResult>((resolve) => {
      get().delAllVisitedViews(view)
      get().delAllCachedViews(view)
      resolve({ visitedViews: [...get().visitedViews], cachedViews: [...get().cachedViews] })
    })
  },

  /**
   * 删除全部访问标签，但固定标签始终保留。
   */
  delAllVisitedViews(_view?: TagView) {
    return new Promise<TagView[]>((resolve) => {
      const affixTags = get().visitedViews.filter((tag) => tag.meta && tag.meta.affix)
      set({ visitedViews: affixTags })
      clearVisitedViewsData()
      resolve([...affixTags])
    })
  },

  /**
   * 删除全部缓存标签。
   */
  delAllCachedViews(_view?: TagView) {
    return new Promise<string[]>((resolve) => {
      set({ cachedViews: [] })
      resolve([])
    })
  },

  /**
   * 对外暴露的清理持久化缓存入口。
   */
  clearVisitedViews() {
    clearVisitedViewsData()
  },

  /**
   * 更新单个访问标签的最新信息。
   */
  updateVisitedView(view: TagView) {
    const visitedViews = get().visitedViews.map((v) => (v.path === view.path ? Object.assign({}, v, view) : v))
    set({ visitedViews })
  },

  /**
   * 删除当前标签右侧的所有标签。
   */
  delRightTags(view: TagView) {
    return new Promise<TagView[]>((resolve) => {
      const index = get().visitedViews.findIndex((v) => v.path === view.path)
      if (index === -1) return
      const kept: TagView[] = []
      const cachedViews = [...get().cachedViews]
      get().visitedViews.forEach((item, idx) => {
        if (idx <= index || (item.meta && item.meta.affix)) {
          kept.push(item)
        } else if (typeof item.name === 'string') {
          const i = cachedViews.indexOf(item.name)
          if (i > -1) {
            cachedViews.splice(i, 1)
          }
        }
      })
      set({ visitedViews: kept, cachedViews })
      saveVisitedViews(kept)
      resolve([...kept])
    })
  },

  /**
   * 删除当前标签左侧的所有标签。
   */
  delLeftTags(view: TagView) {
    return new Promise<TagView[]>((resolve) => {
      const index = get().visitedViews.findIndex((v) => v.path === view.path)
      if (index === -1) return
      const kept: TagView[] = []
      const cachedViews = [...get().cachedViews]
      get().visitedViews.forEach((item, idx) => {
        if (idx >= index || (item.meta && item.meta.affix)) {
          kept.push(item)
        } else if (typeof item.name === 'string') {
          const i = cachedViews.indexOf(item.name)
          if (i > -1) {
            cachedViews.splice(i, 1)
          }
        }
      })
      set({ visitedViews: kept, cachedViews })
      saveVisitedViews(kept)
      resolve([...kept])
    })
  },

  /**
   * 恢复持久化的 tags（逐条调用 addVisitedView 进行恢复）。
   */
  loadPersistedViews() {
    const views = loadVisitedViews()
    views.forEach((view) => {
      get().addVisitedView(view)
    })
  }
}))
