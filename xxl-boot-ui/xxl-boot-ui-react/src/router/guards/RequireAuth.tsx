/**
 * 路由守卫：RequireAuth（全局登录守卫，对齐 Vue router.beforeEach）
 * 功能：
 *   - 未登录访问登录页（白名单）：放行；
 *   - 未登录访问其他路径：重定向登录页并回传原路径供登录后重定向；
 *   - 已登录但会话未加载：拉取用户信息与菜单，加载完成后再渲染（避免路由未注册时先命中 404）。
 */
import {message, Spin} from 'antd';
import React, {useEffect, useState} from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import {useUserStore} from '@/stores/userStore';
import {getToken} from '@/utils/auth';

/** 登录白名单：不鉴权直接放行的路径 */
const whiteList = ['/login'];

const RequireAuth = ({children}: { children: React.ReactNode }) => {
    const location = useLocation();
    const token = getToken();
    const currentUser = useUserStore((s) => s.currentUser);
    // 会话是否加载完成（用户信息 + 菜单拉取完毕后置为 true，再渲染路由）
    const [ready, setReady] = useState<boolean>(!!token && !!currentUser);

    useEffect(() => {
        // 未登录：无需加载会话
        if (!token) return;

        // 会话已存在（刷新/已加载过）：直接放行
        if (currentUser) return;

        // 已登录但会话未加载：拉取用户信息与菜单
        Promise.all([
            useUserStore.getState().fetchUserInfo(),
            useUserStore.getState().fetchMenuData(),
        ])
            .then(() => setReady(true))
            .catch(() => {
                // 会话信息拉取失败（如会话过期/无权限）：清理本地凭证并跳转登录页
                useUserStore
                    .getState()
                    .logout()
                    .catch(() => {
                    });
                message.error('登录状态已失效，请重新登录');
                const redirect = encodeURIComponent(
                    location.pathname + location.search,
                );
                window.location.href = `/login?redirect=${redirect}`;
            });
    }, [token, currentUser, location.pathname, location.search]);

    // 未登录：白名单（登录页）放行，其余重定向登录页
    if (!token) {
        if (whiteList.includes(location.pathname)) return <>{children}</>;
        const redirect = encodeURIComponent(location.pathname + location.search);
        return <Navigate to={`/login?redirect=${redirect}`} replace/>;
    }

    // 已登录但会话加载中，显示加载中
    if (!ready) {
        return (
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100vh',
                }}
            >
                <Spin size="large" description="加载中..."/>
            </div>
        );
    }

    // 已登录且会话已加载，渲染子路由
    return <>{children}</>;
};

export default RequireAuth;