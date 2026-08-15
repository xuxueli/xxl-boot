import { IdcardOutlined, LogoutOutlined, SkinOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Modal, Spin } from 'antd';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Dropdown from '@/components/Dropdown';
import { useSettingsStore } from '@/stores/settingsStore';
import { useUserStore } from '@/stores/userStore';

/**
 * 布局组件：HeaderAvatar（头像下拉）
 * 功能：顶部导航栏右侧头像，下拉提供个人中心、主题设置、退出登录
 */
type GlobalHeaderRightProps = {
  children?: React.ReactNode;
};

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

const HeaderAvatar = ({ children }: GlobalHeaderRightProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useUserStore((s) => s.currentUser);

  const onMenuClick: MenuProps['onClick'] = (event) => {
    const { key } = event;
    if (key === 'logout') {
      // 先提示确认，再执行退出
      Modal.confirm({
        title: '系统提示',
        content: '确定注销并退出系统吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          // 事件回调中直接调用 store action，避免为单次调用挂载 store 订阅
          await useUserStore.getState().logout();
          navigate('/login', {
            replace: true,
            state: { from: location.pathname },
          });
        },
      });
      return;
    }
    if (key === 'theme') {
      // 打开主题设置面板（SettingDrawer）
      useSettingsStore.getState().setSettingDrawerOpen(true);
      return;
    }
    navigate(`/user/${key}`);
  };

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
