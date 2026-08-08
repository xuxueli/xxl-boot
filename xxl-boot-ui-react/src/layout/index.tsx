/**
 * Layout：布局主框架
 * 功能：整体页面骨架，组合侧边栏/顶部导航/标签页/主内容区/设置面板，
 *        处理桌面端与移动端布局切换、侧边栏收展联动、主题变量注入
 */
import { useEffect, useRef, useState } from 'react'
import Navbar from './components/Navbar'
import TagsView from './components/TagsView'
import Settings, { type SettingsHandle } from './components/Settings'
import Sidebar from './components/Sidebar'
import AppMain from './components/AppMain'
import { useAppStore, useSettingsStore } from '@/stores'
import './layout.scss'

// 移动端断点（参考 Bootstrap 响应式设计）
const WIDTH = 992

/**
 * 布局主框架
 */
export default function Layout() {
  const settingsStore = useSettingsStore()
  const appStore = useAppStore()
  const theme = settingsStore.theme
  const sidebar = appStore.sidebar
  const device = appStore.device
  const needTagsView = settingsStore.tagsView
  const fixedHeader = settingsStore.fixedHeader

  // 设置面板 ref
  const settingRef = useRef<SettingsHandle>(null)

  /*
   * 布局 CSS 类名组合：侧栏收展状态 + 设备类型
   */
  const classObj = {
    hideSidebar: !sidebar.opened,
    openSidebar: sidebar.opened,
    withoutAnimation: sidebar.withoutAnimation,
    mobile: device === 'mobile'
  }

  /*
   * 窗口响应式：宽度 < 992 切换 mobile，无动画收起侧栏
   */
  useEffect(() => {
    const handleResize = (isFirst = false) => {
      const width = document.body.clientWidth
      if (isFirst) {
        if (width - 1 < WIDTH) {
          appStore.toggleDevice('mobile')
          appStore.closeSideBar({ withoutAnimation: true })
        }
        return
      }
      // 使用 ResizeObserver 或跨断点切换判断
    }
    handleResize(true)

    let previousWidth = document.body.clientWidth
    const observer = new ResizeObserver(() => {
      const newWidth = document.body.clientWidth
      if (newWidth - 1 < WIDTH && previousWidth >= WIDTH) {
        // 桌面 → 移动
        appStore.toggleDevice('mobile')
        appStore.closeSideBar({ withoutAnimation: true })
      } else if (newWidth - 1 >= WIDTH && previousWidth < WIDTH) {
        // 移动 → 桌面
        appStore.toggleDevice('desktop')
        appStore.openSideBar({ withoutAnimation: true })
      }
      previousWidth = newWidth
    })
    observer.observe(document.body)
    return () => {
      observer.disconnect()
    }
     
  }, [])

  /*
   * 设备切换：切换到 mobile 时收起侧栏
   */
  useEffect(() => {
    if (appStore.device === 'mobile' && sidebar.opened) {
      appStore.closeSideBar({ withoutAnimation: false })
    }
     
  }, [appStore.device])

  /*
   * 移动端遮罩点击 -> 关闭侧栏
   */
  const handleClickOutside = () => {
    appStore.closeSideBar({ withoutAnimation: false })
  }

  /*
   * 打开布局设置面板
   */
  const setLayout = () => {
    settingRef.current?.openSetting()
  }

  return (
    <div className={`app-wrapper ${classObj.hideSidebar ? 'hideSidebar' : ''} ${classObj.openSidebar ? 'openSidebar' : ''} ${classObj.withoutAnimation ? 'withoutAnimation' : ''} ${classObj.mobile ? 'mobile' : ''}`}
      style={{
        '--current-color': theme,
        '--current-color-light': theme + '1a',
        '--current-color-dark-bg': theme + '33'
      } as React.CSSProperties}
    >
      {/* 移动端遮罩：侧栏展开时显示，点击关闭侧栏 */}
      {device === 'mobile' && sidebar.opened && <div className="drawer-bg" onClick={handleClickOutside} />}

      {/* 侧边栏（左侧） */}
      {!sidebar.hide && (
        <div className="sidebar-container">
          <Sidebar />
        </div>
      )}

      {/* 主内容区（中间） */}
      <div className={`main-container ${needTagsView ? 'hasTagsView' : ''} ${sidebar.hide ? 'sidebarHide' : ''}`}>
        {/* 固定头部（含导航栏和标签页） */}
        <div className={fixedHeader ? 'fixed-header' : ''}>
          <Navbar onSetLayout={setLayout} />
          {needTagsView && <TagsView />}
        </div>

        {/* 路由页面出口 */}
        <AppMain />

        {/* 布局设置面板 */}
        <Settings ref={settingRef} />
      </div>
    </div>
  )
}
