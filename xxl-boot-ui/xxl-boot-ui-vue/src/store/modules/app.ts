/**
 * 名称：应用状态Store
 * 描述：用于管理全局状态，包括 侧边栏状态、字体大小 ... 等。
 *      - 侧边栏：opened（展开/折叠）、hide（隐藏）、withoutAnimation（无动画）；
 *      - mixScope：混合模式下当前激活的顶级菜单路径，用于侧边栏联动过滤；
 *      - 侧边栏联动：syncMixSidebar / setMixScopeForChildren（mix 模式菜单/目录联动）。
 */
import { defineStore } from 'pinia'
import { isLeafMenu, findActiveTopMenu, flattenChildrenRoutes } from '@/utils/menu'
import type { RouteData } from '@/store/modules/routes'

// 持久化存储Key：localStorage key constant
const SIDEBAR_STATUS_KEY = 'boot-layout-sidebar'
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
  /**
   * 混合布局模式下当前激活的顶级菜单路径，
   *  - 用于 Sidebar 联动过滤：只显示该顶级菜单下的子路由；
   *  - 空字符串表示不过滤，显示全部动态路由；
   *  - 由 TopBarMix 选中菜单时写入，Settings 切换布局时清除。
   */
  mixScope: string
  /** 设备状态（desktop/mobile） */
  device: string
  /** 字体大小 */
  size: string
}

const useAppStore = defineStore('app', {
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
    // mix 模式侧边栏联动作用域
    mixScope: '',
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
     * 设置 mix 模式下侧边栏联动过滤的顶级菜单路径
     *
     * @param path - 当前选中顶级菜单 path
     */
    setMixScope(path: string) {
      this.mixScope = path
    },
    /**
     * 清除 mix 作用域（切换导航模式等场景下调用）
     */
    clearMixScope() {
      this.mixScope = ''
    },
    /**
     * mix 模式路由联动：根据当前路径同步侧边栏显隐
     *   - hideList 路径 → 隐藏侧边栏；
     *   - 顶级菜单自身即菜单（叶节点）→ 折叠侧边栏；
     *   - 顶级菜单为目录 → 展开侧边栏展示下级菜单。
     *
     * @param routes   - 顶级路由树（dynamicRoutes）
     * @param path     - 当前路由路径
     * @param hideList - 强制隐藏侧边栏的路径列表
     */
    syncMixSidebar(routes: RouteData[], path: string, hideList: string[]) {
      if (hideList.indexOf(path) !== -1) {
        /* hideList 中的页面强制隐藏侧边栏（首页 / 个人中心） */
        this.hideSideBar(true)
        return
      }

      if (path !== undefined && path.lastIndexOf('/') > 0) {
        /* 多级路径：查找匹配的顶级菜单 */
        const matchedTopMenu = findActiveTopMenu(routes, path)
        if (matchedTopMenu) {
          if (isLeafMenu(matchedTopMenu)) {
            /* 顶级菜单自身即菜单：折叠左侧下级菜单 */
            this.hideSideBar(true)
          } else {
            /* 顶级菜单为目录：展开左侧菜单展示下级菜单 */
            this.hideSideBar(false)
          }
        } else {
          /* 未匹配到顶级菜单：显示侧边栏（容错） */
          this.hideSideBar(false)
        }
      } else {
        /* 根路径：隐藏侧边栏 */
        this.hideSideBar(true)
      }
    },
    /**
     * 根据顶级菜单 path 设置侧边栏联动作用域（存在子路由时写入 mixScope，否则隐藏侧栏）
     *
     * @param routes - 顶级路由树（dynamicRoutes）
     * @param key    - 当前选中顶级菜单 path
     */
    setMixScopeForChildren(routes: RouteData[], key: string) {
      const children = flattenChildrenRoutes(routes)

      /* 匹配条件：parentPath 等于 key */
      const hasChildren = children.some((item) => item.parentPath === key)
      if (hasChildren) {
        this.setMixScope(key)
      } else {
        this.hideSideBar(true)
      }
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
