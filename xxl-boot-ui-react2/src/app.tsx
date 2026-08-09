import type {
  Settings as LayoutSettings,
  MenuDataItem,
} from '@ant-design/pro-components';
import { SettingDrawer } from '@ant-design/pro-components';
import type { RequestConfig, RunTimeLayoutConfig } from '@umijs/max';
import { history, Link } from '@umijs/max';
import React from 'react';
import {
  AvatarDropdown,
  ErrorBoundary,
  Footer,
  HeaderMessage,
  OfflineBanner,
} from '@/components';
import { getInfo, getRouters } from '@/services/xxl-boot/login';
import { getIconComponent } from '@/utils/icon';
import defaultSettings from '../config/defaultSettings';
import { errorConfig } from './requestErrorConfig';

const loginPath = '/user/login';

/** 将后端菜单树转换为 ProLayout 菜单数据 */
const buildMenuData = (routes: API.RouterVo[]): MenuDataItem[] => {
  return routes
    .filter((r) => !r.hidden)
    .map((r) => {
      const item: MenuDataItem = {
        path: r.path,
        name: r.meta?.title,
      };
      const Icon = getIconComponent(r.meta?.icon);
      if (Icon) {
        item.icon = <Icon />;
      }
      if (r.children?.length) {
        item.children = buildMenuData(r.children);
      }
      return item;
    });
};

/**
 * @see https://umijs.org/docs/api/runtime-config#getinitialstate
 */
export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: API.LoginInfo;
  menuData?: API.RouterVo[];
  loading?: boolean;
  fetchUserInfo?: () => Promise<API.LoginInfo | undefined>;
  fetchMenuData?: () => Promise<API.RouterVo[]>;
  settingDrawerOpen?: boolean;
}> {
  // 获取当前登录用户信息
  const fetchUserInfo = async () => {
    try {
      const res = await getInfo({ skipErrorHandler: true });
      return res.data;
    } catch (_error) {
      const { pathname, search, hash } = history.location;
      history.replace(
        `${loginPath}?redirect=${encodeURIComponent(pathname + search + hash)}`,
      );
    }
    return undefined;
  };

  // 获取当前用户菜单（后端资源配置）
  const fetchMenuData = async () => {
    try {
      const res = await getRouters();
      return res.data || [];
    } catch {
      return [];
    }
  };

  // 如果不是登录页面，执行
  const { location } = history;
  if (location.pathname !== loginPath) {
    const [currentUser, menuData] = await Promise.all([
      fetchUserInfo(),
      fetchMenuData(),
    ]);
    return {
      fetchUserInfo,
      fetchMenuData,
      currentUser,
      menuData,
      settings: defaultSettings as Partial<LayoutSettings>,
      settingDrawerOpen: false,
    };
  }
  return {
    fetchUserInfo,
    fetchMenuData,
    settings: defaultSettings as Partial<LayoutSettings>,
    settingDrawerOpen: false,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({
  initialState,
  setInitialState,
}) => {
  return {
    menuItemRender: (item, dom) => {
      if (item.path) {
        return (
          <Link to={item.path} prefetch>
            {dom}
          </Link>
        );
      }
      return dom;
    },
    actionsRender: () => [<HeaderMessage key="header-message" />],
    avatarProps: {
      title:
        initialState?.currentUser?.realName ||
        initialState?.currentUser?.userName,
      render: (_, avatarChildren) => (
        <AvatarDropdown>{avatarChildren}</AvatarDropdown>
      ),
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history;
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.replace(
          `${loginPath}?redirect=${encodeURIComponent(location.pathname + location.search + location.hash)}`,
        );
      }
    },
    // 菜单以后端资源配置为准（getRouters 返回的树）
    menuDataRender: () => buildMenuData(initialState?.menuData || []),
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    childrenRender: (children) => {
      return (
        <>
          {children}
          <SettingDrawer
            disableUrlParams
            enableDarkTheme
            collapse={initialState?.settingDrawerOpen}
            onCollapseChange={(open) => {
              setInitialState((s) => ({
                ...s,
                settingDrawerOpen: open,
              }));
            }}
            settings={initialState?.settings}
            onSettingChange={(settings) => {
              setInitialState((s) => ({
                ...s,
                settings,
              }));
            }}
          />
        </>
      );
    },
    ...initialState?.settings,
  };
};

/**
 * @name request 配置，可以配置错误处理
 * 它基于 axios 提供了一套统一的网络请求和错误处理方案。
 * @doc https://umijs.org/docs/max/request#配置
 */
export const request: RequestConfig = {
  baseURL: '/api',
  ...errorConfig,
};

export function rootContainer(container: React.ReactNode) {
  return (
    <>
      <OfflineBanner />
      <ErrorBoundary>{container}</ErrorBoundary>
    </>
  );
}
