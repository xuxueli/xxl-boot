/**
 * 路由配置（React Router）
 * 说明：
 *   - 静态路由（/login、/301、404 兜底）路径与 Vue 项目对齐，无布局；
 *   - 其余业务路由在 AppLayout 布局内
 *   - RequireAuth 登录守卫；RequirePermission 页面级权限守卫
 */
import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import Loading from '@/components/Loading';
import AppLayout from '@/layouts/AppLayout';
import RequireAuth from './guards/RequireAuth';
import RequirePermission from './guards/RequirePermission';

/** 懒加载页面组件（带 Loading 兜底） */
const lazyLoad = (factory: () => Promise<{ default: React.ComponentType }>) => {
  const Component = lazy(factory);
  return (
    <Suspense fallback={<Loading />}>
      <Component />
    </Suspense>
  );
};

export const router = createBrowserRouter([
  {
    path: '/login',
    element: lazyLoad(() => import('@/pages/login')),
  },
  {
    path: '/301',
    element: lazyLoad(() => import('@/pages/common/301')),
  },
  {
    path: '*',
    element: lazyLoad(() => import('@/pages/common/404')),
  },
  {
    path: '/',
    element: (
      <RequireAuth>
        <AppLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      {
        path: 'user/profile',
        element: lazyLoad(() => import('@/pages/authz/user/profile')),
      },
      { path: 'dashboard', element: lazyLoad(() => import('@/pages/dashboard')) },
      {
        path: 'authz/user',
        element: (
          <RequirePermission permission="authz:user">
            {lazyLoad(() => import('@/pages/authz/user'))}
          </RequirePermission>
        ),
      },
      {
        path: 'authz/role',
        element: (
          <RequirePermission permission="authz:role">
            {lazyLoad(() => import('@/pages/authz/role'))}
          </RequirePermission>
        ),
      },
      {
        path: 'authz/resource',
        element: (
          <RequirePermission permission="authz:resource">
            {lazyLoad(() => import('@/pages/authz/resource'))}
          </RequirePermission>
        ),
      },
      {
        path: 'authz/org',
        element: (
          <RequirePermission permission="authz:org">
            {lazyLoad(() => import('@/pages/authz/org'))}
          </RequirePermission>
        ),
      },
      {
        path: 'system/dict',
        element: (
          <RequirePermission permission="system:dict">
            {lazyLoad(() => import('@/pages/system/dict'))}
          </RequirePermission>
        ),
      },
      {
        path: 'system/dict/data',
        element: (
          <RequirePermission permission="system:dict">
            {lazyLoad(() => import('@/pages/system/dict-data'))}
          </RequirePermission>
        ),
      },
      {
        path: 'system/config',
        element: (
          <RequirePermission permission="system:config">
            {lazyLoad(() => import('@/pages/system/config'))}
          </RequirePermission>
        ),
      },
      {
        path: 'system/message',
        element: (
          <RequirePermission permission="system:message">
            {lazyLoad(() => import('@/pages/system/message'))}
          </RequirePermission>
        ),
      },
      {
        path: 'system/log',
        element: (
          <RequirePermission permission="system:log">
            {lazyLoad(() => import('@/pages/system/log'))}
          </RequirePermission>
        ),
      },
      {
        path: 'tool/codegen',
        element: (
          <RequirePermission permission="tool:codegen">
            {lazyLoad(() => import('@/pages/tool/codegen'))}
          </RequirePermission>
        ),
      },
      {
        path: 'tool/pagegen',
        element: (
          <RequirePermission permission="tool:pagegen">
            {lazyLoad(() => import('@/pages/tool/pagegen'))}
          </RequirePermission>
        ),
      },
      { path: 'help', element: lazyLoad(() => import('@/pages/help')) },
    ],
  },
]);
