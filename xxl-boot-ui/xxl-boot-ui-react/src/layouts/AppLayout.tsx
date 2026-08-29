/**
 * 布局：AppLayout（ProLayout 主布局）
 * 功能：
 *      - 菜单（from后端）：ProLayout#menuDataRender 支持多种菜单模式，后端返回的路由树可直接渲染为菜单
 *      - 消息铃铛：ProLayout#actionsRender
 *      - 头像下拉：ProLayout#avatarProps
 *      - 页脚：ProLayout#footerRender
 *      - 主题设置面板：SettingDrawer
 */
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuDataItem } from '@ant-design/pro-components';
import { ProLayout, SettingDrawer } from '@ant-design/pro-components';
import { App, Button } from 'antd';
import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSettingsStore } from '@/stores/settingsStore';
import { useUserStore } from '@/stores/userStore';
import { getIconComponent } from '@/utils/icon';
import {
  Footer,
  FullscreenButton,
  HeaderAvatar,
  HeaderMessage,
  ThemeColorPicker,
} from './components';

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
 * 菜单项标题渲染：为二级及以下菜单补充展示图标
 * 说明：pro-layout 的 siderMenuType=sub 模式下，仅第一级菜单项渲染 icon，深层菜单项（子菜单/叶子项）默认不展示，
 *       这里在自定义渲染逻辑中手动补充图标。
 * @param item 菜单数据项
 * @returns 菜单标题节点
 */
const renderMenuLabel = (item: MenuDataItem) => {
  // 未设置图标：直接返回菜单名
  if (!item.icon) {
    return item.name;
  }
  // 设置图标：图标 + 菜单名 水平排列
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
      <span style={{ marginRight: 8, display: 'inline-flex' }}>{item.icon}</span>
      {item.name}
    </span>
  );
};

/**
 * 构建「目录路径 → 第一个叶子路径」映射表
 * 说明：splitMenus（自动分割菜单）下目录会被渲染成扁平菜单项且 children 被剥离，
 *       点击时需跳转到第一个叶子子项（真实页面），避免跳到目录路径导致 404
 */
const buildDirRedirectMap = (
  routes: API.RouterVo[],
): Record<string, string> => {
  const map: Record<string, string> = {};

  const findFirstLeaf = (nodes: API.RouterVo[]): string | undefined => {
    for (const node of nodes) {
      /* 叶子节点：直接使用其路径 */
      if (!node.children?.length) return node.path;
      /* 目录节点：递归向下查找 */
      const leafPath = findFirstLeaf(node.children);
      if (leafPath) return leafPath;
    }
    return undefined;
  };

  const walk = (nodes: API.RouterVo[]) => {
    for (const node of nodes) {
      /* 目录节点（有子项且自身有路径）：记录映射，点击时跳转第一个叶子子项 */
      if (node.children?.length && node.path) {
        const firstLeaf = findFirstLeaf(node.children);
        if (firstLeaf) map[node.path] = firstLeaf;
      }
      if (node.children?.length) walk(node.children);
    }
  };

  walk(routes);
  return map;
};

/**
 * AppLayout 组件
 */
const AppLayout = () => {
  const { message } = App.useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useUserStore((s) => s.currentUser);
  const menuData = useUserStore((s) => s.menuData);
  /* 布局设置：消费 settingsStore，控制标题/Logo/主题色/布局模式等 */
  const settings = useSettingsStore((s) => s.settings);
  /* 设置面板开关：控制 SettingDrawer 显隐 */
  const settingDrawerOpen = useSettingsStore((s) => s.settingDrawerOpen);
  /* 侧边栏折叠状态：受控于 settingsStore，点击开关即时持久化 */
  const collapsed = useSettingsStore((s) => s.collapsed);
  /* 目录路径 → 第一个叶子路径 映射，供菜单点击跳转（避免目录 404） */
  const dirRedirectMap = React.useMemo(
    () => buildDirRedirectMap(menuData),
    [menuData],
  );

  /**
   * 保存设置：将当前设置持久化，刷新后保持
   */
  const handleSaveSettings = () => {
    useSettingsStore.getState().saveSettings();
    message.success('设置已保存');
  };

  /**
   * 重置设置：清除持久化设置，并恢复默认配置
   */
  const handleResetSettings = () => {
    useSettingsStore.getState().resetSettings();
    message.success('设置已重置');
  };

  return (
    // ProLayout：Ant Design Pro 提供的布局组件，支持菜单、面包屑、页脚、主题设置等功能
    <ProLayout
      // 将布局设置透传给 ProLayout，实时驱动标题/Logo/主题/布局等
      {...settings}
      title={settings.title}
      logo={settings.logo}
      location={location}
      // 左侧菜单：菜单以后端资源配置为准（getRouters 返回的树）
      menuDataRender={() => buildMenuData(menuData)}
      // 左侧菜单：点击菜单项跳转路由（目录项跳转其第一个叶子子项，避免 404；其他正常跳转；）
      menuItemRender={(item, dom) => {
        const targetPath = dirRedirectMap[item.path as string] || item.path;
        // 叶子菜单项：pro-layout 仅第一级默认渲染 icon，这里统一手动渲染标题，保证二级及以下叶子项也展示 icon
        const label = item.icon ? renderMenuLabel(item) : dom;
        return targetPath ? <Link to={targetPath}>{label}</Link> : label;
      }}
      // 顶部面包屑：单层级页面（如首页、帮助中心）也展示面包屑
      breadcrumbProps={{ minLength: 1 }}
      // 顶部面包屑：只读展示，不支持点击跳转
      itemRender={(route) => <span>{route.title}</span>}
      // 顶部区域：全屏切换 + 站内消息
      actionsRender={() => [
        <FullscreenButton key="fullscreen" />,
        <HeaderMessage key="header-message" />,
      ]}
      // 顶部区域：用户信息
      avatarProps={{
        title: (
            <>
              <UserOutlined style={{ fontSize: 18 }} />
              <span style={{ fontWeight: 'bold', paddingLeft: 2, paddingRight: 2 }}>
                {currentUser?.realName || currentUser?.userName}
              </span>
              <DownOutlined style={{ fontSize: 14 }} />
            </>
        ),
        render: (_, avatarChildren) => (
          <HeaderAvatar>{avatarChildren}</HeaderAvatar>
        ),
      }}
      // 底部区域：页脚（设置面板关闭页脚时返回 false 隐藏，否则渲染 Footer）
      footerRender={settings.footerRender === false ? false : () => <Footer />}
      // 禁用断点：避免 antd Sider 挂载时按视口触发 onCollapse(false)，覆盖持久化的折叠状态
      breakpoint={false}
      // 侧边栏折叠：受控展开/收起，切换时持久化到 localStorage
      collapsed={collapsed}
      onCollapse={(isCollapsed) =>
        useSettingsStore.getState().setCollapsed(isCollapsed)
      }
      // 左侧菜单头部：点击事件
      onMenuHeaderClick={() => navigate('/')}
    >
      {/* 页面内容区域 */}
      <Outlet />
      {/* 主题设置面板：设置变更实时写入 settingsStore，不写 URL 参数 */}
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
        // 隐藏内置"复制设置"按钮与"生产环境提示"，由底部自定义保存/重置按钮接管
        hideCopyButton
        hideHintAlert
        // 自定义底部操作区：保存设置 / 重置设置
        drawerProps={{
          // 抽屉底部操作区：保存设置/ 重置设置（恢复默认）
          footer: (
            <div style={{ display: 'flex', gap: 8 }}>
              <Button type="primary" block onClick={handleSaveSettings}>
                保存设置
              </Button>
              <Button block onClick={handleResetSettings}>
                重置设置
              </Button>
            </div>
          ),
        }}
      />
      {/* 主题色区域右侧的颜色选择器（支持自定义取色） */}
      <ThemeColorPicker />
    </ProLayout>
  );
};

export default AppLayout;
