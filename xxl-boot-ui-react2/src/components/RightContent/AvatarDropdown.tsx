import { IdcardOutlined, LogoutOutlined, SkinOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Modal, Spin } from 'antd';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import HeaderDropdown from '@/components/HeaderDropdown';
import { useSettingsStore } from '@/stores/settingsStore';
import { useUserStore } from '@/stores/userStore';

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

export const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({
  children,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useUserStore((s) => s.currentUser);
  const logout = useUserStore((s) => s.logout);
  const setSettingDrawerOpen = useSettingsStore((s) => s.setSettingDrawerOpen);

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
          await logout();
          navigate('/user/login', {
            replace: true,
            state: { from: location.pathname },
          });
        },
      });
      return;
    }
    if (key === 'theme') {
      // 打开主题设置面板（SettingDrawer）
      setSettingDrawerOpen(true);
      return;
    }
    navigate(`/user/${key}`);
  };

  if (!currentUser) {
    return <Spin size="small" />;
  }

  return (
    <HeaderDropdown
      placement="bottomRight"
      menu={{
        selectedKeys: [],
        onClick: onMenuClick,
        items: menuItems,
      }}
      arrow
    >
      {children}
    </HeaderDropdown>
  );
};
