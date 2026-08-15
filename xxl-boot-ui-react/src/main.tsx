/**
 * 应用入口（Vite）
 * 能力：挂载 React、配置 antd 主题/国际化、TanStack Query、React Router、离线提示与错误边界
 */
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App as AntdApp, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { ErrorBoundary, OfflineBanner } from '@/components';
import { router } from './router';
import './assets/styles/global.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

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
        <OfflineBanner />
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary>
            <RouterProvider router={router} />
          </ErrorBoundary>
        </QueryClientProvider>
      </AntdApp>
    </ConfigProvider>,
  );
}
