/**
 * 名称：系统设置状态Store
 * 描述：系统全局设置状态管理，包括 菜单导航、标签页、主题色 ... 等
 *      - 管理系统的全局配置项，包括主题、布局、标签页等设置
 *      - 支持从本地存储恢复用户偏好设置
 *      - 提供暗黑模式切换和动态标题更新功能
 */
import { create } from 'zustand'
import defaultSettings from '@/default-settings'
import { handleThemeStyle } from '@/utils/theme'

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
  /** 初始化：样式全局设置 */
  initSetting: () => void
  /** 持久化：将当前设置持久化到 localStorage */
  saveSetting: () => void
  /** 重置：恢复默认设置，并清除 localStorage 中数据 */
  resetSetting: () => void
  /** 切换：暗黑/明亮模式，重新应用主题样式以确保视觉效果正确更新 */
  toggleTheme: () => void
  /** 设置：侧边主题（ 'theme-dark'/'theme-light'），集中处理更新逻辑 */
  setSideTheme: (val: string) => void
  /** 设置：主题色 */
  setTheme: (themeVal: string) => void
  /** 设置：标签页持久化选项，并在关闭持久化时清理标签页缓存 */
  setTagsViewPersist: (val: boolean) => void
  /** 设置：动态标题开关 */
  setDynamicTitle: (val: boolean) => void
  /** 设置：网页标题，支持动态标题 */
  setMenuTitle: (menuTitle: string) => void
  /** 设置：导航栏类型 */
  setNavType: (val: number) => void
}

/**
 * 读取是否暗黑模式：从 html 根节点 class 中判断（初始由系统偏好决定）
 */
function detectDark(): boolean {
  return (
    typeof document !== 'undefined' && document.documentElement.classList.contains('dark')
  )
}

/** 设置暗黑模式 class */
function applyDarkClass(isDark: boolean): void {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  if (isDark) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

// 初始化暗黑模式：跟随系统（若浏览器不支持 prefers-color-scheme，则默认亮色）
const systemDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches

// 初始暗黑状态：优先持久化配置，其次跟随系统
const initDark = typeof storageSetting.isDark === 'boolean' ? storageSetting.isDark : systemDark
applyDarkClass(initDark)

export const useSettingsStore = create<SettingsState>((set, get) => ({
  // 菜单标题
  menuTitle: '',
  // 暗黑模式-是否
  isDark: initDark,
  // 系统配置：
  version: defaultSettings.version,
  showSettings: defaultSettings.showSettings,
  navType: storageSetting.navType === undefined ? defaultSettings.navType : storageSetting.navType,
  sideTheme: storageSetting.sideTheme || defaultSettings.sideTheme,
  theme: storageSetting.theme || defaultSettings.theme,
  tagsView: storageSetting.tagsView === undefined ? defaultSettings.tagsView : storageSetting.tagsView,
  tagsViewPersist: storageSetting.tagsViewPersist === undefined ? defaultSettings.tagsViewPersist : storageSetting.tagsViewPersist,
  tagsIcon: storageSetting.tagsIcon === undefined ? defaultSettings.tagsIcon : storageSetting.tagsIcon,
  tagsViewStyle: storageSetting.tagsViewStyle === undefined ? defaultSettings.tagsViewStyle : storageSetting.tagsViewStyle,
  fixedHeader: storageSetting.fixedHeader === undefined ? defaultSettings.fixedHeader : storageSetting.fixedHeader,
  sidebarLogo: storageSetting.sidebarLogo === undefined ? defaultSettings.sidebarLogo : storageSetting.sidebarLogo,
  dynamicTitle: storageSetting.dynamicTitle === undefined ? defaultSettings.dynamicTitle : storageSetting.dynamicTitle,
  footerVisible: storageSetting.footerVisible === undefined ? defaultSettings.footerVisible : storageSetting.footerVisible,
  footerContent: defaultSettings.footerContent,

  /**
   * 初始化：样式全局设置
   */
  initSetting() {
    // 异步变更：等待 DOM 更新
    requestAnimationFrame(() => {
      // 主题样式设置
      handleThemeStyle(get().theme)
    })
  },

  /**
   * 持久化：将当前设置持久化到 localStorage
   */
  saveSetting() {
    const state = get()
    const layoutSetting = {
      version: state.version,
      showSettings: state.showSettings,
      navType: state.navType,
      sideTheme: state.sideTheme,
      theme: state.theme,
      tagsView: state.tagsView,
      tagsViewPersist: state.tagsViewPersist,
      tagsIcon: state.tagsIcon,
      tagsViewStyle: state.tagsViewStyle,
      fixedHeader: state.fixedHeader,
      sidebarLogo: state.sidebarLogo,
      dynamicTitle: state.dynamicTitle,
      footerVisible: state.footerVisible,
      footerContent: state.footerContent,
      isDark: state.isDark
    }
    localStorage.setItem(LAYOUT_SETTING_KEY, JSON.stringify(layoutSetting))
  },

  /**
   * 重置：恢复默认设置，并清除 localStorage 中数据
   */
  resetSetting() {
    localStorage.removeItem(LAYOUT_SETTING_KEY)
    // 恢复到默认配置
    set({
      version: defaultSettings.version,
      showSettings: defaultSettings.showSettings,
      navType: defaultSettings.navType,
      sideTheme: defaultSettings.sideTheme,
      theme: defaultSettings.theme,
      tagsView: defaultSettings.tagsView,
      tagsViewPersist: defaultSettings.tagsViewPersist,
      tagsIcon: defaultSettings.tagsIcon,
      tagsViewStyle: defaultSettings.tagsViewStyle,
      fixedHeader: defaultSettings.fixedHeader,
      sidebarLogo: defaultSettings.sidebarLogo,
      dynamicTitle: defaultSettings.dynamicTitle,
      footerVisible: defaultSettings.footerVisible,
      footerContent: defaultSettings.footerContent
    })
  },

  /**
   * 切换：暗黑/明亮模式，重新应用主题样式以确保视觉效果正确更新
   */
  toggleTheme() {
    const isDark = !get().isDark
    // 状态切换
    set({ isDark })
    // 执行切换动作：包含修改DOM class操作
    applyDarkClass(isDark)
    // 异步变更：等待 DOM 更新
    requestAnimationFrame(() => {
      // 主题样式设置
      handleThemeStyle(get().theme)
    })
  },

  /**
   * 设置：侧边主题（ 'theme-dark'/'theme-light'），集中处理更新逻辑
   */
  setSideTheme(val: string) {
    set({ sideTheme: val })
  },

  /**
   * 设置：主题色
   */
  setTheme(themeVal: string) {
    set({ theme: themeVal })
    // 联动变更：立即应用主题样式
    requestAnimationFrame(() => {
      handleThemeStyle(get().theme)
    })
  },

  /**
   * 设置：标签页持久化选项，并在关闭持久化时清理标签页缓存
   */
  setTagsViewPersist(val: boolean) {
    set({ tagsViewPersist: val })
  },

  /**
   * 设置：动态标题开关
   */
  setDynamicTitle(val: boolean) {
    set({ dynamicTitle: val })
    // 联动变更：网页标题 刷新
    get().setMenuTitle(get().menuTitle)
  },

  /**
   * 设置：网页标题，支持动态标题
   *
   * @param menuTitle - 菜单标题
   */
  setMenuTitle(menuTitle: string) {
    set({ menuTitle })
    // 联动变更：修改 document.title
    if (get().dynamicTitle) {
      document.title = menuTitle + ' - ' + defaultSettings.title
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
    set({ navType: val })
  }
}))
