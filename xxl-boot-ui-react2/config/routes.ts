/**
 * @name umi 的路由配置
 * @description 只支持 path,component,routes,redirect,wrappers,name,icon 的配置
 * @doc https://umijs.org/docs/guides/routes
 */
export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user/login',
        name: 'login',
        component: './user/login',
      },
      {
        path: '/user',
        redirect: '/user/login',
      },
      {
        name: '404',
        component: './exception/404',
        path: '/user/*',
      },
    ],
  },
  {
    path: '/user/profile',
    name: 'profile',
    component: './user/profile',
    hideInMenu: true,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    icon: 'home',
    component: './dashboard',
  },
  {
    path: '/authz',
    name: 'authz',
    icon: 'team',
    access: 'canAuthz',
    routes: [
      {
        path: '/authz',
        redirect: '/authz/user',
      },
      {
        path: '/authz/user',
        name: 'user',
        component: './authz/user',
        access: 'canAuthzUser',
      },
      {
        path: '/authz/role',
        name: 'role',
        component: './authz/role',
        access: 'canAuthzRole',
      },
      {
        path: '/authz/resource',
        name: 'resource',
        component: './authz/resource',
        access: 'canAuthzResource',
      },
      {
        path: '/authz/org',
        name: 'org',
        component: './authz/org',
        access: 'canAuthzOrg',
      },
    ],
  },
  {
    path: '/system',
    name: 'system',
    icon: 'setting',
    access: 'canSystem',
    routes: [
      {
        path: '/system',
        redirect: '/system/dict',
      },
      {
        path: '/system/dict',
        name: 'dict',
        component: './system/dict',
        access: 'canSystemDict',
      },
      {
        path: '/system/dict/data',
        name: 'dict-data',
        component: './system/dict-data',
        access: 'canSystemDict',
        hideInMenu: true,
      },
      {
        path: '/system/config',
        name: 'config',
        component: './system/config',
        access: 'canSystemConfig',
      },
      {
        path: '/system/message',
        name: 'message',
        component: './system/message',
        access: 'canSystemMessage',
      },
      {
        path: '/system/log',
        name: 'log',
        component: './system/log',
        access: 'canSystemLog',
      },
    ],
  },
  {
    path: '/tool',
    name: 'tool',
    icon: 'tool',
    access: 'canTool',
    routes: [
      {
        path: '/tool',
        redirect: '/tool/codegen',
      },
      {
        path: '/tool/codegen',
        name: 'codegen',
        component: './tool/codegen',
        access: 'canToolCodegen',
      },
      {
        path: '/tool/pagegen',
        name: 'pagegen',
        component: './tool/pagegen',
        access: 'canToolPagegen',
      },
    ],
  },
  {
    path: '/help',
    name: 'help',
    icon: 'book',
    component: './help',
  },
  {
    path: '/',
    redirect: '/dashboard',
  },
  {
    name: 'exception',
    icon: 'warning',
    path: '/exception',
    hideInMenu: true,
    routes: [
      {
        path: '/exception',
        redirect: '/exception/403',
      },
      {
        name: '403',
        icon: 'stop',
        path: '/exception/403',
        component: './exception/403',
      },
      {
        name: '404',
        icon: 'warning',
        path: '/exception/404',
        component: './exception/404',
      },
      {
        name: '500',
        icon: 'bug',
        path: '/exception/500',
        component: './exception/500',
      },
    ],
  },
  {
    component: './exception/404',
    path: '/*',
  },
];
