/**
 * 应用入口（Vite）
 * 能力：挂载 React、配置 antd 主题/国际化、TanStack Query、React Router 与错误边界
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App as AntdApp, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ErrorBoundary } from '@/components';
import { router } from './router';
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
 * React 挂载入口
 * 1. ConfigProvider：antd 国际化、主题配置
 * 2. AntdApp：antd 全局配置
 * 3. QueryClientProvider：TanStack Query 配置
 * 4. ErrorBoundary：错误边界组件，捕获子组件渲染错误，避免整个应用崩溃
 * 5. RouterProvider：React Router 配置
 */
const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          fontFamily: 'AlibabaSans, sans-serif',
        },
      }}
    >
      <AntdApp>
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary>
            <RouterProvider router={router} />
          </ErrorBoundary>
        </QueryClientProvider>
      </AntdApp>
    </ConfigProvider>,
  );
}
