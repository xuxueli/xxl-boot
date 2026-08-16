/**
 * 系统默认设置（default-settings.ts）
 *    - 全局唯一默认值来源，分两类：
 *      1、静态常量：brandName、title、version、homePath、footerContent，系统级不可配置，使用方直接读取；
 *      2、可配置默认值：由 store/modules/settings.ts 读取，支持从 localStorage 覆盖与重置。
 */
export default {
  // ==================== 静态常量（系统级，不可配置） ====================

  /**
   * 品牌/产品名称
   */
  brandName: 'XXL-BOOT',

  /**
   * 网页标题
   */
  title: '快速开发平台',

  /**
   * 版本
   */
  version: '2.1.0-SNAPSHOT',

  /**
   * 首页路径
   */
  homePath: '/dashboard',

  /**
   * 底部版权文本内容
   */
  footerContent: `Copyright © 2015-${new Date().getFullYear()}`,

  // ==================== 可配置默认值（支持 localStorage 覆盖与重置） ====================

  /**
   * 布局配置：启用开关
   */
  showSettings: true,

  /**
   * 菜单导航模式
   *
   * side：纯左侧
   * mix：混合（左侧+顶部）
   * top：纯顶部
   */
  navType: 'side',

  /**
   * 侧边栏主题：
   *
   * 1、深色主题：theme-dark
   * 2、浅色主题：theme-light
   */
  sideTheme: 'theme-dark',

  /**
   * 主题颜色
   */
  theme: '#3c8dbc',

  /**
   * 页签/tagsView：是否启用
   */
  tagsView: true,

  /**
   * 持久化标签页：启用开关
   */
  tagsViewPersist: false,

  /**
   * 页签图标
   */
  tagsIcon: false,

  /**
   * 标签页样式：
   *
   * 1、卡片：card
   * 2、谷歌浏览器风格：chrome
   */
  tagsViewStyle: 'chrome',

  /**
   * 是否固定头部
   */
  fixedHeader: true,

  /**
   * 是否显示logo
   */
  sidebarLogo: true,

  /**
   * 是否显示动态标题
   */
  dynamicTitle: false,

  /**
   * 是否显示底部版权
   */
  footerVisible: false
}
