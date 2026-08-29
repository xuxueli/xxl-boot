/**
 * 组件：AppRouter（动态路由入口）
 * 功能：订阅后端菜单（userStore.menuData）→ 构建业务路由与完整路由配置，
 *       经 useRoutes 渲染；菜单变化（登录/刷新）时实时重新匹配，
 *       实现「后端菜单唯一数据源」的动态路由（对齐 Vue router.addRoute）。
 */
import React, {useMemo} from 'react';
import {useRoutes} from 'react-router-dom';
import {buildBusinessRoutes, buildAppRoutes} from '../index';
import {useUserStore} from '@/stores/userStore';
import RequireAuth from '../guards/RequireAuth';


const AppRouter: React.FC = () => {
    const menuData = useUserStore((s) => s.menuData);

    /**
     * 后端菜单 → 业务路由（拍平叶子路由），菜单变化（登录/刷新）时重建
     *
     *
     * useMemo：
     *    - 定义： React 的一个 Hook，用于在函数组件中缓存计算结果，避免不必要的重复计算。
     *    - 作用：当依赖项（这里是 menuData）没有变化时，useMemo 会返回缓存的结果，而不是重新计算。
     *    - 说明：适用于需要进行复杂计算或生成大量数据的场景，尤其是当这些计算依赖于某些状态或属性时。会接受两个参数：一个计算函数和一个依赖项数组。
     *        - 计算函数：返回需要缓存的值。
     *        - 依赖项数组：当数组中的值发生变化时，计算函数会重新执行，否则会返回缓存的结果。
     *    - 基本语法：
     *      <pre>
     *          const memoizedValue = useMemo(
     *            // 计算函数，返回需要缓存的值
     *            () => computeExpensiveValue(a, b),
     *            // 依赖项数组，只有当 a 或 b 发生变化时，才会重新计算
     *            [a, b]
     *          );
     *      </pre>
     *
     */
    const businessRoutes = useMemo(
        () => buildBusinessRoutes(menuData),
        [menuData],
    );

    // 菜单变化（登录/刷新）时重建完整路由配置，useRoutes 实时匹配
    const routeObjects = useMemo(
        () => buildAppRoutes(businessRoutes),
        [businessRoutes],
    );

    // 全局登录守卫：登录校验 + 会话/菜单加载完成后渲染路由
    return (
        <RequireAuth>
            {useRoutes(routeObjects)}
        </RequireAuth>
    );
};

export default AppRouter;