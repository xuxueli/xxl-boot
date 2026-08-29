/**
 * 页面：UserInfo（基本资料编辑）
 * 功能：编辑用户名称、手机号、邮箱
 */

import { ProForm, ProFormText } from '@ant-design/pro-components';
import { App, Button } from 'antd';
import React from 'react';
import { updateUserProfile } from '@/services/authz/user';
import { closePage } from '@/utils/common';

/** 基本资料表单数据 */
interface UserInfoForm {
  realName?: string;
  phone?: string;
  email?: string;
}

const UserInfo = ({
  user,
  onSuccess,
}: {
  user?: API.User;
  onSuccess?: () => void;
}) => {
  const { message } = App.useApp();
  const [form] = ProForm.useForm();

  // 用户信息未加载完成前不渲染表单，确保 initialValues 能正确回显
  if (!user?.username) {
    return null;
  }

  /** 提交保存 */
  const handleSubmit = async (values: UserInfoForm) => {
    await updateUserProfile(values as API.User);
    message.success('修改成功');
    onSuccess?.();
  };

  return (
    <ProForm<API.User>
      form={form}
      labelCol={{ span: 4 }}
      initialValues={{
        realName: user.realName,
        email: user.email,
        phone: user.phone,
      }}
      onFinish={handleSubmit}
      submitter={{
        render: ({ submit }) => [
          <Button type="primary" key="submit" onClick={() => submit()}>
            保存
          </Button>,
          <Button
            type="default"
            key="cancel"
            onClick={() => form.resetFields()}
          >
            重置
          </Button>,
          <Button key="close" onClick={closePage}>
            关闭
          </Button>,
        ],
      }}
    >
      <ProFormText
        name="realName"
        label="用户名称"
        placeholder="请输入用户名称"
        fieldProps={{ maxLength: 30 }}
        rules={[{ required: true, message: '用户名称不能为空' }]}
      />
      <ProFormText
        name="phone"
        label="手机号码"
        placeholder="请输入手机号码"
        fieldProps={{ maxLength: 11 }}
        rules={[
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: '手机号格式不正确',
          },
        ]}
      />
      <ProFormText
        name="email"
        label="邮箱"
        placeholder="请输入邮箱"
        fieldProps={{ maxLength: 100 }}
        rules={[{ type: 'email', message: '邮箱格式不正确' }]}
      />
    </ProForm>
  );
};

export default UserInfo;
