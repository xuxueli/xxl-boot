/**
 * 组件：Settings（布局设置抽屉）
 * 功能：菜单导航模式、主题风格、页签配置、固定 Header、Logo 显隐、动态标题、底部版权等布局偏好设置
 */
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { Button, ColorPicker, Drawer, Radio, Switch } from 'antd'
import { CheckOutlined } from '@ant-design/icons'
import { useAppStore, useRoutesStore, useSettingsStore, useTagsViewStore } from '@/stores'
import modal from '@/utils/modal'
import darkImg from '@/assets/images/dark.svg'
import lightImg from '@/assets/images/light.svg'
import './settings.scss'

export interface SettingsHandle {
  /** 打开布局设置 */
  openSetting: () => void
}

/** 主题色预设颜色 */
const predefineColors = [
  '#409EFF',
  '#3c8dbc',
  '#8B5CF6',
  '#00838F',
  '#14B8A6',
  '#22C55E',
  '#F59E0B',
  '#F97316',
  '#EF4444',
  '#EC4899'
]

/**
 * 布局设置抽屉
 */
const Settings = forwardRef<SettingsHandle>(function Settings(_, ref) {
  const appStore = useAppStore()
  const settingsStore = useSettingsStore()
  const tagsViewStore = useTagsViewStore()
  const routesStore = useRoutesStore()

  // 抽屉显隐
  const [showSettings, setShowSettings] = useState(false)

  /*
   * 页面初始化：顶部导航时，隐藏侧边栏
   */
  useEffect(() => {
    if (settingsStore.navType === 3) {
      appStore.hideSideBar(true)
    }
     
  }, [])

  /*
   * 侧边主题样式-切换
   */
  const handleTheme = (val: string) => {
    settingsStore.setSideTheme(val)
  }

  /*
   * 菜单导航-切换监听
   */
  const handleNavType = (type: number) => {
    settingsStore.setNavType(type)
    // 菜单导航-级联变更：type: 1 = 左侧, 2 = 混合, 3 = 顶部
    if (type === 1 || type === 2) {
      appStore.openSideBar({ withoutAnimation: true })
    } else if (type === 3) {
      appStore.hideSideBar(true)
    }
    // 只有左侧/顶部需要设置侧边栏路由
    if ([1, 3].includes(type)) {
      routesStore.setScope('')
    }
  }

  /*
   * 标签页持久化：关闭时清除已保存标签
   */
  const handleTagsViewPersist = (val: boolean) => {
    settingsStore.setTagsViewPersist(val)
    // 联动变更：若不保存标签页，主动清除标签页缓存
    if (!val) {
      tagsViewStore.clearVisitedViews()
    }
  }

  /*
   * 保存设置到 localStorage
   */
  const saveSetting = () => {
    modal.loading('正在保存到本地，请稍候...')
    // 若不保存标签页，主动清除标签页缓存
    if (!settingsStore.tagsViewPersist) {
      tagsViewStore.clearVisitedViews()
    }
    // Setting设置：持久化
    settingsStore.saveSetting()
    // 弹框提示：关闭
    setTimeout(function () {
      modal.closeLoading()
      setShowSettings(false)
    }, 500)
  }

  /*
   * 重置设置：清除缓存并刷新页面
   */
  const resetSetting = () => {
    // 主动清除标签页缓存
    tagsViewStore.clearVisitedViews()
    // 弹框提示：Loading
    modal.loading('正在清除设置缓存并刷新，请稍候...')
    // Setting设置：持久化
    settingsStore.resetSetting()
    // 弹框提示：刷新
    setTimeout(() => window.location.reload(), 500)
  }

  /**
   * 打开布局设置
   */
  const openSetting = () => {
    setShowSettings(true)
  }

  // 暴露方法
  useImperativeHandle(ref, () => ({
    openSetting
  }))

  return (
    <Drawer open={showSettings} onClose={() => setShowSettings(false)} width={300} closable={false}>
      {/* 菜单导航设置 */}
      <div className="setting-drawer-title">
        <h3 className="drawer-title">菜单导航设置</h3>
      </div>
      <div className="nav-wrap">
        <div className={`item left ${settingsStore.navType === 1 ? 'activeItem' : ''}`} onClick={() => handleNavType(1)}>
          <b></b>
          <b></b>
        </div>
        <div className={`item mix ${settingsStore.navType === 2 ? 'activeItem' : ''}`} onClick={() => handleNavType(2)}>
          <b></b>
          <b></b>
        </div>
        <div className={`item top ${settingsStore.navType === 3 ? 'activeItem' : ''}`} onClick={() => handleNavType(3)}>
          <b></b>
        </div>
      </div>

      {/* 主题风格设置 */}
      <div className="setting-drawer-title">
        <h3 className="drawer-title">主题风格设置</h3>
      </div>
      <div className="setting-drawer-block-checbox">
        <div className="setting-drawer-block-checbox-item" onClick={() => handleTheme('theme-dark')}>
          <img src={darkImg} alt="dark" />
          {settingsStore.sideTheme === 'theme-dark' && (
            <div className="setting-drawer-block-checbox-selectIcon">
              <CheckOutlined />
            </div>
          )}
        </div>
        <div className="setting-drawer-block-checbox-item" onClick={() => handleTheme('theme-light')}>
          <img src={lightImg} alt="light" />
          {settingsStore.sideTheme === 'theme-light' && (
            <div className="setting-drawer-block-checbox-selectIcon">
              <CheckOutlined />
            </div>
          )}
        </div>
      </div>
      <div className="drawer-item">
        <span>主题颜色</span>
        <span className="comp-style">
          <ColorPicker
            value={settingsStore.theme}
            presets={[{ label: '预设', colors: predefineColors }]}
            onChange={(color) => settingsStore.setTheme(color.toHexString())}
          />
        </span>
      </div>
      <div style={{ borderBottom: '1px solid #f0f0f0' }} />

      {/* 系统布局配置 */}
      <h3 className="drawer-title" style={{ marginTop: 16 }}>
        系统布局配置
      </h3>

      <div className="drawer-item">
        <span>开启页签</span>
        <span className="comp-style">
          <Switch size="small" checked={settingsStore.tagsView} onChange={(val) => useSettingsStore.setState({ tagsView: val })} />
        </span>
      </div>

      <div className="drawer-item">
        <span>持久化标签页</span>
        <span className="comp-style">
          <Switch
            size="small"
            disabled={!settingsStore.tagsView}
            checked={settingsStore.tagsViewPersist}
            onChange={handleTagsViewPersist}
          />
        </span>
      </div>

      <div className="drawer-item">
        <span>显示页签图标</span>
        <span className="comp-style">
          <Switch
            size="small"
            disabled={!settingsStore.tagsView}
            checked={settingsStore.tagsIcon}
            onChange={(val) => useSettingsStore.setState({ tagsIcon: val })}
          />
        </span>
      </div>

      <div className="drawer-item">
        <span>标签页样式</span>
        <span className="comp-style">
          <Radio.Group
            size="small"
            disabled={!settingsStore.tagsView}
            value={settingsStore.tagsViewStyle}
            onChange={(e) => useSettingsStore.setState({ tagsViewStyle: e.target.value })}
          >
            <Radio.Button value="card">卡片</Radio.Button>
            <Radio.Button value="chrome">谷歌</Radio.Button>
          </Radio.Group>
        </span>
      </div>

      <div className="drawer-item">
        <span>固定 Header</span>
        <span className="comp-style">
          <Switch size="small" checked={settingsStore.fixedHeader} onChange={(val) => useSettingsStore.setState({ fixedHeader: val })} />
        </span>
      </div>

      <div className="drawer-item">
        <span>显示 Logo</span>
        <span className="comp-style">
          <Switch size="small" checked={settingsStore.sidebarLogo} onChange={(val) => useSettingsStore.setState({ sidebarLogo: val })} />
        </span>
      </div>

      <div className="drawer-item">
        <span>动态标题</span>
        <span className="comp-style">
          <Switch size="small" checked={settingsStore.dynamicTitle} onChange={(val) => settingsStore.setDynamicTitle(val)} />
        </span>
      </div>

      <div className="drawer-item">
        <span>底部版权</span>
        <span className="comp-style">
          <Switch size="small" checked={settingsStore.footerVisible} onChange={(val) => useSettingsStore.setState({ footerVisible: val })} />
        </span>
      </div>

      <div style={{ borderBottom: '1px solid #f0f0f0', margin: '12px 0' }} />

      <Button type="primary" onClick={saveSetting} style={{ marginRight: 8 }}>
        保存配置
      </Button>
      <Button onClick={resetSetting}>重置配置</Button>
    </Drawer>
  )
})

Settings.displayName = 'Settings'
export default Settings
