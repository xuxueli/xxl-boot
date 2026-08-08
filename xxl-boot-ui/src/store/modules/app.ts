/**
 * 名称：应用状态Store
 * 描述：用于管理全局状态，包括 侧边栏状态、字体大小 ... 等。
 */
import { defineStore } from 'pinia'

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
}

const useAppStore = defineStore(
  'app',
  {
    state: (): AppState => ({
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
      size: localStorage.getItem(FONTSIZE_KEY) || 'default'
    }),
    actions: {
      /**
       * 侧边栏 - 切换状态
       *
       * @param withoutAnimation   切换动画
       */
      toggleSideBar(withoutAnimation: boolean) {
        if (this.sidebar.hide) {
          return false
        }
        // 切换侧边栏状态
        this.sidebar.opened = !this.sidebar.opened
        // 设置是否无动画
        this.sidebar.withoutAnimation = withoutAnimation
        // 设置侧边栏状态
        if (this.sidebar.opened) {
          localStorage.setItem(SIDEBAR_STATUS_KEY, '1')
        } else {
          localStorage.setItem(SIDEBAR_STATUS_KEY, '0')
        }
      },
      /**
       * 侧边栏 - 折叠
       *
       * @param withoutAnimation  设置是否无动画
       */
      closeSideBar({ withoutAnimation }: { withoutAnimation: boolean }) {
        // 取消隐藏
        if (this.sidebar.hide) {
          this.hideSideBar(false);
        }

        // 修改状态
        localStorage.setItem(SIDEBAR_STATUS_KEY, '0')
        this.sidebar.opened = false
        this.sidebar.withoutAnimation = withoutAnimation
      },
      /**
       * 侧边栏 - 展开
       * @param withoutAnimation  设置是否无动画
       */
      openSideBar({ withoutAnimation }: { withoutAnimation: boolean }) {
        // 取消隐藏
        if (this.sidebar.hide) {
          this.hideSideBar(false);
        }

        // 修改状态
        localStorage.setItem(SIDEBAR_STATUS_KEY, '1')
        this.sidebar.opened = true
        this.sidebar.withoutAnimation = withoutAnimation
      },
      /**
       * 侧边栏 - 隐藏/关闭
       *
       * @param status  侧边栏隐藏状态
       */
      hideSideBar(status: boolean) {
        this.sidebar.hide = status
      },
      /**
       * 设备 - 切换状态
       *
       * @param device  设备状态
       */
      toggleDevice(device: string) {
        this.device = device
      },
      /**
       * 设置字体大小
       *
       * @param size  字体大小
       */
      setSize(size: string) {
        this.size = size
        localStorage.setItem(FONTSIZE_KEY, size)
      }
    }
  })

export default useAppStore
