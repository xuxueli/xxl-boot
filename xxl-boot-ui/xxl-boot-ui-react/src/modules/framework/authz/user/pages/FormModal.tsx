/**
 * @fileoverview FormModal（用户新增/编辑弹窗）
 * @description 新增/编辑用户表单，含角色多选、组织树选择、状态等字段
 * @author xuxueli 2026-11-21
 */
import {
  ModalForm,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { App, Col, Row } from 'antd';
import { useMemo } from 'react';
import { t } from '@/i18n';
import { userApi } from '@/modules/framework/authz/user/api';

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

// ---------------------- 表单组件 ----------------------

const FormModal = ({
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

  // ---------------------- 表单状态 ----------------------

  // 有主键即编辑态：驱动弹窗标题、账号/密码字段与提交分支
  const isEdit = current?.id != null;

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

  // ---------------------- 数据操作 ----------------------

  /** 提交表单：有主键走修改，否则新增 */
  const handleFinish = async (values: API.UserForm) => {
    // 后端约定：未选择组织时置 0
    const data = { ...values, orgId: values.orgId || 0 };

    if (isEdit) {
      await userApi.update({ ...data, id: current?.id });
    } else {
      await userApi.add(data);
    }

    message.success(t('common.saveSuccess'));
    onSuccess?.();
    return true;
  };

  // ---------------------- 表单渲染 ----------------------

  return (
    /* 模态框 */
    <ModalForm<API.UserForm>
      title={
        isEdit
          ? t('common.titleEdit', [t('common.noun.user')])
          : t('common.titleAdd', [t('common.noun.user')])
      }
      width={640}
      open={open} /* 是否显示弹框 */
      onOpenChange={onOpenChange} /* 弹框显示状态变化触发 */
      modalProps={{ destroyOnHidden: true, maskClosable: false }}
      layout="horizontal"
      labelCol={{ flex: '90px' }}
      onFinish={handleFinish} /* 提交表单触发 */
      initialValues={{
        status: 0,
        ...current,
        password: isEdit ? undefined : '123456',
        roleIds: current?.roleIds || [],
      }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <ProFormText
            name="username"
            label={t('authz.user.username')}
            placeholder={t('common.inputPlaceholder', [t('authz.user.username')])}
            disabled={isEdit}
            rules={[
              { required: true, message: t('common.requiredMsg', [t('authz.user.username')]) },
              {
                pattern: /^[a-z][a-z0-9]*$/,
                message: t('authz.user.usernameFormat'),
              },
            ]}
          />
        </Col>
        {!isEdit && (
          <Col span={12}>
            <ProFormText.Password
              name="password"
              label={t('authz.user.password')}
              placeholder={t('common.inputPlaceholder', [t('authz.user.password')])}
              rules={[
                { required: true, message: t('common.requiredMsg', [t('authz.user.password')]) },
                { min: 6, max: 20, message: t('authz.user.passwordLength') },
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

export default FormModal;
