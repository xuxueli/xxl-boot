/**
 * alive - react-activation 控制器桥接
 *
 * useAliveController 是 Hook，只能在组件内调用。
 * 本模块持有 drop/refresh 函数指针，供 utils/tab.ts 等非组件模块使用。
 * 由 AppMain 组件在渲染时注册。
 */
/** 销毁缓存节点 */
let dropFn: ((key: string) => void) | null = null
/** 刷新缓存节点（销毁并重建） */
let refreshFn: ((key: string) => void) | null = null

/**
 * 注册 alive 控制器（由 AppMain 调用）
 * @param drop 销毁缓存函数
 * @param refresh 刷新缓存函数
 */
export function setAliveController(drop: (key: string) => void, refresh: (key: string) => void): void {
  dropFn = drop
  refreshFn = refresh
}

/** alive 控制器桥接对象 */
export const alive = {
  /**
   * 销毁指定缓存节点（等价 keep-alive 移除缓存，下次进入重新挂载）
   * @param key 缓存 key（路由 path）
   */
  drop(key: string) {
    if (dropFn) {
      dropFn(key)
    }
  },
  /**
   * 刷新指定缓存节点（销毁并立即重建）
   * @param key 缓存 key（路由 path）
   */
  refresh(key: string) {
    if (refreshFn) {
      refreshFn(key)
    }
  }
}
