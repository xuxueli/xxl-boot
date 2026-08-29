/**
 * 全局类型声明：
 *    - tsconfig.json 的 include 的文件，会自动import
 *    - 覆盖项目内使用到但标准库/第三方库未提供的类型扩展
 */
export {}

declare global {
  /**
   * Math 扩展：scroll-to 使用的缓动函数
   * @param t 当前时间
   * @param b 起始值
   * @param c 变化量
   * @param d 总时长
   */
  interface Math {
    easeInOutQuad(t: number, b: number, c: number, d: number): number
  }

  /**
   * HTMLElement 扩展：v-copyText 指令挂载的自定义属性
   */
  interface HTMLElement {
    /** 待复制文本 */
    $copyValue?: string
    /** 复制完成回调 */
    $copyCallback?: (message: string) => void
    /** 销毁清理函数 */
    $destroyCopy?: () => void
  }

  /**
   * Document 扩展：Navbar 主题切换使用的 View Transition API
   */
  interface Document {
    startViewTransition?: (callback: () => void) => { ready: Promise<void>; finished: Promise<void> }
  }
}

/**
 * 路由 meta 类型扩展
 * 覆盖项目中路由 meta 的自定义字段（title/icon/activeMenu/affix/hidden/query）
 */
declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    icon?: string
    activeMenu?: string
    affix?: boolean
    hidden?: boolean
    query?: Record<string, string>
  }
}
