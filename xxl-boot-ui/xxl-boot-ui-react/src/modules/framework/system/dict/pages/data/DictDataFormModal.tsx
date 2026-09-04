/**
 * 组件：DictDataFormModal（字典项新增/编辑弹窗）
 * 功能：字典项名称、编码、状态、排序、备注
 */
import {
  ModalForm,
  ProFormDigit,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { App } from 'antd';
import React from 'react';
import { t } from '@/i18n';
import { addData, updateData } from '@/modules/framework/system/dict/api';

const DictDataFormModal = ({
  open,
  onOpenChange,
  current,
  dictId,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  current?: API.DictItem | null;
  dictId?: number;
  onSuccess?: () => void;
}) => {
  const { message } = App.useApp();

  const handleFinish = async (values: API.DictItem) => {
    const data = { ...values };
    delete data.addTime;
    delete data.updateTime;
    if (current?.id) {
      await updateData({ ...data, id: current.id });
    } else {
      await addData({ ...data, dictId });
    }
    message.success(t('common.saveSuccess'));
    onSuccess?.();
    return true;
  };

  return (
    <ModalForm<API.DictItem>
      title={current?.id ? t('common.titleEdit', [t('common.noun.dictItem')]) : t('common.titleAdd', [t('common.noun.dictItem')])}
      width={500}
      open={open}
      onOpenChange={onOpenChange}
      modalProps={{ destroyOnHidden: true }}
      layout="horizontal"
      labelCol={{ flex: '100px' }}
      onFinish={handleFinish}
      initialValues={{ status: 0, order: 1, ...current }}
    >
      <ProFormText
        name="name"
        label={t('system.dict.itemName')}
        placeholder={t('common.inputPlaceholder', [t('system.dict.itemName')])}
        rules={[{ required: true, message: t('common.requiredMsg', [t('system.dict.itemName')]) }]}
      />
      <ProFormText
        name="code"
        label={t('system.dict.itemCode')}
        placeholder={t('common.inputPlaceholder', [t('system.dict.itemCode')])}
        disabled={!!current?.id}
        rules={[
          { required: true, message: t('common.requiredMsg', [t('system.dict.itemCode')]) },
          { pattern: /^[0-9]+$/, message: t('system.dict.itemCodePattern') },
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
      <ProFormDigit
        name="order"
        label={t('system.dict.order')}
        placeholder={t('common.inputPlaceholder', [t('authz.resource.order')])}
        min={0}
        rules={[{ required: true, message: t('common.requiredMsg', [t('authz.resource.order')]) }]}
        fieldProps={{ style: { width: '100%' } }}
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

export default DictDataFormModal;