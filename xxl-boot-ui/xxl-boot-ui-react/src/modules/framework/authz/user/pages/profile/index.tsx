/**
 * 页面：Profile（个人中心）
 * 功能：展示个人信息与基本资料/修改密码 tab 切换
 */
import {
  CalendarOutlined,
  MailOutlined,
  PhoneOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { PageContainer, ProCard } from '@ant-design/pro-components';
import { App, Card, Descriptions, Spin, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { t } from '@/i18n';
import { getUserProfile } from '@/modules/framework/authz/user/api';
import ResetPwd from './ResetPwd';
import UserInfo from './UserInfo';

const Profile = () => {
  /**
   *
   *  App.useApp();
   *      - 引用：Ant Design 引入的，基于 React Context 的静态方法调用方式‌。
   *      - 作用：提供全局的 message、notification、modal 等组件的调用方式，方便在函数组件中使用。
   *
   *
   *  useState：
   *      - ‌定义‌：useState 是一个特殊的函数，用于在函数组件中声明一个状态变量。
   *      - ‌作用‌：让函数组件拥有“记忆”能力。当状态改变时，React 会重新渲染组件，并保留最新的状态值。
   *      - ‌命名规范‌：所有 Hook 都以 use 开头，这是 React 的约定，有助于识别哪些函数是 Hook。
   *      - 基本语法：` const [state, setState] = useState(initialState); `
   *          - state：当前状态的值。
   *          - setState：用于更新状态的函数，调用它会触发组件重新渲染。
   *          - initialState：状态的初始值。可以是数字、字符串、对象、数组等任意类型。
   */
  const { message } = App.useApp();
  const [user, setUser] = useState<API.User>({});
  const [roleNames, setRoleNames] = useState('');
  const [loading, setLoading] = useState(false);

  /** 获取当前登录用户个人信息 */
  const loadUser = () => {
    setLoading(true);
    getUserProfile()
      .then((res) => {
        setUser(res.data || {});
        setRoleNames(((res.data?.roleNames as string[]) || []).join(', '));
      })
      .catch(() => {
        message.error(t('authz.user.loadProfileError'));
      })
      .finally(() => {
        setLoading(false);
      });
  };

  /**
   *  useEffect：
   *      - 定义：useEffect 是 React 提供的一个 Hook，用于在函数组件中执行‌副作用（Side Effects）‌操作。连接 React 声明式组件与外部命令式系统（如 API、DOM、定时器等）的桥梁。
   *      - 作用：处理副作用（指不直接影响组件渲染的操作），如数据获取、订阅、手动操作 DOM 等。它可以替代类组件中的生命周期方法（如 componentDidMount、componentDidUpdate 和 componentWillUnmount）。
   *      - 说明：useEffect 会在组件渲染后执行传入的副作用函数。它可以接收两个参数：一个函数和一个依赖数组。
   *          - ‌副作用函数（Effect Function）‌：副作用函数，在组件渲染后执行。可以在函数中执行异步操作、订阅事件等。该函数可以返回一个**清理函数（Cleanup Function用于在组件卸载或依赖变化时清除副作用。
   *          - 依赖数组（Dependencies Array）‌：一个可选的数组，包含副作用函数依赖的变量。当数组中的变量发生变化时，副作用函数会重新执行。如果数组为空，则副作用函数只会在组件挂载和卸载时执行一次。
   *      - 基本语法：
   *          <pre>
   *              useEffect(() => {
   *                  // 副作用逻辑：如更新浏览器标签页标题
   *                  document.title = `你点击了 ${count} 次`;
   *              }, [依赖变量]);     // 如当 count 变化时执行
   *          </pre>
   *
   */
  useEffect(() => {
    loadUser();
  }, []);

  return (
    <PageContainer ghost title={false}>
      <Spin spinning={loading}>
        <div style={{ display: 'flex', gap: 16 }}>
          {/* 个人信息 */}
          <Card
            title={t('authz.user.personalInfo')}
            style={{ width: 300, flexShrink: 0 }}
            styles={{ body: { paddingTop: 8 } }}
          >
            <Descriptions column={1} size="middle">
              <Descriptions.Item
                label={
                  <span>
                    <UserOutlined style={{ marginRight: 4 }} />
                    {t('authz.user.account')}
                  </span>
                }
              >
                {user.username}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span>
                    <PhoneOutlined style={{ marginRight: 4 }} />
                    {t('authz.user.phoneNumber')}
                  </span>
                }
              >
                {user.phone || '-'}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span>
                    <MailOutlined style={{ marginRight: 4 }} />
                    {t('authz.user.emailLabel')}
                  </span>
                }
              >
                {user.email || '-'}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span>
                    <TeamOutlined style={{ marginRight: 4 }} />
                    {t('authz.user.dept')}
                  </span>
                }
              >
                {user.orgName || '-'}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span>
                    <TeamOutlined style={{ marginRight: 4 }} />
                    {t('authz.user.roleLabel')}
                  </span>
                }
              >
                {roleNames || '-'}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span>
                    <CalendarOutlined style={{ marginRight: 4 }} />
                    {t('authz.user.createDate')}
                  </span>
                }
              >
                {user.addTime || '-'}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* 基本资料 / 修改密码 */}
          <ProCard
            style={{ flex: 1, minWidth: 420 }}
            styles={{ body: { paddingTop: 8 } }}
          >
            <Tabs
              defaultActiveKey="userinfo"
              items={[
                {
                  key: 'userinfo',
                  label: t('authz.user.basicInfo'),
                  children: <UserInfo user={user} onSuccess={loadUser} />,
                },
                {
                  key: 'resetPwd',
                  label: t('authz.user.modifyPassword'),
                  children: <ResetPwd />,
                },
              ]}
            />
          </ProCard>
        </div>
      </Spin>
    </PageContainer>
  );
};

export default Profile;
