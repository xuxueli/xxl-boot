/**
 * 根组件（App.tsx）
 *
 * 职责：
 *   1. 全局 antd ConfigProvider：中文化 + 主题算法（亮/暗）+ 主题色；
 *   2. 挂载 antd App 容器（提供 message/notification/Modal 上下文）；
 *   3. 挂载 AliveScope（react-activation 缓存作用域）；
 *   4. 渲染路由（AppRouter）。
 */
import { useEffect } from 'react'
import { App as AntdApp, ConfigProvider, theme as antdTheme } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import { AliveScope } from 'react-activation'
import AppRouter from '@/router'
import { useSettingsStore } from '@/stores'

export default function App() {
  const settingsStore = useSettingsStore()

  // 初始化：应用主题样式（主题色 CSS 变量注入）
  useEffect(() => {
    settingsStore.initSetting()
     
  }, [])

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: settingsStore.isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
        token: {
          colorPrimary: settingsStore.theme
        }
      }}
    >
      <AntdApp>
        <AliveScope>
          <AppRouter />
        </AliveScope>
      </AntdApp>
    </ConfigProvider>
  )
}
