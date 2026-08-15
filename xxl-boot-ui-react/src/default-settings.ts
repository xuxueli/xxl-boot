import type { ProLayoutProps } from '@ant-design/pro-components';

/**
 * 系统默认设置（default-settings.ts）
 *    - 提供系统标题、品牌、版本、首页路径等全局默认配置，以及 ProLayout 布局默认配置；
 *    - 由 stores/settingsStore.ts 读取，供登录页、帮助页、主布局等消费；
 *
 * @author xuxueli 2026-08-15
 */
const Settings: ProLayoutProps & {
  // 扩展属性
  brandName?: string;
  homePath?: string;
  version?: string;
} = {
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
   * 导航主题：light 亮色 / dark 暗色
   */
  navTheme: 'light',

  /**
   * 主题色
   */
  colorPrimary: '#1677ff',

  /**
   * 布局模式：side 侧边 / top 顶部 / mix 混合
   */
  layout: 'mix',

  /**
   * 内容区宽度：Fluid 流式 / Fixed 固定
   */
  contentWidth: 'Fluid',

  /**
   * 是否固定头部
   */
  fixedHeader: false,

  /**
   * 是否固定侧边栏
   */
  fixSiderbar: true,

  /**
   * 色弱模式
   */
  colorWeak: false,

  /**
   * 系统 Logo
   */
  logo: '/logo.png',

  /**
   * 图标字体库地址
   */
  iconfontUrl: '',

  /**
   * 布局 token（参见 ProLayout 文档，通过 token 修改样式）
   */
  token: {},
};

export default Settings;
