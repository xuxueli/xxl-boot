/**
 * 页面：ResetPwd（修改密码）
 * 功能：旧密码、新密码、确认密码表单提交，修改当前登录用户密码
 */

import { ProForm, ProFormText } from '@ant-design/pro-components';
import { App, Button } from 'antd';
import type { Rule } from 'antd/es/form';
import React from 'react';
import { t } from '@/i18n';
import { updateUserPwd } from '@/modules/framework/authz/user/api';

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
  { required: true, message: t('common.requiredMsg', [t('authz.user.newPassword')]) },
  { min: 6, max: 20, message: t('authz.user.newPasswordLength') },
  { pattern: /^[^<>"'|\\]+$/, message: t('authz.user.newPasswordForbiddenChar') },
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
    message.success(t('common.updateSuccess'));
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
            {t('common.save')}
          </Button>,
          <Button
            type="default"
            key="cancel"
            onClick={() => form.resetFields()}
          >
            {t('common.reset')}
          </Button>,
        ],
      }}
    >
      <ProFormText.Password
        name="oldPassword"
        label={t('authz.user.oldPassword')}
        placeholder={t('common.inputPlaceholder', [t('authz.user.oldPassword')])}
        rules={[{ required: true, message: t('common.requiredMsg', [t('authz.user.oldPassword')]) }]}
      />
      <ProFormText.Password
        name="newPassword"
        label={t('authz.user.newPassword')}
        placeholder={t('common.inputPlaceholder', [t('authz.user.newPassword')])}
        rules={INFO_PWD_RULES}
      />
      <ProFormText.Password
        name="confirmPassword"
        label={t('authz.user.confirmPassword')}
        placeholder={t('authz.user.confirmPasswordPlaceholder')}
        dependencies={['newPassword']}
        rules={[
          { required: true, message: t('common.requiredMsg', [t('authz.user.confirmPassword')]) },
          ({ getFieldValue }) => ({
            /* 自定义规则：返回 Promise，处理异步操作； */
            validator: (_, value) => {
              if (!value || getFieldValue('newPassword') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error(t('authz.user.passwordMismatch')));
            },
          }),
        ]}
      />
    </ProForm>
  );
};

export default ResetPwd;
