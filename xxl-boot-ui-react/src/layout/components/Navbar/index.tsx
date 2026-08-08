/**
 * 组件：Navbar（顶部导航栏）
 * 功能：根据 navType 切换不同导航模式（左侧菜单/混合菜单/顶部菜单），
 *        右侧渲染搜索、全屏、主题切换、布局尺寸、通知、用户菜单等操作项
 */
import { Link } from 'react-router-dom'
import { Dropdown } from 'antd'
import type { MenuProps } from 'antd'
import { Tooltip } from 'antd'
import SvgIcon from '@/components/SvgIcon'
import Hamburger from './Hamburger'
import Breadcrumb from './Breadcrumb'
import TopBarMix from './TopBarMix'
import TopBar from './TopBar'
import Screenfull from './Screenfull'
import SizeSelect from './SizeSelect'
import HeaderSearch from './HeaderSearch'
import HeaderMessage from './HeaderMessage'
import SidebarLogo from '../Sidebar/SidebarLogo'
import { useAppStore, useUserStore, useSettingsStore } from '@/stores'
import modal from '@/utils/modal'
import defaultSettings from '@/default-settings'
import './navbar.scss'

interface NavbarProps {
  /** 触发布局设置面板打开 */
  onSetLayout: () => void
}

/**
 * 顶部导航栏
 */
export default function Navbar({ onSetLayout }: NavbarProps) {
  const appStore = useAppStore()
  const userStore = useUserStore()
  const settingsStore = useSettingsStore()

  /*
   * 切换侧边栏展开/收起
   */
  const toggleSideBar = () => {
    appStore.toggleSideBar(false)
  }

  /*
   * 退出登录：二次确认后清除登录态并跳转首页
   */
  const logout = () => {
    modal
      .confirm('确定注销并退出系统吗？')
      .then(() => {
        userStore.logout().then(() => {
          location.href = defaultSettings.homePath
        })
      })
      .catch(() => {})
  }

  /*
   * 主题切换：浅色、暗色（View Transition 圆形扩散动画，降级直接切换）
   */
  const toggleTheme = async () => {
    const wasDark = settingsStore.isDark
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isSupported = typeof document.startViewTransition === 'function' && !isReducedMotion

    // fallback：降级到直接切换
    if (!isSupported) {
      settingsStore.toggleTheme()
      return
    }

    // animation：圆形扩散过渡动画
    try {
      const transition = document.startViewTransition!(async () => {
        await new Promise((resolve) => setTimeout(resolve, 10))
        settingsStore.toggleTheme()
      })
      await transition.ready

      const x = 0
      const y = 0
      const endRadius = Math.hypot(window.innerWidth, window.innerHeight)
      const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
      document.documentElement.animate(
        {
          clipPath: !wasDark ? [...clipPath].reverse() : clipPath
        },
        {
          duration: 650,
          easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
          fill: 'forwards',
          pseudoElement: !wasDark ? '::view-transition-old(root)' : '::view-transition-new(root)'
        }
      )
      await transition.finished
    } catch (error) {
      console.warn('View transition failed, falling back to immediate toggle:', error)
      settingsStore.toggleTheme()
    }
  }

  /*
   * 用户下拉菜单命令处理
   */
  const userMenuItems: MenuProps['items'] = [
    { key: 'profile', label: <Link to="/user/profile">个人中心</Link> },
    ...(settingsStore.showSettings ? [{ key: 'setLayout', label: <span>布局设置</span> }] : []),
    { key: 'logout', label: <span>退出登录</span> }
  ]

  const handleUserCommand: MenuProps['onClick'] = ({ key }) => {
    if (key === 'setLayout') {
      onSetLayout()
    } else if (key === 'logout') {
      logout()
    }
  }

  return (
    <div className={`navbar nav${settingsStore.navType}`}>
      {/* 侧边栏折叠按钮 */}
      <Hamburger isActive={appStore.sidebar.opened} className="hamburger-container" onToggleClick={toggleSideBar} />

      {/* 面包屑导航：左侧菜单模式-1 */}
      {settingsStore.navType === 1 && <Breadcrumb className="breadcrumb-container" />}

      {/* 顶部导航：混合模式-2 */}
      {settingsStore.navType === 2 && <div className="topmenu-container"><TopBarMix /></div>}

      {/* 顶部导航+Logo：顶部菜单模式-3 */}
      {settingsStore.navType === 3 && (
        <>
          {settingsStore.sidebarLogo && <SidebarLogo collapse={false} />}
          <div className="topbar-container"><TopBar /></div>
        </>
      )}

      {/* 右侧操作区 */}
      <div className="right-menu">
        {appStore.device !== 'mobile' && (
          <>
            {/* 搜索 */}
            <div className="right-menu-item"><HeaderSearch /></div>
            {/* 全屏 */}
            <div className="right-menu-item hover-effect"><Screenfull /></div>
            {/* 主题 */}
            <Tooltip title="主题模式" placement="bottom">
              <div className="right-menu-item hover-effect theme-switch-wrapper" onClick={toggleTheme}>
                {settingsStore.isDark ? <SvgIcon iconClass="sunny" /> : <SvgIcon iconClass="moon" />}
              </div>
            </Tooltip>
            {/* 布局尺寸 */}
            <Tooltip title="布局大小" placement="bottom">
              <div className="right-menu-item hover-effect"><SizeSelect /></div>
            </Tooltip>
            {/* 通知 */}
            <Tooltip title="消息通知" placement="bottom">
              <div className="right-menu-item hover-effect"><HeaderMessage /></div>
            </Tooltip>
          </>
        )}

        {/* 用户头像与下拉菜单 */}
        <Dropdown menu={{ items: userMenuItems, onClick: handleUserCommand }} trigger={['hover']} className="avatar-container right-menu-item hover-effect">
          <div className="avatar-wrapper">
            <span className="user-realName">{userStore.realName}</span>
          </div>
        </Dropdown>
      </div>
    </div>
  )
}
