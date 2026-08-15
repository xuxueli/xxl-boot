/**
 * 布局：BasicLayout（ProLayout 主布局）
 * 功能：接入后端菜单、头像下拉、消息铃铛、页脚、主题设置面板
 */
import type { MenuDataItem } from '@ant-design/pro-components';
import { ProLayout, SettingDrawer } from '@ant-design/pro-components';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import React from 'react';
import { HeaderAvatar, Footer, HeaderMessage } from './components';
import { useSettingsStore } from '@/stores/settingsStore';
import { useUserStore } from '@/stores/userStore';
import { getIconComponent } from '@/utils/icon';

/**
 * 将后端菜单树转换为 ProLayout 菜单数据
 *
 * <pre>
 *     原始菜单格式：
 *     {
 *          "hidden": false,
 *          "path": "/authz/user",
 *          "component": "LAYOUT",
 *          "meta": {
 *              "title": "用户管理",
 *              "icon": "UserOutlined"
 *          },
 *          "children": [{
                "hidden": false,
                "path": "/authz/user/index",
                "component": "authz/user/index",
                "meta": {
                "title": "用户管理",
                    "icon": "UserOutlined"
                }
 *          }]
 *     }
 *
 *     目标菜单格式：
 *     {
 *          "path": "/authz/user",
 *          "name": "用户管理",
 *          "icon": "<UserOutlined />",
 *          "children": [{
                "path": "/authz/user/index",
                "name": "用户管理",
                "icon": "<UserOutlined />"
 *          }]
 *     }
 * </pre>
 */
const buildMenuData = (routes: API.RouterVo[]): MenuDataItem[] => {
  return routes
    .filter((r) => !r.hidden)
    .map((r) => {
      // 根级菜单：后端 getRouters 会包裹一层 meta=null 的父节点，
      // 仅含一个子节点时，直接以子节点作为菜单项展示
      if (!r.meta && r.children?.length === 1) {
        const child = r.children[0];

        // parse root item: path、name、icon
        const promoted: MenuDataItem = {
          path: child.path || r.path,
          name: child.meta?.title,
        };
        const Icon = getIconComponent(child.meta?.icon);
        if (Icon) {
          promoted.icon = <Icon />;
        }
        return promoted;
      }

      // parse no-root: path、name、icon、children
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
 * BasicLayout 组件
 */
const BasicLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useUserStore((s) => s.currentUser);
  const menuData = useUserStore((s) => s.menuData);
  const settings = useSettingsStore((s) => s.settings);
  const settingDrawerOpen = useSettingsStore((s) => s.settingDrawerOpen);

  return (
    // ProLayout：Ant Design Pro 提供的布局组件，支持菜单、面包屑、页脚、主题设置等功能
    <ProLayout
      title={settings.title}
      logo={settings.logo}
      location={location}
      // 左侧菜单：菜单以后端资源配置为准（getRouters 返回的树）
      menuDataRender={() => buildMenuData(menuData)}
      // 顶部面包屑：单层级页面（如首页、帮助中心）也展示面包屑
      breadcrumbProps={{ minLength: 1 }}
      // 顶部面包屑：只读展示，不支持点击跳转
      itemRender={(route) => (
        <span>{route.breadcrumbName || route.title}</span>
      )}
      menuItemRender={(item, dom) =>
        item.path ? <Link to={item.path}>{dom}</Link> : dom
      }
      // 顶部区域：头部消息
      actionsRender={() => [<HeaderMessage key="header-message" />]}
      // 顶部区域：用户信息
      avatarProps={{
        title: currentUser?.realName || currentUser?.userName,
        render: (_, avatarChildren) => (
          <HeaderAvatar>{avatarChildren}</HeaderAvatar>
        ),
      }}
      // 底部区域：页脚
      footerRender={() => <Footer />}
      // 左侧菜单头部：点击事件
      onMenuHeaderClick={() => navigate('/')}
      {...settings}
    >
      {/* 页面内容区域 */}
      <Outlet />
      {/* 主题设置面板 */}
      <SettingDrawer
        disableUrlParams
        enableDarkTheme
        collapse={settingDrawerOpen}
        onCollapseChange={(open) =>
          useSettingsStore.getState().setSettingDrawerOpen(open)
        }
        settings={settings as any}
        onSettingChange={(s) =>
          useSettingsStore.getState().setSettings(s as any)
        }
      />
    </ProLayout>
  );
};

export default BasicLayout;
