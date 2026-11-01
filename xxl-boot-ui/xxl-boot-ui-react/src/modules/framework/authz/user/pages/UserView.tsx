/**
 * 组件：UserView（用户详情抽屉）
 * 功能：展示用户基本信息、角色、状态与时间
 */
import { Descriptions, Drawer, Tag } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { t } from '@/i18n';
import { useEnumOption } from '@/hooks/useEnumOption';
import { listRole } from '@/modules/framework/authz/role/api';

/* 组件入参 */
interface UserViewProps {
  open: boolean;         /* 是否显示 */
  user: API.User | null; /* 当前用户 */
  onClose: () => void;   /* 关闭回调 */
}

/*
 * 组件：UserView（用户详情抽屉）
 * 功能：展示用户基本信息、角色、状态与时间
 */
function UserView({ open, user, onClose }: UserViewProps) {
  // 当前用户角色名称（由角色 ID 解析而来）
  const [roleNames, setRoleNames] = useState('');

  // 状态映射：文字来自后端枚举（UserStatuEnum），颜色按 code 区分（0 正常 success，其余 error）
  const userStatusOptions = useEnumOption('UserStatuEnum');
  const statusMap = useMemo(() => {
    const map: Record<number, { text: string; color: string }> = {};
    userStatusOptions.forEach((o) => {
      map[o.code] = {
        text: o.title || '',
        color: o.code === 0 ? 'success' : 'error',
      };
    });
    return map;
  }, [userStatusOptions]);

  /**
   * 解析角色 ID 为角色名称
   *
   *
   *  useCallback：
   *      - 定义： 缓存 “函数引用”，避免在组件重新渲染时重新创建函数实例。
   *      - 作用：useCallback 返回的是一个 memoized（记忆化）的函数，只有当依赖项发生变化时，才会返回新的函数实例。
   *      - 说明：当函数依赖于某些变量，并且这些变量在组件重新渲染时可能会改变时，可以使用 useCallback 来缓存函数。存在 2个 参数：
   *          - 1、要缓存的函数：当组件重新渲染时，缓存的函数不会被重新创建，除非依赖项发生变化。
   *          - 2、依赖项数组：当数组中的变量发生变化时，缓存的函数才会更新。
   *      - 使用示例：
   *      <pre>
   *          const memoizedCallback = useCallback(
   *          () => {
   *              // 这里是要缓存的函数逻辑
   *              doSomething(a, b);
   *          },
   *          [a, b], // 依赖项数组
   *          );
   *      </pre>
   *
   *
   *  useCallback 和 useMemo 区别：
   *      - useCallback：用于缓存函数引用，返回的是一个 memoized（记忆化）的函数。
   *      - useMemo：用于缓存计算结果，返回的是一个 memoized（记忆化）的值。
   *
   */
  const resolveRoleNames = useCallback(async (roleIds?: number[]) => {
    if (!roleIds || roleIds.length === 0) {
      setRoleNames(t('authz.user.noRole'));
      return;
    }
    try {
      const res = await listRole({ current: 1, pageSize: 999 });
      const all = res.data?.data || [];
      const names = all
        .filter((r) => roleIds.includes(r.id as number))
        .map((r) => r.name)
        .join(t('authz.user.roleJoin'));
      setRoleNames(names || t('authz.user.noRole'));
    } catch {
      setRoleNames(t('authz.user.noRole'));
    }
  }, []);

  /* 打开抽屉或切换用户时解析角色名称 */
  useEffect(() => {
    if (!open) return;
    resolveRoleNames(user?.roleIds);
  }, [open, user, resolveRoleNames]);

  // 解析用户状态
  const status = user ? statusMap[user.status ?? -1] : undefined;

  return (
    /* 抽屉详情 */
    <Drawer
      title={t('authz.user.detailTitle')}
      size={680}
      open={open}
      onClose={onClose}
      destroyOnHidden
    >
      {user && (
        /* 用户详情 */
        <Descriptions column={1} size="middle" bordered>
          <Descriptions.Item label={t('authz.user.id')}>{user.id}</Descriptions.Item>
          <Descriptions.Item label={t('authz.user.account')}>
            {user.username}
          </Descriptions.Item>
          <Descriptions.Item label={t('common.realName')}>
            {user.realName}
          </Descriptions.Item>
          <Descriptions.Item label={t('authz.user.dept')}>
            {user.orgName || '-'}
          </Descriptions.Item>
          <Descriptions.Item label={t('authz.user.phoneNumber')}>
            {user.phone || '-'}
          </Descriptions.Item>
          <Descriptions.Item label={t('authz.user.emailLabel')}>
            {user.email || '-'}
          </Descriptions.Item>
          <Descriptions.Item label={t('authz.user.statusLabel')}>
            {status ? <Tag color={status.color}>{status.text}</Tag> : '-'}
          </Descriptions.Item>
          <Descriptions.Item label={t('authz.user.roleLabel')}>{roleNames}</Descriptions.Item>
          <Descriptions.Item label={t('common.createTime')}>
            {user.addTime || '-'}
          </Descriptions.Item>
          <Descriptions.Item label={t('common.updateTime')}>
            {user.updateTime || '-'}
          </Descriptions.Item>
        </Descriptions>
      )}
    </Drawer>
  );
}

export default UserView;
