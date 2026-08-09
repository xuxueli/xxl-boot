/**
 * 组件：RequirePermission（页面权限守卫）
 * 功能：无对应权限时重定向到 403
 */
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserStore } from '@/stores/userStore';

const RequirePermission: React.FC<{
  permission?: string;
  children: React.ReactNode;
}> = ({ permission, children }) => {
  const hasPermi = useUserStore((s) => s.hasPermi);
  if (permission && !hasPermi(permission)) {
    return <Navigate to="/exception/403" replace />;
  }
  return <>{children}</>;
};

export default RequirePermission;
