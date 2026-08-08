/**
 * 名称：应用状态Store
 * 描述：用于管理全局状态，包括 侧边栏状态、字体大小 ... 等。
 */
import { create } from 'zustand'

// 持久化存储Key：localStorage key constant
const SIDEBAR_STATUS_KEY = 'boot-sidebar-status'
const FONTSIZE_KEY = 'boot-fontsize'

/** 侧边栏状态 */
interface SidebarState {
  /** 是否展开：0-折叠 1-展开 */
  opened: boolean
  /** 是否无切换动画：true-无动画 false-有动画 */
  withoutAnimation: boolean
  /** 是否隐藏：true-隐藏 false-显示 */
  hide: boolean
}

/** 应用状态 */
interface AppState {
  /** 侧边栏状态 */
  sidebar: SidebarState
  /** 设备状态（desktop/mobile） */
  device: string
  /** 字体大小 */
  size: string
  /** 侧边栏 - 切换状态 */
  toggleSideBar: (withoutAnimation: boolean) => false | void
  /** 侧边栏 - 折叠 */
  closeSideBar: (param: { withoutAnimation: boolean }) => void
  /** 侧边栏 - 展开 */
  openSideBar: (param: { withoutAnimation: boolean }) => void
  /** 侧边栏 - 隐藏/关闭 */
  hideSideBar: (status: boolean) => void
  /** 设备 - 切换状态 */
  toggleDevice: (device: string) => void
  /** 设置字体大小 */
  setSize: (size: string) => void
}

export const useAppStore = create<AppState>((set, get) => ({
  // 侧边栏状态
  sidebar: {
    // 是否展开：0-折叠 1-展开
    opened: localStorage.getItem(SIDEBAR_STATUS_KEY) ? localStorage.getItem(SIDEBAR_STATUS_KEY) === '1' : true,
    // 是否无切换动画：true-无动画 false-有动画
    withoutAnimation: false,
    // 是否隐藏：true-隐藏 false-显示
    hide: false
  },
  // 设备状态
  device: 'desktop',
  // 字体大小
  size: localStorage.getItem(FONTSIZE_KEY) || 'default',

  /**
   * 侧边栏 - 切换状态
   *
   * @param withoutAnimation   切换动画
   */
  toggleSideBar(withoutAnimation: boolean) {
    if (get().sidebar.hide) {
      return false
    }
    const opened = !get().sidebar.opened
    // 切换侧边栏状态
    set({ sidebar: { ...get().sidebar, opened, withoutAnimation } })
    // 设置侧边栏状态
    localStorage.setItem(SIDEBAR_STATUS_KEY, opened ? '1' : '0')
  },

  /**
   * 侧边栏 - 折叠
   *
   * @param withoutAnimation  设置是否无动画
   */
  closeSideBar({ withoutAnimation }: { withoutAnimation: boolean }) {
    // 取消隐藏
    if (get().sidebar.hide) {
      get().hideSideBar(false)
    }
    // 修改状态
    localStorage.setItem(SIDEBAR_STATUS_KEY, '0')
    set({ sidebar: { ...get().sidebar, opened: false, withoutAnimation } })
  },

  /**
   * 侧边栏 - 展开
   *
   * @param withoutAnimation  设置是否无动画
   */
  openSideBar({ withoutAnimation }: { withoutAnimation: boolean }) {
    // 取消隐藏
    if (get().sidebar.hide) {
      get().hideSideBar(false)
    }
    // 修改状态
    localStorage.setItem(SIDEBAR_STATUS_KEY, '1')
    set({ sidebar: { ...get().sidebar, opened: true, withoutAnimation } })
  },

  /**
   * 侧边栏 - 隐藏/关闭
   *
   * @param status  侧边栏隐藏状态
   */
  hideSideBar(status: boolean) {
    set({ sidebar: { ...get().sidebar, hide: status } })
  },

  /**
   * 设备 - 切换状态
   *
   * @param device  设备状态
   */
  toggleDevice(device: string) {
    set({ device })
  },

  /**
   * 设置字体大小
   *
   * @param size  字体大小
   */
  setSize(size: string) {
    set({ size })
    localStorage.setItem(FONTSIZE_KEY, size)
  }
}))
