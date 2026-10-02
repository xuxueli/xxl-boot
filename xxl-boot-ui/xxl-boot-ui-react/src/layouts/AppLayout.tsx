/**
 * 布局：AppLayout（ProLayout 主布局）
 * 功能：
 *      - 菜单（from后端）：ProLayout#menuDataRender 支持多种菜单模式，后端返回的路由树可直接渲染为菜单
 *      - 消息铃铛：ProLayout#actionsRender
 *      - 头像下拉：ProLayout#avatarProps
 *     - 主题设置面板：LayoutSettingDrawer
 *      - 页脚：ProLayout#footerRender
 *      - 内容区：LayoutContent；
 *
 * @author xuxueli 2026-08-15
 */
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuDataItem } from '@ant-design/pro-components';
import { ProLayout } from '@ant-design/pro-components';
import React, { useCallback, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import defaultSettings from '@/default-settings';
import { t } from '@/i18n';
import { useSettingsStore } from '@/stores/settingsStore';
import { useUserStore } from '@/stores/userStore';
import { getIconComponent } from '@/utils/icon';
import {
  Footer,
  FullscreenButton,
  HeaderAvatar,
  HeaderMessage,
  LayoutContent,
  LayoutSettingDrawer,
  ThemeColorPicker,
} from './components';

/* 菜单项标题/图标样式：模块级常量，避免每次渲染新建样式对象 */
const MENU_LABEL_STYLE = { display: 'inline-flex', alignItems: 'center' } as const;
const MENU_ICON_STYLE = { marginRight: 8, display: 'inline-flex' } as const;

/* 面包屑：单层级页面也展示（稳定引用） */
const BREADCRUMB_PROPS = { minLength: 1 };

/* 面包屑项：只读展示，不支持点击跳转（稳定引用） */
const breadcrumbItemRender = (route: { title?: React.ReactNode }) => (
  <span>{route.title}</span>
);

/**
 * 构建菜单：一次遍历同时产出「菜单数据」与「目录→第一个叶子路径」映射
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
 *
 * @param routes 后端 /getRouters 返回的菜单树
 * @returns items：ProLayout 菜单数据；redirectMap：目录路径 → 第一个叶子路径
 */
const buildMenu = (
  routes: API.RouterVo[],
): { items: MenuDataItem[]; redirectMap: Record<string, string> } => {
  const redirectMap: Record<string, string> = {};

  /* 查找子树中的第一个叶子路径（目录点击跳转用） */
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

  /* 递归转换：过滤隐藏项、构造菜单项，并记录目录跳转映射 */
  const toItems = (nodes: API.RouterVo[]): MenuDataItem[] =>
    nodes
      .filter((r) => !r.hidden)
      .map((r) => {
        /* 目录节点：记录「目录路径 → 第一个叶子路径」，供菜单点击跳转（避免目录 404） */
        if (r.children?.length && r.path) {
          const firstLeaf = findFirstLeaf(r.children);
          if (firstLeaf) redirectMap[r.path] = firstLeaf;
        }

        /* 根级包装节点（meta 为空且仅 1 个可见子项）：提升子项为菜单项 */
        if (!r.meta && r.children?.length === 1 && !r.children[0].hidden) {
          const child = r.children[0];
          const item: MenuDataItem = {
            path: child.path || r.path,
            name: child.meta?.title,
          };
          const Icon = getIconComponent(child.meta?.icon);
          if (Icon) item.icon = <Icon />;
          return item;
        }

        /* 普通节点：path、name、icon、children */
        const item: MenuDataItem = { path: r.path, name: r.meta?.title };
        const Icon = getIconComponent(r.meta?.icon);
        if (Icon) item.icon = <Icon />;
        if (r.children?.length) item.children = toItems(r.children);
        return item;
      });

  return { items: toItems(routes), redirectMap };
};

/**
 * 菜单项标题渲染：为二级及以下菜单补充展示图标
 * 说明：pro-layout 的 siderMenuType=sub 模式下，仅第一级菜单项渲染 icon，深层菜单项默认不展示，
 *       这里在自定义渲染逻辑中手动补充图标。
 *
 * @param item 菜单数据项
 * @returns 菜单标题节点
 */
const renderMenuLabel = (item: MenuDataItem) => {
  /* 未设置图标：直接返回菜单名 */
  if (!item.icon) {
    return item.name;
  }
  /* 设置图标：图标 + 菜单名 水平排列 */
  return (
    <span style={MENU_LABEL_STYLE}>
      <span style={MENU_ICON_STYLE}>{item.icon}</span>
      {item.name}
    </span>
  );
};

/**
 * AppLayout 组件
 */
const AppLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useUserStore((s) => s.currentUser);
  const menuData = useUserStore((s) => s.menuData);
  /* 布局设置：消费 settingsStore，控制标题/Logo/主题色/布局模式等 */
  const settings = useSettingsStore((s) => s.settings);
  /* 侧边栏折叠状态：受控于 settingsStore，点击开关即时持久化 */
  const collapsed = useSettingsStore((s) => s.collapsed);

  /* 菜单数据 + 目录跳转映射：一次遍历产出，仅在 menuData 变化时重建 */
  const { items: menuDataItems, redirectMap: dirRedirectMap } = useMemo(
    () => buildMenu(menuData),
    [menuData],
  );

  /* 菜单数据渲染：引用稳定，减少 ProLayout 内部菜单重渲染 */
  const menuDataRender = useCallback(() => menuDataItems, [menuDataItems]);

  /* 菜单点击跳转：目录项跳转其第一个叶子子项（避免 404），其余正常跳转 */
  const menuItemRender = useCallback(
    (item: MenuDataItem, dom: React.ReactNode) => {
      const path = item.path ?? '';
      const targetPath = dirRedirectMap[path] || path;
      const label = item.icon ? renderMenuLabel(item) : dom;
      return targetPath ? <Link to={targetPath}>{label}</Link> : label;
    },
    [dirRedirectMap],
  );

  /* 顶部操作区：全屏切换 + 站内消息（引用稳定） */
  const actionsRender = useCallback(
    () => [
      <FullscreenButton key="fullscreen" />,
      <HeaderMessage key="header-message" />,
    ],
    [],
  );

  /* 用户信息区：仅在用户变化时重建 */
  const avatarProps = useMemo(
    () => ({
      title: (
        <>
          <UserOutlined style={{ fontSize: 18 }} />
          <span
            style={{ fontWeight: 'bold', paddingLeft: 2, paddingRight: 2 }}
          >
            {currentUser?.realName || currentUser?.userName}
          </span>
          <DownOutlined style={{ fontSize: 14 }} />
        </>
      ),
      render: (_: unknown, avatarChildren: React.ReactNode) => (
        <HeaderAvatar>{avatarChildren}</HeaderAvatar>
      ),
    }),
    [currentUser],
  );

  /* 侧边栏折叠：切换时持久化到 localStorage（引用稳定） */
  const handleCollapse = useCallback(
    (isCollapsed: boolean) =>
      useSettingsStore.getState().setCollapsed(isCollapsed),
    [],
  );

  /* 菜单头部点击：回到首页（与 default-settings.homePath 对齐） */
  const handleMenuHeaderClick = useCallback(
    () => navigate(defaultSettings.homePath ?? '/dashboard'),
    [navigate],
  );

  /* 底部区域：设置面板关闭页脚时返回 false 隐藏，否则渲染 Footer（引用稳定） */
  const footerRender = useMemo(
    () => (settings.footerRender === false ? false : () => <Footer />),
    [settings.footerRender],
  );

  /* 应用标题：语言变更会触发根组件按 key 重挂载，故只需计算一次 */
  const appTitle = useMemo(() => t('app.title'), []);

  return (
    // ProLayout：Ant Design Pro 提供的布局组件，支持菜单、面包屑、页脚、主题设置等功能
    <ProLayout
      // 将布局设置透传给 ProLayout，实时驱动标题/Logo/主题/布局等
      {...settings}
      title={appTitle}
      logo={settings.logo}
      location={location}
      // 左侧菜单：菜单以后端资源配置为准（菜单数据 + 渲染/点击回调均已记忆化）
      menuDataRender={menuDataRender}
      menuItemRender={menuItemRender}
      // 顶部面包屑：单层级页面（如首页、帮助中心）也展示、只读不可点击
      breadcrumbProps={BREADCRUMB_PROPS}
      itemRender={breadcrumbItemRender}
      // 顶部区域：全屏切换 + 站内消息
      actionsRender={actionsRender}
      // 顶部区域：用户信息
      avatarProps={avatarProps}
      // 底部区域：页脚
      footerRender={footerRender}
      // 禁用断点：避免 antd Sider 挂载时按视口触发 onCollapse(false)，覆盖持久化的折叠状态
      breakpoint={false}
      // 侧边栏折叠：受控展开/收起，切换时持久化到 localStorage
      collapsed={collapsed}
      onCollapse={handleCollapse}
      // 左侧菜单头部：点击事件
      onMenuHeaderClick={handleMenuHeaderClick}
    >
      {/* 页面内容区域 */}
      <LayoutContent />
      {/* 主题设置面板：设置变更实时写入 settingsStore，不写 URL 参数 */}
      <LayoutSettingDrawer />
      {/* 主题色区域右侧的颜色选择器（支持自定义取色） */}
      <ThemeColorPicker />
    </ProLayout>
  );
};

export default AppLayout;
