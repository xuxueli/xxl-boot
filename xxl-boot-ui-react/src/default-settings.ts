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
   * 整体风格：light 亮色 / realDark 暗色
   */
  navTheme: 'light',

  /**
   * 主题色
   */
  colorPrimary: '#1677ff',

  /**
   * 导航模式：side 侧边 / top 顶部 / mix 混合
   */
  layout: 'mix',

  /**
   * 侧边菜单类型：sub 菜单 / group 分组
   */
  siderMenuType: 'sub',

  /**
   * 内容区宽度：Fluid 流式 / Fixed 固定
   */
  contentWidth: 'Fluid',

  /**
   * 固定 Header
   */
  fixedHeader: false,

  /**
   * 固定侧边菜单
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
   * 布局 token：用于自定义主题样式，详细配置参考：https://procomponents.ant.design/components/layout#%E5%9F%BA%E6%9C%AC%E4%BD%BF%E7%94%A8
   */
  token: {},
};

export default Settings;
