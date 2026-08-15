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
import { getUserProfile } from '@/services/authz/user';
import ResetPwd from './ResetPwd';
import UserInfo from './UserInfo';

const Profile = () => {
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
        message.error('个人信息加载失败');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <PageContainer ghost title={false}>
      <Spin spinning={loading}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {/* 个人信息 */}
          <Card
            title="个人信息"
            style={{ width: 300, flexShrink: 0 }}
            styles={{ body: { paddingTop: 8 } }}
          >
            <Descriptions column={1} size="middle">
              <Descriptions.Item
                label={
                  <span>
                    <UserOutlined style={{ marginRight: 4 }} />
                    用户账号
                  </span>
                }
              >
                {user.username}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span>
                    <PhoneOutlined style={{ marginRight: 4 }} />
                    手机号码
                  </span>
                }
              >
                {user.phone || '-'}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span>
                    <MailOutlined style={{ marginRight: 4 }} />
                    用户邮箱
                  </span>
                }
              >
                {user.email || '-'}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span>
                    <TeamOutlined style={{ marginRight: 4 }} />
                    所属部门
                  </span>
                }
              >
                {user.orgName || '-'}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span>
                    <TeamOutlined style={{ marginRight: 4 }} />
                    所属角色
                  </span>
                }
              >
                {roleNames || '-'}
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <span>
                    <CalendarOutlined style={{ marginRight: 4 }} />
                    创建日期
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
                  label: '基本资料',
                  children: <UserInfo user={user} onSuccess={loadUser} />,
                },
                {
                  key: 'resetPwd',
                  label: '修改密码',
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
