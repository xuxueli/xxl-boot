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
   * Document 扩展：Navbar 主题切换使用的 View Transition API
   */
  interface Document {
    startViewTransition?: (callback: () => void) => { ready: Promise<void>; finished: Promise<void> }
  }
}
