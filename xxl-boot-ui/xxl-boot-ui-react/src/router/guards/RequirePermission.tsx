/**
 * 路由守卫：RequirePermission（页面权限守卫）
 * 功能：无对应权限时重定向到 301 无权限页
 */
import React from 'react';
import {Navigate} from 'react-router-dom';
import {useUserStore} from '@/stores/userStore';

const RequirePermission = ({
                               permission,
                               children,
                           }: {
    permission?: string;
    children: React.ReactNode;
}) => {
    // 权限校验：经 getState 校验，无需挂载 store 订阅
    if (permission && !useUserStore.getState().hasPermi(permission)) {
        return <Navigate to="/301" replace/>;
    }
    // 有权限：渲染子组件或元素
    return <>{children}</>;
};

export default RequirePermission;
