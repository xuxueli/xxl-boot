/**
 * 页面：UserInfo（基本资料编辑）
 * 功能：编辑用户名称、手机号、邮箱
 */

import { ProForm, ProFormText } from '@ant-design/pro-components';
import { App, Button } from 'antd';
import React from 'react';
import { t } from '@/i18n';
import { updateUserProfile } from '@/modules/framework/authz/user/api';
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
  /**
   *   React 组件父子通讯：
   *     - 方向：单向数据流
   *     - 数据传递方式：
   *       - 父组件向子组件传值（Props Down）：父组件通过属性（Props）将数据传递给子组件。
   *       - 子组件向父组件传值（Events Up）：父组件传递一个 “回调函数” 给子组件，子组件在适当时机调用该函数，并将数据作为参数传入。
   *       - 兄弟/跨层传值：共享状态放在公共祖先或全局 store 中。
   */
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
    message.success(t('common.updateSuccess'));
    onSuccess?.();
  };

  return (
    <ProForm<API.User>
      form={form}
      layout="horizontal"
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
            {t('common.save')}
          </Button>,
          <Button
            type="default"
            key="cancel"
            onClick={() => form.resetFields()}
          >
            {t('common.reset')}
          </Button>,
          <Button key="close" onClick={closePage}>
            {t('common.close')}
          </Button>,
        ],
      }}
    >
      <ProFormText
        name="realName"
        label={t('common.realName')}
        placeholder={t('common.inputPlaceholder', [t('common.realName')])}
        fieldProps={{ maxLength: 30 }}
        rules={[{ required: true, message: t('common.requiredMsg', [t('common.realName')]) }]}
      />
      <ProFormText
        name="phone"
        label={t('authz.user.phoneNumber')}
        placeholder={t('common.inputPlaceholder', [t('authz.user.phoneNumber')])}
        fieldProps={{ maxLength: 11 }}
        rules={[
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: t('authz.user.mobileInvalid'),
          },
        ]}
      />
      <ProFormText
        name="email"
        label={t('authz.user.email')}
        placeholder={t('common.inputPlaceholder', [t('authz.user.email')])}
        fieldProps={{ maxLength: 100 }}
        rules={[{ type: 'email', message: t('authz.user.emailInvalid') }]}
      />
    </ProForm>
  );
};

export default UserInfo;
