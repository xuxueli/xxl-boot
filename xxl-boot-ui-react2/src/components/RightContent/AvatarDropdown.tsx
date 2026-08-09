import { IdcardOutlined, LogoutOutlined, SkinOutlined } from '@ant-design/icons';
import { history, useModel } from '@umijs/max';
import type { MenuProps } from 'antd';
import { Modal, Spin } from 'antd';
import React, { startTransition } from 'react';
import useUser from '@/models/user';
import HeaderDropdown from '../HeaderDropdown';

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
  const { initialState, setInitialState } = useModel('@@initialState');
  const { logout } = useUser();
  const currentUser = initialState?.currentUser;

  const loginOut = async () => {
    await logout();
    const { search, pathname } = window.location;
    const urlParams = new URL(window.location.href).searchParams;
    const searchParams = new URLSearchParams({
      redirect: pathname + search,
    });
    const redirect = urlParams.get('redirect');
    if (window.location.pathname !== '/user/login' && !redirect) {
      history.replace({
        pathname: '/user/login',
        search: searchParams.toString(),
      });
    }
  };

  const onMenuClick: MenuProps['onClick'] = (event) => {
    const { key } = event;
    if (key === 'logout') {
      // 先提示确认，再执行退出
      Modal.confirm({
        title: '系统提示',
        content: '确定注销并退出系统吗？',
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          startTransition(() => {
            setInitialState((s) => ({ ...s, currentUser: undefined }));
          });
          loginOut();
        },
      });
      return;
    }
    if (key === 'theme') {
      // 打开主题设置面板（SettingDrawer）
      setInitialState((s) => ({ ...s, settingDrawerOpen: true }));
      return;
    }
    history.push(`/user/${key}`);
  };

  if (!initialState || !currentUser) {
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
