/**
 * 名称：系统设置状态Store
 * 描述：系统全局设置状态管理，包括 菜单导航、标签页、主题色 ... 等
 *      - 可配置项（可持久化、可重置）统一收敛在本 Store，初始化/持久化/重置共用字段清单
 *      - 静态常量（品牌/标题/版本/首页路径/版权文案）直接取 default-settings，不在 Store 中重复存储
 *      - 提供暗黑模式切换和动态标题更新功能
 */
import { defineStore } from 'pinia'
import { nextTick } from 'vue'
import defaultSettings from '@/default-settings'
import { useDark, useToggle } from '@vueuse/core'
import { handleThemeStyle } from '@/utils/theme'

// 初始化暗黑模式：跟随系统
const isDark = useDark()
// 切换暗黑模式：联动更新
const toggleDark = useToggle(isDark)

// 持久化存储Key：localStorage key constant （部署设置）
const LAYOUT_SETTING_KEY = 'boot-layout-setting'

/** 系统设置状态 */
interface SettingsState {
  /** 菜单标题 */
  menuTitle: string
  /** 暗黑模式-是否 */
  isDark: boolean
  /** 布局配置：启用开关 */
  showSettings: boolean
  /** 菜单导航模式：side=左侧、mix=混合、top=顶部 */
  navType: string
  /** 侧边栏主题：theme-dark / theme-light */
  sideTheme: string
  /** 主题颜色 */
  theme: string
  /** 页签/tagsView：是否启用 */
  tagsView: boolean
  /** 持久化标签页：启用开关 */
  tagsViewPersist: boolean
  /** 页签图标 */
  tagsIcon: boolean
  /** 标签页样式：card / chrome */
  tagsViewStyle: string
  /** 是否固定头部 */
  fixedHeader: boolean
  /** 是否显示logo */
  sidebarLogo: boolean
  /** 是否显示动态标题 */
  dynamicTitle: boolean
  /** 是否显示底部版权 */
  footerVisible: boolean
}

/**
 * 可配置项字段清单：状态初始化、持久化、重置 三处共用
 */
const CONFIGURABLE_KEYS = [
  'showSettings',
  'navType',
  'sideTheme',
  'theme',
  'tagsView',
  'tagsViewPersist',
  'tagsIcon',
  'tagsViewStyle',
  'fixedHeader',
  'sidebarLogo',
  'dynamicTitle',
  'footerVisible'
] as const

type ConfigurableKey = (typeof CONFIGURABLE_KEYS)[number]
type ConfigurableState = Pick<SettingsState, ConfigurableKey>

/**
 * 从数据源中提取可配置项
 */
function pickConfigurable(source: object): ConfigurableState {
  const raw = source as Record<string, unknown>
  return Object.fromEntries(CONFIGURABLE_KEYS.map((key) => [key, raw[key]])) as ConfigurableState
}

// 持久化存储数据：从 localStorage 读取已有配置（如果有）
const storageSetting = (JSON.parse(localStorage.getItem(LAYOUT_SETTING_KEY) || '{}') || {}) as Record<string, unknown>

const useSettingsStore = defineStore('settings', {
  /**
   * 状态定义：用户已保存配置优先，否则使用默认配置
   */
  state: (): SettingsState => ({
    // 菜单标题
    menuTitle: '',
    // 暗黑模式-是否
    isDark: isDark.value,
    // 系统配置：用户已保存配置优先，否则使用默认配置
    ...pickConfigurable({ ...defaultSettings, ...storageSetting })
  }),
  /**
   * 动作方法定义
   *
   * 提供修改系统设置的接口，包括布局配置、标题设置和主题切换
   */
  actions: {
    /**
     * 初始化：应用主题样式
     */
    initSetting() {
      nextTick(() => {
        handleThemeStyle(this.theme)
      })
    },
    /**
     * 持久化：将当前可配置项持久化到 localStorage
     */
    saveSetting() {
      localStorage.setItem(LAYOUT_SETTING_KEY, JSON.stringify(pickConfigurable(this)))
    },
    /**
     * 重置：恢复默认配置，并清除 localStorage 中数据
     */
    resetSetting() {
      localStorage.removeItem(LAYOUT_SETTING_KEY)

      // 恢复到默认配置（$patch：合并状态变更）
      this.$patch(pickConfigurable(defaultSettings))
    },
    /**
     * 切换：暗黑/明亮模式，重新应用主题样式以确保视觉效果正确更新
     */
    toggleTheme() {
      // 状态切换
      this.isDark = !this.isDark
      // 执行切换动作：包含修改DOM class操作
      toggleDark()
      // 异步变更：等待 DOM 更新，重新应用主题样式
      nextTick(() => {
        // 主题样式设置
        handleThemeStyle(this.theme)
      })
    },
    /**
     * 设置：侧边主题（ 'theme-dark'/'theme-light'），集中处理更新逻辑
     */
    setSideTheme(val: string) {
      this.sideTheme = val
    },
    /**
     * 设置：主题色
     */
    setTheme(themeVal: string) {
      this.theme = themeVal

      // 联动变更：立即应用主题样式
      nextTick(() => {
        handleThemeStyle(this.theme)
      })
    },
    /**
     * 设置：标签页持久化选项，并在关闭持久化时清理标签页缓存
     */
    setTagsViewPersist(val: boolean) {
      this.tagsViewPersist = val
    },
    /**
     * 设置：动态标题开关
     */
    setDynamicTitle(val: boolean) {
      this.dynamicTitle = val

      // 联动变更：网页标题 刷新
      this.setMenuTitle(this.menuTitle)
    },
    /**
     * 设置：网页标题，支持动态标题
     *
     * @param menuTitle - 菜单标题
     */
    setMenuTitle(menuTitle: string) {
      this.menuTitle = menuTitle

      // 联动变更：修改 document.title
      if (this.dynamicTitle) {
        document.title = this.menuTitle + ' - ' + defaultSettings.title
      } else {
        document.title = defaultSettings.title
      }
    },
    /**
     * 设置：导航栏类型
     *
     * @param val - 导航栏类型（side / mix / top）
     */
    setNavType(val: string) {
      this.navType = val
    }
  }
})

export default useSettingsStore
