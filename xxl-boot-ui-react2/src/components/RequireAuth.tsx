/**
 * 组件：RequireAuth（登录守卫）
 * 功能：未登录重定向到登录页；已登录但会话未加载时拉取用户信息与菜单
 */
import { Spin } from 'antd';
import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';
import { getToken } from '@/utils/auth';

const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const token = getToken();
  const currentUser = useUserStore((s) => s.currentUser);
  const fetchUserInfo = useUserStore((s) => s.fetchUserInfo);
  const fetchMenuData = useUserStore((s) => s.fetchMenuData);

  useEffect(() => {
    if (token && !currentUser) {
      Promise.all([fetchUserInfo(), fetchMenuData()]).catch(() => {});
    }
  }, [token, currentUser, fetchUserInfo, fetchMenuData]);

  if (!token) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/user/login?redirect=${redirect}`} replace />;
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
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  return <>{children}</>;
};

export default RequireAuth;
