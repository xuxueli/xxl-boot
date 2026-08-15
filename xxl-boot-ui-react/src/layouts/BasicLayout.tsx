/**
 * 布局：BasicLayout（ProLayout 主布局）
 * 功能：接入后端菜单、头像下拉、消息铃铛、页脚、主题设置面板
 */
import type { MenuDataItem } from '@ant-design/pro-components';
import { ProLayout, SettingDrawer } from '@ant-design/pro-components';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import React from 'react';
import { AvatarDropdown, Footer, HeaderMessage } from '@/components';
import { useSettingsStore } from '@/stores/settingsStore';
import { useUserStore } from '@/stores/userStore';
import { getIconComponent } from '@/utils/icon';

/** 将后端菜单树转换为 ProLayout 菜单数据 */
const buildMenuData = (routes: API.RouterVo[]): MenuDataItem[] => {
  return routes
    .filter((r) => !r.hidden)
    .map((r) => {
      // 根级菜单：后端 getRouters 会包裹一层 meta=null 的父节点，
      // 仅含一个子节点时，直接以子节点作为菜单项展示
      if (!r.meta && r.children?.length === 1) {
        const child = r.children[0];
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

const BasicLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useUserStore((s) => s.currentUser);
  const menuData = useUserStore((s) => s.menuData);
  const settings = useSettingsStore((s) => s.settings);
  const settingDrawerOpen = useSettingsStore((s) => s.settingDrawerOpen);

  return (
    <ProLayout
      title={settings.title}
      logo={settings.logo}
      location={location}
      // 菜单以后端资源配置为准（getRouters 返回的树）
      menuDataRender={() => buildMenuData(menuData)}
      // 单层级页面（如首页、帮助中心）也展示面包屑
      breadcrumbProps={{ minLength: 1 }}
      // 面包屑只读展示，不支持点击跳转
      itemRender={(route) => (
        <span>{route.breadcrumbName || route.title}</span>
      )}
      menuItemRender={(item, dom) =>
        item.path ? <Link to={item.path}>{dom}</Link> : dom
      }
      actionsRender={() => [<HeaderMessage key="header-message" />]}
      avatarProps={{
        title: currentUser?.realName || currentUser?.userName,
        render: (_, avatarChildren) => (
          <AvatarDropdown>{avatarChildren}</AvatarDropdown>
        ),
      }}
      footerRender={() => <Footer />}
      onMenuHeaderClick={() => navigate('/')}
      {...settings}
    >
      <Outlet />
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
