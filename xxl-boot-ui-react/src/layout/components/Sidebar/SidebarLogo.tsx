/**
 * 组件：SidebarLogo（侧边栏 Logo）
 * 功能：侧边栏顶部 Logo + 标题，展开/收起状态切换显示
 */
import { Link } from 'react-router-dom'
import logo from '@/assets/images/logo.png'
import { useSettingsStore } from '@/stores'
import variables from '@/assets/styles/variables'
import defaultSettings from '@/default-settings'
import './sidebar.scss'

interface SidebarLogoProps {
  /** 侧边栏是否折叠，折叠时只显示 Logo 图片，标题隐藏 */
  collapse: boolean
}

/**
 * 侧边栏 Logo
 */
export default function SidebarLogo({ collapse }: SidebarLogoProps) {
  const settingsStore = useSettingsStore()
  const title = defaultSettings.title

  /*
   * Logo 背景色：深色模式 / 顶部导航 / theme-dark / theme-light
   */
  const getLogoBackground = () => {
    if (settingsStore.isDark) {
      return 'var(--sidebar-bg)'
    }
    // 顶部导航模式下，侧边栏背景色固定为浅色
    if (settingsStore.navType === 3) {
      return variables.menuLightBg
    }
    return settingsStore.sideTheme === 'theme-dark' ? variables.menuBg : variables.menuLightBg
  }

  /*
   * Logo 文字色：深色模式 / 顶部导航 / theme-dark / theme-light
   */
  const getLogoTextColor = () => {
    if (settingsStore.isDark) {
      return 'var(--sidebar-logo-text)'
    }
    // 顶部导航模式下，侧边栏文字色固定为浅色
    if (settingsStore.navType === 3) {
      return variables.menuLightText
    }
    return settingsStore.sideTheme === 'theme-dark' ? '#fff' : variables.menuLightText
  }

  return (
    <div className={`sidebar-logo-container ${collapse ? 'collapse' : ''}`} style={{ background: getLogoBackground() }}>
      <Link to="/" className="sidebar-logo-link">
        {logo ? <img src={logo} className="sidebar-logo" alt="logo" /> : null}
        {!collapse && (
          <h1 className="sidebar-title" style={{ color: getLogoTextColor() }}>
            {title}
          </h1>
        )}
      </Link>
    </div>
  )
}
