import Layout from '@/layout'

/**
 * 业务路由 —— 通常为业务子页面（下钻页等）、隐藏状态；单独维护、单独注册；
 * 说明：hidden 不显示在侧栏，供 tab.openPage 等内部跳转使用
 */
export const businessRoutes = [
    // 字典管理-子页面：字典数据页面
    {
        path: '/system/dict/data',
        component: Layout,
        hidden: true,
        redirect: 'noredirect',
        children: [
            {
                name: 'DictData',
                path: '/system/dict/data',
                component: () => import('@/views/system/dict/data'),
                meta: {title: '字典数据', activeMenu: '/system/dict'}
            }
        ]
    }
]
