/**
 * 业务路由（对齐 Vue router/business.ts）
 * 功能：业务子页面（下钻页等）、隐藏状态；单独维护、单独注册；
 *       隐藏路由不显示在侧栏，供 tab.openPage 等内部跳转使用。
 */
import {lazy, Suspense} from 'react';
import type {RouteObject} from 'react-router-dom';
import Loading from '@/components/Loading';

// 字典数据页懒加载（与 index.tsx lazyLoad 同款加载方式，避免模块循环依赖）
const DictData = lazy(() => import('@/pages/system/dict-data'));

/**
 * 业务路由 —— 隐藏业务子路由（非菜单项，供内部跳转）
 */
export const businessRoutes: RouteObject[] = [
    // 字典管理-子页面：字典数据页面
    {
        path: 'system/dict/data',
        element: (
            <Suspense fallback={<Loading/>}>
                <DictData/>
            </Suspense>
        ),
    },
];