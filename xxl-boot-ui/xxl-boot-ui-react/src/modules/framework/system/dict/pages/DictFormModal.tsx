/**
 * 组件：DictFormModal（字典类型新增/编辑弹窗）
 * 功能：字典名称、类型、状态、备注
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
import { addType, updateType } from '@/modules/framework/system/dict/api';

const DictFormModal = ({
  open,
  onOpenChange,
  current,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  current?: API.Dict | null;
  onSuccess?: () => void;
}) => {
  const { message } = App.useApp();

  const handleFinish = async (values: API.Dict) => {
    const data = { ...values };
    delete data.addTime;
    delete data.updateTime;
    if (current?.id) {
      await updateType({ ...data, id: current.id });
    } else {
      await addType(data);
    }
    message.success(t('common.saveSuccess'));
    onSuccess?.();
    return true;
  };

  return (
    <ModalForm<API.Dict>
      title={current?.id ? t('common.titleEdit', [t('system.dict.dictType')]) : t('common.titleAdd', [t('system.dict.dictType')])}
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
        label={t('system.dict.dictName')}
        placeholder={t('common.inputPlaceholder', [t('system.dict.dictName')])}
        rules={[{ required: true, message: t('common.requiredMsg', [t('system.dict.dictName')]) }]}
      />
      <ProFormText
        name="type"
        label={t('system.dict.dictType')}
        placeholder={t('common.inputPlaceholder', [t('system.dict.dictType')])}
        disabled={!!current?.id}
        rules={[
          { required: true, message: t('common.requiredMsg', [t('system.dict.dictType')]) },
          { min: 2, max: 100, message: t('system.dict.typeLength') },
          {
            pattern: /^[a-z][a-zA-Z0-9]*$/,
            message: t('system.dict.typePattern'),
          },
        ]}
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

export default DictFormModal;