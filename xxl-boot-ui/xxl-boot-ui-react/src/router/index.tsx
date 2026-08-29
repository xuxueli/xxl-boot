/**
 * 路由定义与核心路由逻辑（React Router，对齐 Vue router/index.ts）
 *
 * 职责：
 *   1. 组件加载方法 lazyLoad：所有页面统一懒加载入口；
 *   2. 声明静态路由（constantRoutes）——登录、错误页、个人中心等，启动即注册；
 *   3. 处理业务路由（businessRoutes）——通常为业务子页面、隐藏状态，加载 business 文件；
 *   4. 动态业务路由：后端菜单（/getRouters）→ 前端路由，拍平注入（对齐 Vue addRoute）；
 *   5. 构建应用路由配置 buildAppRoutes，供 AppRouter（useRoutes）渲染，为唯一数据源。
 */
import {lazy, Suspense} from 'react';
import type {ReactNode} from 'react';
import {Navigate} from 'react-router-dom';
import type {RouteObject} from 'react-router-dom';
import Loading from '@/components/Loading';
import AppLayout from '@/layouts/AppLayout';
import defaultSettings from '@/default-settings';
import {businessRoutes} from './business';


// ==================== 组件加载方法 ====================

/** 懒加载页面组件（带 Loading 兜底），所有页面统一经此加载 */
export const lazyLoad = (factory: () => Promise<{ default: React.ComponentType }>): ReactNode => {
    const Component = lazy(factory);
    return (
        <Suspense fallback={<Loading/>}>
            <Component/>
        </Suspense>
    );
};


// ==================== 静态路由注册 ====================

/** 静态路由 —— 无权限门槛，启动即注册（登录、301、404、主布局、个人中心等）；参考 Vue constantRoutes 全部平铺 */
export const constantRoutes: RouteObject[] = [
    // 登录
    {
        path: '/login',
        element: lazyLoad(() => import('@/pages/login')),
    },
    // 301：未授权、无权限或会话过期
    {
        path: '/301',
        element: lazyLoad(() => import('@/pages/common/301')),
    },
    // 404：访问资源不存在。兜底 catch-all，编排（buildAppRoutes）时置于数组末段
    {
        path: '*',
        element: lazyLoad(() => import('@/pages/common/404')),
    },
    // 主布局：首页默认跳转工作台；业务路由由编排（buildAppRoutes）注入 children
    {
        path: '/',
        element: <AppLayout/>,
        children: [
            // 首页默认跳转工作台（路径读取 default-settings 配置，与 Vue redirect: defaultSettings.homePath 对齐）
            {index: true, element: <Navigate to={defaultSettings.homePath ?? '/dashboard'} replace/>},
        ],
    },
    // 个人中心：hidden 控制侧栏不显示
    {
        path: '/user',
        element: <AppLayout/>,
        children: [
            {
                path: 'profile',
                element: lazyLoad(() => import('@/pages/authz/user/profile')),
            },
        ],
    },
];


// ==================== 业务路由注册 ====================

// 业务路由（独立维护于 business.tsx），隐藏业务子路由、非菜单项，供内部跳转使用；
// 与静态路由、动态业务路由一并注入 AppLayout children。


// ==================== 动态路由转换 ====================

/**
 * 预先收集 pages 目录下页面文件，供后端 component 字符串按需映射（对齐 Vue loadView）
 *      - 注意：glob 使用 @ 别名时，Vite 返回的 key 可能为绝对路径或别名路径，统一提取 pages 相对段构建索引
 */
const pageModules = import.meta.glob('@/pages/**/index.tsx');
const fileModules = import.meta.glob('@/pages/*.tsx');

/**
 * 页面模块索引：pages 相对段（如 dashboard / authz/user/index） → 懒加载工厂
 *      - 说明：一次性构建，供 loadView 直接按路径判断是否存在（兼容 key 的绝对/别名/相对形式）
 */
const pageMap = new Map<string, () => Promise<{ default: React.ComponentType }>>();
for (const [modulePath, factory] of Object.entries({...pageModules, ...fileModules})) {
    const pagesIdx = modulePath.indexOf('/pages/');
    if (pagesIdx === -1) continue;
    const relative = modulePath
        .slice(pagesIdx + '/pages/'.length)
        // 去掉扩展名：authz/user/index.tsx → authz/user/index；dashboard.tsx → dashboard
        .replace(/\.(ts|tsx)$/, '');
    pageMap.set(relative, factory as () => Promise<{ default: React.ComponentType }>);
}

/**
 * 按后端 component 字符串匹配页面组件（与 Vue loadView 一致）：
 *      - 1) 依次判断 pages/{path}.tsx 是否存在（单文件格式，如 dashboard）；
 *      - 2) 未命中再判断 pages/{path}/index.tsx 是否存在（目录格式，如 authz/user）。
 *
 * @param component 后端路由组件地址（如 /authz/user）
 * @returns 页面组件懒加载工厂；未匹配到时返回 undefined
 */
export const loadView = (
    component?: string,
): (() => Promise<{ default: React.ComponentType }>) | undefined => {
    if (!component) return undefined;

    // pages 相对段：去除前导斜杠，如 /authz/user → authz/user
    const key = component.replace(/^\//, '');

    // 匹配单文件格式：pages/dashboard.tsx
    const fileModule = pageMap.get(key);
    if (fileModule) return fileModule;

    // 匹配目录格式：pages/authz/user/index.tsx
    const indexModule = pageMap.get(key + '/index');
    if (indexModule) return indexModule;

    console.error(`loadView fail, route.component：[${component}]`);
    return undefined;
};

/** 是否为外链地址（外链菜单不注册内部路由） */
const isHttp = (component?: string) => {
    return component?.startsWith('http://') || component?.startsWith('https://');
};

/**
 * 将后端菜单树转换为拍平后的业务路由（挂载到 AppLayout children）
 *
 * 后端结构（对齐 Vue 消费层级）：
 *   - 目录节点：component 为 Layout / ParentView，无页面组件，仅递归子节点；
 *   - 页面节点：component 为页面路径字符串（如 /authz/user），注册为叶子路由；
 *   - 根级菜单（如 /dashboard、/help）：component 为 Layout 且 meta 为空，
 *     由后端包裹一层单独子节点，实际页面在子节点中，递归时自然命中。
 *
 * @param routerList 后端 /getRouters 返回的菜单树
 * @returns 拍平后的业务路由列表（外链、无页面组件的节点被跳过；隐藏节点照常注册）
 */
export const buildBusinessRoutes = (
    routerList: API.RouterVo[] = [],
): RouteObject[] => {
    const routes: RouteObject[] = [];

    const walk = (nodes: API.RouterVo[]) => {
        nodes.forEach((node) => {

            // 隐藏路由（visible=1）：仍注册、可访问，仅侧栏渲染时过滤（AppLayout#buildMenuData），供 tab.openPage 等内部跳转
            // 目录节点（Layout / ParentView）：无页面组件，递归子节点
            if (node.component === 'Layout' || node.component === 'ParentView') {
                if (node.children?.length) walk(node.children);
                return;
            }

            // 外链或缺少路径：不注册内部路由
            if (isHttp(node.component) || !node.path) return;

            // 叶子页面：映射组件并注册
            const factory = loadView(node.component);
            if (!factory) return;

            routes.push({
                path: node.path.replace(/^\//, ''),
                element: lazyLoad(factory),
            });
        });
    };

    walk(routerList);
    return routes;
};


// ==================== 整合构建路由配置 ====================

/**
 * 构建应用路由配置（编排 constantRoutes + 注入业务路由）
 * 说明：返回的数组由 AppRouter 经 useRoutes 渲染，动态业务路由变化（登录/刷新拉取菜单）时
 *       useRoutes 实时重新匹配，等价 Vue router.addRoute 动态注入；
 *       业务路由与动态业务路由注入到主布局 children，404 catch-all 置于数组末段。
 *
 * @param dynamicRoutes 后端菜单生成、经 buildBusinessRoutes 拍平的动态业务路由
 * @returns 应用路由配置列表
 */
export const buildAppRoutes = (dynamicRoutes: RouteObject[] = []): RouteObject[] => {
    // 静态路由：登录、301、404、主布局、个人中心；constantRoutes 数据统一维护，此处仅编排注入
    const [loginRoute, errorRoute, notFoundRoute, homeRoute, userRoute] = constantRoutes;
    return [
        // 登录、301
        loginRoute,
        errorRoute,
        // 主布局：静态子路由 + 业务路由 + 动态业务路由
        {
            ...homeRoute,
            children: [
                ...(homeRoute.children ?? []),
                ...businessRoutes,
                ...dynamicRoutes,
            ],
        } as RouteObject,
        // 个人中心
        userRoute,
        // 404 兜底：置于数组末段，避免抢占其他路由
        notFoundRoute,
    ];
};