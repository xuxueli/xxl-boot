/**
 * 组件：UserView（用户详情抽屉）
 * 功能：展示用户基本信息、角色、状态与时间
 */
import { Descriptions, Drawer, Tag } from 'antd';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import { listRole } from '@/services/authz/role';

export type UserViewRef = {
  open: (row: API.User) => void;
};

/** 状态文案映射 */
const statusMap: Record<number, { text: string; color: string }> = {
  0: { text: '正常', color: 'success' },
  1: { text: '停用', color: 'error' },
};

const UserView = forwardRef<UserViewRef>((_, ref) => {
  const [visible, setVisible] = useState(false);
  const [user, setUser] = useState<API.User | null>(null);
  const [roleNames, setRoleNames] = useState('');

  /** 解析角色 ID 为角色名称 */
  const resolveRoleNames = useCallback(async (roleIds?: number[]) => {
    if (!roleIds || roleIds.length === 0) {
      setRoleNames('无角色');
      return;
    }
    try {
      const res = await listRole({ current: 1, pageSize: 999 });
      const all = res.data?.data || [];
      const names = all
        .filter((r) => roleIds.includes(r.id as number))
        .map((r) => r.name)
        .join('、');
      setRoleNames(names || '无角色');
    } catch {
      setRoleNames('无角色');
    }
  }, []);

  const open = useCallback(
    (row: API.User) => {
      setUser(row);
      setVisible(true);
      resolveRoleNames(row.roleIds);
    },
    [resolveRoleNames],
  );

  useImperativeHandle(ref, () => ({ open }));

  const status = user ? statusMap[user.status ?? -1] : undefined;

  return (
    <Drawer
      title="用户详情"
      size={680}
      open={visible}
      onClose={() => setVisible(false)}
      destroyOnClose
    >
      {user && (
        <Descriptions column={1} size="middle" bordered>
          <Descriptions.Item label="用户编号">{user.id}</Descriptions.Item>
          <Descriptions.Item label="用户账号">
            {user.username}
          </Descriptions.Item>
          <Descriptions.Item label="用户名称">
            {user.realName}
          </Descriptions.Item>
          <Descriptions.Item label="所属部门">
            {user.orgName || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="手机号码">
            {user.phone || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="用户邮箱">
            {user.email || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="帐号状态">
            {status ? <Tag color={status.color}>{status.text}</Tag> : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="所属角色">{roleNames}</Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {user.addTime || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="更新时间">
            {user.updateTime || '-'}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Drawer>
  );
});

export default UserView;
