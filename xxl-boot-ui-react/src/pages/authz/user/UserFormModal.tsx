/**
 * 组件：UserFormModal（用户新增/编辑弹窗）
 * 功能：新增/编辑用户表单，含角色多选、组织树选择、状态等字段
 */
import {
  ModalForm,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { App } from 'antd';
import React, { useEffect, useMemo } from 'react';
import { addUser, updateUser } from '@/services/authz/user';

/** 组织树转 TreeSelect 数据 */
const toTreeSelectData = (orgs: API.Org[]): any[] =>
  orgs.map((org) => ({
    title: org.name,
    value: org.id,
    children: org.children?.length ? toTreeSelectData(org.children) : undefined,
  }));

const UserFormModal = ({
  open,
  onOpenChange,
  current,
  roleOptions = [],
  orgOptions = [],
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  current?: API.User | null;
  roleOptions?: API.Role[];
  orgOptions?: API.Org[];
  onSuccess?: () => void;
}) => {
  const { message } = App.useApp();

  // 角色下拉（停用角色置灰）
  const roleSelectOptions = useMemo(
    () =>
      roleOptions.map((r) => ({
        value: r.id,
        label: r.name,
        disabled: r.status === 1,
      })),
    [roleOptions],
  );

  const orgTreeSelectData = useMemo(
    () => toTreeSelectData(orgOptions),
    [orgOptions],
  );

  /** 提交：剥离 UI 字段后新增或更新 */
  const handleFinish = async (values: API.User) => {
    const data: API.User = { ...values };
    delete data.addTime;
    delete data.updateTime;
    delete data.orgName;
    delete data.roleNames;
    // 后端约定：未选择组织时置 0
    data.orgId = data.orgId || 0;
    if (current?.id) {
      await updateUser({ ...data, id: current.id });
    } else {
      await addUser(data);
    }
    message.success('操作成功');
    onSuccess?.();
    return true;
  };

  useEffect(() => {
    if (open && !current) {
      // 新增默认值
    }
  }, [open, current]);

  return (
    <ModalForm<API.User>
      title={current?.id ? '修改用户' : '新增用户'}
      width={640}
      open={open}
      onOpenChange={onOpenChange}
      modalProps={{ destroyOnClose: true }}
      onFinish={handleFinish}
      initialValues={{
        status: 0,
        ...current,
        password: current?.id ? undefined : '123456',
        roleIds: current?.roleIds || [],
      }}
    >
      <ProFormText
        name="username"
        label="用户账号"
        placeholder="请输入用户账号"
        disabled={!!current?.id}
        rules={[
          { required: true, message: '用户账号不能为空' },
          {
            pattern: /^[a-z][a-z0-9]*$/,
            message: '小写字母开头，仅允许小写字母和数字',
          },
        ]}
      />
      {!current?.id && (
        <ProFormText.Password
          name="password"
          label="用户密码"
          placeholder="请输入用户密码"
          rules={[
            { required: true, message: '用户密码不能为空' },
            { min: 4, max: 20, message: '密码长度必须在 4 到 20 个字符' },
          ]}
        />
      )}
      <ProFormText
        name="realName"
        label="用户名称"
        placeholder="请输入用户名称"
        fieldProps={{ maxLength: 50 }}
        rules={[{ required: true, message: '用户名称不能为空' }]}
      />
      <ProFormSelect
        name="roleIds"
        label="角色"
        placeholder="请选择角色"
        mode="multiple"
        options={roleSelectOptions}
        fieldProps={{ optionDisabledProp: 'disabled' }}
      />
      <ProFormTreeSelect
        name="orgId"
        label="归属组织"
        placeholder="请选择组织"
        fieldProps={{
          treeData: orgTreeSelectData,
          treeDefaultExpandAll: true,
          allowClear: true,
        }}
      />
      <ProFormText
        name="email"
        label="邮箱"
        placeholder="请输入邮箱"
        fieldProps={{ maxLength: 100 }}
        rules={[{ type: 'email', message: '邮箱格式不正确' }]}
      />
      <ProFormText
        name="phone"
        label="手机号码"
        placeholder="请输入手机号码"
        fieldProps={{ maxLength: 20 }}
        rules={[
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: '手机号格式不正确',
          },
        ]}
      />
      <ProFormRadio.Group
        name="status"
        label="状态"
        options={[
          { value: 0, label: '正常' },
          { value: 1, label: '停用' },
        ]}
      />
    </ModalForm>
  );
};

export default UserFormModal;
