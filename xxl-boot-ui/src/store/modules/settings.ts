/**
 * 名称：系统设置状态Store
 * 描述：系统全局设置状态管理，包括 菜单导航、标签页、主题色 ... 等
 *      - 管理系统的全局配置项，包括主题、布局、标签页等设置
 *      - 支持从本地存储恢复用户偏好设置
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
// 持久化存储数据：从 localStorage 读取已有配置（如果有）
const storageSetting = JSON.parse(localStorage.getItem(LAYOUT_SETTING_KEY) || '{}') || {}

/** 系统设置状态 */
interface SettingsState {
  /** 菜单标题 */
  menuTitle: string
  /** 暗黑模式-是否 */
  isDark: boolean
  version: string
  showSettings: boolean
  navType: number
  sideTheme: string
  theme: string
  tagsView: boolean
  tagsViewPersist: boolean
  tagsIcon: boolean
  tagsViewStyle: string
  fixedHeader: boolean
  sidebarLogo: boolean
  dynamicTitle: boolean
  footerVisible: boolean
  footerContent: string
}

const useSettingsStore = defineStore('settings', {
  /**
   * 状态定义
   *
   * 包含所有可配置的系统设置项，优先从 localStorage 读取用户自定义配置，
   * 如果不存在则使用默认配置
   */
  state: (): SettingsState => ({
    // 菜单标题
    menuTitle: '',
    // 暗黑模式-是否
    isDark: isDark.value,
    // 系统配置：
    version: defaultSettings.version,
    showSettings: defaultSettings.showSettings,
    navType: storageSetting.navType === undefined ? defaultSettings.navType : storageSetting.navType,
    sideTheme: storageSetting.sideTheme || defaultSettings.sideTheme,
    theme: storageSetting.theme || defaultSettings.theme,
    tagsView: storageSetting.tagsView === undefined ? defaultSettings.tagsView : storageSetting.tagsView,
    tagsViewPersist:
      storageSetting.tagsViewPersist === undefined ? defaultSettings.tagsViewPersist : storageSetting.tagsViewPersist,
    tagsIcon: storageSetting.tagsIcon === undefined ? defaultSettings.tagsIcon : storageSetting.tagsIcon,
    tagsViewStyle:
      storageSetting.tagsViewStyle === undefined ? defaultSettings.tagsViewStyle : storageSetting.tagsViewStyle,
    fixedHeader: storageSetting.fixedHeader === undefined ? defaultSettings.fixedHeader : storageSetting.fixedHeader,
    sidebarLogo: storageSetting.sidebarLogo === undefined ? defaultSettings.sidebarLogo : storageSetting.sidebarLogo,
    dynamicTitle:
      storageSetting.dynamicTitle === undefined ? defaultSettings.dynamicTitle : storageSetting.dynamicTitle,
    footerVisible:
      storageSetting.footerVisible === undefined ? defaultSettings.footerVisible : storageSetting.footerVisible,
    footerContent: defaultSettings.footerContent
  }),
  /**
   * 动作方法定义
   *
   * 提供修改系统设置的接口，包括布局配置、标题设置和主题切换
   */
  actions: {
    /**
     * 初始化：样式全局设置
     */
    initSetting() {
      // 异步变更：等待 DOM 更新
      nextTick(() => {
        // 主题样式设置
        handleThemeStyle(this.theme)
      })
    },
    /**
     * 持久化：将当前设置持久化到 localStorage
     */
    saveSetting() {
      const layoutSetting = {
        version: this.version,
        showSettings: this.showSettings,
        navType: this.navType,
        sideTheme: this.sideTheme,
        theme: this.theme,
        tagsView: this.tagsView,
        tagsViewPersist: this.tagsViewPersist,
        tagsIcon: this.tagsIcon,
        tagsViewStyle: this.tagsViewStyle,
        fixedHeader: this.fixedHeader,
        sidebarLogo: this.sidebarLogo,
        dynamicTitle: this.dynamicTitle,
        footerVisible: this.footerVisible,
        footerContent: this.footerContent
      }
      localStorage.setItem(LAYOUT_SETTING_KEY, JSON.stringify(layoutSetting))
    },
    /**
     * 重置：恢复默认设置，并清除 localStorage 中数据
     */
    resetSetting() {
      localStorage.removeItem(LAYOUT_SETTING_KEY)

      // 恢复到默认配置
      this.version = defaultSettings.version
      this.showSettings = defaultSettings.showSettings
      this.navType = defaultSettings.navType
      this.sideTheme = defaultSettings.sideTheme
      this.theme = defaultSettings.theme
      this.tagsView = defaultSettings.tagsView
      this.tagsViewPersist = defaultSettings.tagsViewPersist
      this.tagsIcon = defaultSettings.tagsIcon
      this.tagsViewStyle = defaultSettings.tagsViewStyle
      this.fixedHeader = defaultSettings.fixedHeader
      this.sidebarLogo = defaultSettings.sidebarLogo
      this.dynamicTitle = defaultSettings.dynamicTitle
      this.footerVisible = defaultSettings.footerVisible
      this.footerContent = defaultSettings.footerContent
    },
    /**
     * 切换：暗黑/明亮模式，重新应用主题样式以确保视觉效果正确更新
     */
    toggleTheme() {
      // 状态切换
      this.isDark = !this.isDark
      // 执行切换动作：包含修改DOM class操作
      toggleDark()
      // 异步变更：等待 DOM 更新
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
     * @param val - 导航栏类型
     */
    setNavType(val: number) {
      this.navType = val
    }
  }
})

export default useSettingsStore
