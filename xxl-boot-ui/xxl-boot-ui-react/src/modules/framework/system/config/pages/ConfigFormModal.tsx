/**
 * 组件：ConfigFormModal（配置新增/编辑弹窗）
 * 功能：配置名称、Key、Value、状态、备注
 */
import {
  ModalForm,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { App } from 'antd';
import React from 'react';
import { t } from '@/i18n';
import { addConfig, updateConfig } from '@/modules/framework/system/config/api';

const ConfigFormModal = ({
  open,
  onOpenChange,
  current,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  current?: API.Config | null;
  onSuccess?: () => void;
}) => {
  const { message } = App.useApp();

  const handleFinish = async (values: API.Config) => {
    const data = { ...values };
    delete data.addTime;
    delete data.updateTime;
    if (current?.id) {
      await updateConfig({ ...data, id: current.id });
    } else {
      await addConfig(data);
    }
    message.success(t('common.saveSuccess'));
    onSuccess?.();
    return true;
  };

  return (
    <ModalForm<API.Config>
      title={current?.id ? t('common.titleEdit', [t('common.noun.config')]) : t('common.titleAdd', [t('common.noun.config')])}
      width={500}
      open={open}
      onOpenChange={onOpenChange}
      modalProps={{ destroyOnHidden: true }}
      layout="horizontal"
      labelCol={{ flex: '100px' }}
      onFinish={handleFinish}
      initialValues={{ status: 0, ...current }}
    >
      <ProFormText
        name="name"
        label={t('system.config.configName')}
        placeholder={t('common.inputPlaceholder', [t('system.config.configName')])}
        rules={[{ required: true, message: t('common.requiredMsg', [t('system.config.configName')]) }]}
      />
      <ProFormText
        name="key"
        label={t('system.config.configKey')}
        placeholder={t('common.inputPlaceholder', [t('system.config.configKey')])}
        disabled={!!current?.id}
        rules={[
          { required: true, message: t('common.requiredMsg', [t('system.config.configKey')]) },
          { min: 4, max: 100, message: t('system.config.keyLength') },
          {
            pattern: /^[a-z][a-z0-9.]*$/,
            message: t('system.config.keyPattern'),
          },
        ]}
      />
      <ProFormTextArea
        name="value"
        label={t('system.config.configValue')}
        placeholder={t('common.inputPlaceholder', [t('system.config.configValue')])}
        rules={[{ required: true, message: t('common.requiredMsg', [t('system.config.configValue')]) }]}
        fieldProps={{ rows: 3 }}
      />
      <ProFormRadio.Group
        name="status"
        label={t('common.status')}
        options={[
          { value: 0, label: t('common.normal') },
          { value: 1, label: t('common.disabled') },
        ]}
      />
      <ProFormTextArea
        name="remark"
        label={t('common.remark')}
        placeholder={t('common.inputPlaceholder', [t('common.remark')])}
        fieldProps={{ rows: 2 }}
      />
    </ModalForm>
  );
};

export default ConfigFormModal;