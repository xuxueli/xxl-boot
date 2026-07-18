/**
 * Description: 系统设置
 */
export default {

  /**
   * 网页标题
   */
  title: 'Boot管理系统',

  /**
   * 布局配置：启用开关
   */
  showSettings: true,

  /**
   * 菜单导航模式
   *
   * 1、纯左侧
   * 2、混合（左侧+顶部）
   * 3、纯顶部
   */
  navType: 1,

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
  theme: '#409EFF',

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
  footerVisible: false,

  /**
   * 底部版权文本内容
   */
  footerContent: 'Copyright © 2015-' + new Date().getFullYear() + ' Boot. All Rights Reserved.'
}
