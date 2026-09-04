/**
 * 应用入口（Vite）
 * 能力：挂载 React、配置 antd 主题/国际化、TanStack Query、React Router 与错误边界
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App as AntdApp, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import enUS from 'antd/locale/en_US';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ErrorBoundary } from '@/components';
import { LANG } from '@/i18n';
import { useSettingsStore } from '@/stores/settingsStore';
import AppRouter from './router/app/AppRouter';
import './assets/styles/global.css';

/**
 * TanStack Query 配置
 * 1. 默认不重试请求，避免请求失败后无限重试导致页面卡死
 * 2. 默认不在窗口聚焦时重新请求，避免切换窗口时重复请求
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * 应用主题容器
 * 功能：订阅全局设置（settingsStore）的 colorPrimary，动态注入 antd 主题 token；
 *      全局生效（登录页、布局、弹窗等所有 antd 组件），设置面板改色实时跟随
 */
const AppTheme = ({ children }: { children: React.ReactNode }) => {
  const colorPrimary = useSettingsStore((s) => s.settings.colorPrimary);
  return (
    <ConfigProvider
      locale={LANG === 'en' ? enUS : zhCN}
      theme={{
        token: {
          fontFamily: 'AlibabaSans, sans-serif',
          colorPrimary,
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};

/**
 * React 挂载入口
 * 1. AppTheme（ConfigProvider）：antd 国际化、动态主题配置（主题色全局生效）
 * 2. AntdApp：antd 全局配置
 * 3. QueryClientProvider：TanStack Query 配置
 * 4. ErrorBoundary：错误边界组件，捕获子组件渲染错误，避免整个应用崩溃
 * 5. BrowserRouter：React Router 顶层路由（HTML5 history 模式）
 * 6. AppRouter：菜单驱动动态路由
 */
const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <AppTheme>
      <AntdApp>
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary>
            <BrowserRouter>
              <AppRouter />
            </BrowserRouter>
          </ErrorBoundary>
        </QueryClientProvider>
      </AntdApp>
    </AppTheme>,
  );
}
