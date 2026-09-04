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
import { App, Col, Row } from 'antd';
import React, { useEffect, useMemo } from 'react';
import { t } from '@/i18n';
import { addUser, updateUser } from '@/modules/framework/authz/user/api';

/**
 * 组织树转 TreeSelect 数据
 */
const toTreeSelectData = (orgs: API.Org[]): any[] =>
  orgs.map((org) => ({
    title: org.name,
    value: org.id,
    children: org.children?.length ? toTreeSelectData(org.children) : undefined,
  }));

/*
 * 用户新增/编辑弹窗
 */
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

  // 组织树选择数据
  const orgTreeSelectData = useMemo(
    () => toTreeSelectData(orgOptions),
    [orgOptions],
  );

  /** 提交API请求 */
  const handleFinish = async (values: API.User) => {
    // 剥离 UI 字段后新增或更新
    const data: API.User = { ...values };
    delete data.addTime;
    delete data.updateTime;
    delete data.orgName;
    delete data.roleNames;
    // 后端约定：未选择组织时置 0
    data.orgId = data.orgId || 0;

    // 新增或更新
    if (current?.id) {
      await updateUser({ ...data, id: current.id });
    } else {
      await addUser(data);
    }

    message.success(t('common.operationSuccess'));
    onSuccess?.();
    return true;
  };

  // 打开弹窗时，若是新增则设置默认值
  useEffect(() => {
    if (open && !current) {
      // 新增默认值
    }
  }, [open, current]);

  return (
    /* 模态框 */
    <ModalForm<API.User>
      title={current?.id ? t('common.titleEdit', [t('common.noun.user')]) : t('common.titleAdd', [t('common.noun.user')])}
      width={640}
      open={open} /* 是否显示弹框 */
      onOpenChange={onOpenChange} /* 弹框显示状态变化触发 */
      modalProps={{ destroyOnHidden: true }} /* 弹框关闭时销毁子元素 */
      layout="horizontal"
      labelCol={{ flex: '90px' }}
      onFinish={handleFinish} /* 提交表单触发 */
      initialValues={{
        status: 0,
        ...current,
        password: current?.id ? undefined : '123456',
        roleIds: current?.roleIds || [],
      }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <ProFormText
            name="username"
            label={t('authz.user.username')}
            placeholder={t('common.inputPlaceholder', [t('authz.user.username')])}
            disabled={!!current?.id}
            rules={[
              { required: true, message: t('common.requiredMsg', [t('authz.user.username')]) },
              {
                pattern: /^[a-z][a-z0-9]*$/,
                message: t('authz.user.usernameFormat'),
              },
            ]}
          />
        </Col>
        {!current?.id && (
          <Col span={12}>
            <ProFormText.Password
              name="password"
              label={t('authz.user.password')}
              placeholder={t('common.inputPlaceholder', [t('authz.user.password')])}
              rules={[
                { required: true, message: t('common.requiredMsg', [t('authz.user.password')]) },
                { min: 4, max: 20, message: t('authz.user.passwordLength') },
              ]}
            />
          </Col>
        )}
        <Col span={12}>
          <ProFormText
            name="realName"
            label={t('common.realName')}
            placeholder={t('common.inputPlaceholder', [t('common.realName')])}
            fieldProps={{ maxLength: 50 }}
            rules={[{ required: true, message: t('common.requiredMsg', [t('common.realName')]) }]}
          />
        </Col>
        <Col span={12}>
          <ProFormSelect
            name="roleIds"
            label={t('authz.user.role')}
            placeholder={t('common.selectPlaceholderText', [t('authz.user.role')])}
            mode="multiple"
            options={roleSelectOptions}
            fieldProps={{ optionDisabledProp: 'disabled' }}
          />
        </Col>
        <Col span={12}>
          <ProFormTreeSelect
            name="orgId"
            label={t('authz.user.belongOrg')}
            placeholder={t('common.selectPlaceholderText', [t('common.noun.org')])}
            fieldProps={{
              treeData: orgTreeSelectData,
              treeDefaultExpandAll: true,
              allowClear: true,
            }}
          />
        </Col>
        <Col span={12}>
          <ProFormText
            name="email"
            label={t('authz.user.email')}
            placeholder={t('common.inputPlaceholder', [t('authz.user.email')])}
            fieldProps={{ maxLength: 100 }}
            rules={[{ type: 'email', message: t('authz.user.emailInvalid') }]}
          />
        </Col>
        <Col span={12}>
          <ProFormText
            name="phone"
            label={t('authz.user.phone')}
            placeholder={t('common.inputPlaceholder', [t('authz.user.phone')])}
            fieldProps={{ maxLength: 11 }}
            rules={[
              {
                pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
                message: t('authz.user.mobileInvalid'),
              },
            ]}
          />
        </Col>
        <Col span={12}>
          <ProFormRadio.Group
            name="status"
            label={t('common.status')}
            options={[
              { value: 0, label: t('common.normal') },
              { value: 1, label: t('common.disabled') },
            ]}
          />
        </Col>
      </Row>
    </ModalForm>
  );
};

export default UserFormModal;
