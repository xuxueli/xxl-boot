/**
 * @fileoverview 路由守卫：RequireAuth（全局登录守卫，对齐 Vue router.beforeEach）
 * @description 功能：
 *    - 未登录访问白名单放行，其余路径重定向登录页；
 *    - 已登录但会话未加载时先拉取用户信息与菜单，避免命中 404
 * @author xuxueli 2026-11-21
 */
import { message, Spin } from 'antd';
import type React from 'react';
import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';
import { getToken } from '@/utils/auth';

/** 登录白名单：不鉴权直接放行的路径 */
const whiteList = ['/login'];

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const token = getToken();
  const currentUser = useUserStore((s) => s.currentUser);

  /** 未登录跳登录页地址：回传原路径供登录后重定向；根路径无实际页面，无需回传，交由根路由默认跳首页 */
  const buildLoginPath = () => {
    const current = location.pathname + location.search;
    const param = current === '/' ? '' : `?redirect=${encodeURIComponent(current)}`;
    return `/login${param}`;
  };

  useEffect(() => {
    // 未登录：无需加载会话
    if (!token) return;

    // 会话已存在（登录页已拉取 / 刷新后已加载）：无需重复拉取
    if (currentUser) return;

    // 已登录但会话未加载：拉取用户信息与菜单
    Promise.all([
      useUserStore.getState().fetchUserInfo(),
      useUserStore.getState().fetchMenuData(),
    ]).catch(() => {
      // 会话信息拉取失败（如会话过期/无权限）：清理本地凭证并跳转登录页
      useUserStore
        .getState()
        .logout()
        .catch(() => {});
      message.error('登录状态已失效，请重新登录');
      window.location.href = buildLoginPath();
    });
  }, [token, currentUser, location.pathname, location.search]);

  // 未登录：白名单（登录页）放行，其余重定向登录页
  if (!token) {
    if (whiteList.includes(location.pathname)) return <>{children}</>;
    return <Navigate to={buildLoginPath()} replace />;
  }

  // 已登录但会话加载中，显示加载中
  if (!currentUser) {
    return (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      >
        <Spin size="large" description="加载中..." />
      </div>
    );
  }

  // 已登录且会话已加载，渲染子路由
  return <>{children}</>;
};

export default RequireAuth;
