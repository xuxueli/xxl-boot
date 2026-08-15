/**
 * 布局组件：HeaderAvatar（头像下拉菜单）
 * 功能：顶部导航栏右侧头像，下拉提供个人中心、主题设置、退出登录
 */
import { IdcardOutlined, LogoutOutlined, SkinOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Modal, Spin } from 'antd';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Dropdown from '@/components/Dropdown';
import { useSettingsStore } from '@/stores/settingsStore';
import { useUserStore } from '@/stores/userStore';

/**
 * 组件入参：包裹的头像/按钮内容
 */
type GlobalHeaderRightProps = {
  children?: React.ReactNode;
};

/** 下拉菜单项：个人中心 / 主题设置 / 退出登录 */
const menuItems: MenuProps['items'] = [
  {
    key: 'profile',
    icon: <IdcardOutlined />,
    label: '个人中心',
  },
  {
    key: 'theme',
    icon: <SkinOutlined />,
    label: '主题设置',
  },
  {
    type: 'divider' as const,
  },
  {
    key: 'logout',
    icon: <LogoutOutlined />,
    label: '退出登录',
  },
];

/**
 * 头像下拉菜单组件
 */
const HeaderAvatar = ({ children }: GlobalHeaderRightProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useUserStore((s) => s.currentUser);

  /**
   * 菜单项点击处理：根据 key 分流到退出登录 / 主题设置 / 个人中心
   */
  const onMenuClick: MenuProps['onClick'] = (event) => {
    const { key } = event;
    /* 退出登录：二次确认后调用 store 退出并跳转登录页 */
    if (key === 'logout') {
      Modal.confirm({
        title: '系统提示',
        content: '确定注销并退出系统吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          // 事件回调中直接调用 store action，避免为单次调用挂载 store 订阅
          await useUserStore.getState().logout();
          /* replace 跳转并携带来源路径，登录后可回跳 */
          navigate('/login', {
            replace: true,
            state: { from: location.pathname },
          });
        },
      });
      return;
    }
    /* 主题设置：打开全局主题设置面板（SettingDrawer） */
    if (key === 'theme') {
      useSettingsStore.getState().setSettingDrawerOpen(true);
      return;
    }
    /* 个人中心：跳转对应路由（/user/profile） */
    navigate(`/user/${key}`);
  };

  /* 未登录/用户信息未就绪时，以加载态兜底，避免渲染空头像 */
  if (!currentUser) {
    return <Spin size="small" />;
  }

  return (
    <Dropdown
      placement="bottomRight"
      menu={{
        selectedKeys: [],
        onClick: onMenuClick,
        items: menuItems,
      }}
      arrow
    >
      {children}
    </Dropdown>
  );
};

export default HeaderAvatar;
