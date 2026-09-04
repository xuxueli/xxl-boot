/**
 * 组件：UserView（用户详情抽屉）
 * 功能：展示用户基本信息、角色、状态与时间
 */
import { Descriptions, Drawer, Tag } from 'antd';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react';
import { useEnumOption } from '@/hooks/useEnumOption';
import { listRole } from '@/modules/framework/authz/role/api';

/*
 * 组件引用类型
 *    - open: 打开详情抽屉，传入用户数据
 */
export type UserViewRef = {
  open: (row: API.User) => void;
};

/*
 * 组件：UserView（用户详情抽屉）
 * 功能：展示用户基本信息、角色、状态与时间
 */
const UserView = forwardRef<UserViewRef>((_, ref) => {
  // 组件状态
  const [visible, setVisible] = useState(false);
  // 当前用户数据
  const [user, setUser] = useState<API.User | null>(null);
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

  /*
   * 打开详情抽屉
   */
  const open = useCallback(
    (row: API.User) => {
      setUser(row);
      setVisible(true);
      resolveRoleNames(row.roleIds);
    },
    [resolveRoleNames],
  );

  /*
   * 打开详情抽屉：暴露给父组件的 ref 方法
   *
   *
   * useImperativeHandle：
   *       - 定义：自定义暴露给父组件的 ref 方法。
   *       - 作用：允许父组件通过 ref 调用子组件的内部方法或访问子组件的状态。
   *       - 说明：useImperativeHandle 接收两个参数：
   *           - 1、ref：父组件传入的 ref 对象。从 forwardRef 接收到的第二个参数。
   *           - 2、createHandle：一个函数，返回一个对象，该对象包含要暴露给父组件的方法或属性。
   *       - 使用示例：
   *         <pre>
   *             useImperativeHandle(ref, () => ({
   *                open: () => {
   *                     // 这里是要暴露给父组件的方法逻辑
   *                     setVisible(true);
   *                 }
   *           }));
   *        </pre>
   */
  useImperativeHandle(ref, () => ({ open }));

  // 解析用户状态
  const status = user ? statusMap[user.status ?? -1] : undefined;

  return (
    /* 抽屉详情 */
    <Drawer
      title="用户详情"
      size={680}
      open={visible}
      onClose={() => setVisible(false)}
      destroyOnHidden
    >
      {user && (
        /* 用户详情 */
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
