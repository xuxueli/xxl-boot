/**
 * @fileoverview AppLayout（ProLayout 主布局）
 * @description 基于 ProLayout 组装主布局：后端菜单、消息铃铛、头像下拉、主题设置面板、页脚与内容区
 * @author xuxueli 2026-11-21
 */
import { DownOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuDataItem } from '@ant-design/pro-components';
import { ProLayout } from '@ant-design/pro-components';
import type React from 'react';
import { useCallback, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import defaultSettings from '@/default-settings';
import { t } from '@/i18n';
import { useSettingsStore } from '@/stores/settingsStore';
import { useUserStore } from '@/stores/userStore';
import { buildMenu } from '@/utils/menu';
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

/** 判断菜单地址是否为 http(s) 外链 */
const isExternalLink = (path: string) => /^https?:\/\//i.test(path);

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
      // 外链菜单交给浏览器打开，避免被 React Router 解析为站内路径
      if (targetPath && isExternalLink(targetPath)) {
        return (
          <a href={targetPath} target="_blank" rel="noopener noreferrer">
            {label}
          </a>
        );
      }
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
