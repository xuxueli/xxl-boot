/**
 * 页面：ResetPwd（修改密码）
 * 功能：旧密码、新密码、确认密码表单提交，修改当前登录用户密码
 */

import { ProForm, ProFormText } from '@ant-design/pro-components';
import type { Rule } from 'antd/es/form';
import { App, Button } from 'antd';
import React from 'react';
import { updateUserPwd } from '@/services/authz/user';

/** 密码表单数据 */
interface PwdForm {
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

/**
 * 新密码校验规则：必填 + 长度 6-20 + 任意字符（禁止 < > " ' \ |）
 * 说明：原设计按后端 chrtype（0-4）动态切换密码策略，但全项目无任何写入方，
 *       实际恒为默认策略 0（任意字符），故直接固定为一条规则。
 */
const INFO_PWD_RULES: Rule[] = [
  { required: true, message: '新密码不能为空' },
  { min: 6, max: 20, message: '新密码长度必须介于 6 和 20 之间' },
  { pattern: /^[^<>"'|\\]+$/, message: '密码不能包含非法字符：< > " \' \\ |' },
];

const ResetPwd = () => {
  const { message } = App.useApp();
  const [form] = ProForm.useForm();

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
      layout="horizontal"
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
        rules={INFO_PWD_RULES}
      />
      <ProFormText.Password
        name="confirmPassword"
        label="确认密码"
        placeholder="请确认新密码"
        dependencies={['newPassword']}
        rules={[
          { required: true, message: '确认密码不能为空' },
          ({ getFieldValue }) => ({
            /* 自定义规则：返回 Promise，处理异步操作； */
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
