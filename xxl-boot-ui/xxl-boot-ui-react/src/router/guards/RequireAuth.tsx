/**
 * 路由守卫：RequireAuth（登录守卫）
 * 功能：未登录重定向到登录页；已登录但会话未加载时拉取用户信息与菜单
 */
import { message, Spin } from 'antd';
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';
import { getToken } from '@/utils/auth';

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const token = getToken();
  const currentUser = useUserStore((s) => s.currentUser);

  useEffect(() => {
    if (token && !currentUser) {
      // 事件回调中直接调用 store action，避免为单次调用挂载 store 订阅
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
        const redirect = encodeURIComponent(
          location.pathname + location.search,
        );
        window.location.href = `/login?redirect=${redirect}`;
      });
    }
  }, [token, currentUser, location.pathname, location.search]);

  if (!token) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }

  if (!currentUser) {
    // 会话加载中
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

  return <>{children}</>;
};

export default RequireAuth;
