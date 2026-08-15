/**
 * 页面：ResetPwd（修改密码）
 * 功能：旧密码、新密码、确认密码表单提交，修改当前登录用户密码
 */

import { ProForm, ProFormText } from '@ant-design/pro-components';
import { App, Button } from 'antd';
import React from 'react';
import { usePasswordRule } from '@/hooks/usePasswordRule';
import { updateUserPwd } from '@/services/authz/user';

/** 密码表单数据 */
interface PwdForm {
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const ResetPwd: React.FC = () => {
  const { message } = App.useApp();
  const [form] = ProForm.useForm();
  const { infoPwdValidator } = usePasswordRule();

  /** 提交保存 */
  const handleSubmit = async (values: PwdForm) => {
    await updateUserPwd(
      values.oldPassword as string,
      values.newPassword as string,
    );
    message.success('修改成功');
    form.resetFields();
  };

  return (
    <ProForm<PwdForm>
      form={form}
      labelCol={{ span: 4 }}
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
        ],
      }}
    >
      <ProFormText.Password
        name="oldPassword"
        label="旧密码"
        placeholder="请输入旧密码"
        rules={[{ required: true, message: '旧密码不能为空' }]}
      />
      <ProFormText.Password
        name="newPassword"
        label="新密码"
        placeholder="请输入新密码"
        rules={infoPwdValidator}
      />
      <ProFormText.Password
        name="confirmPassword"
        label="确认密码"
        placeholder="请确认新密码"
        dependencies={['newPassword']}
        rules={[
          { required: true, message: '确认密码不能为空' },
          ({ getFieldValue }) => ({
            validator: (_, value) => {
              if (!value || getFieldValue('newPassword') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('两次输入的密码不一致'));
            },
          }),
        ]}
      />
    </ProForm>
  );
};

export default ResetPwd;
