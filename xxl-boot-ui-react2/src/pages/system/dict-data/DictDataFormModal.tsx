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
import { addData, updateData } from '@/services/system/dict';

const DictDataFormModal: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  current?: API.DictItem | null;
  dictId?: number;
  onSuccess?: () => void;
}> = ({ open, onOpenChange, current, dictId, onSuccess }) => {
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
    message.success('操作成功');
    onSuccess?.();
    return true;
  };

  return (
    <ModalForm<API.DictItem>
      title={current?.id ? '修改字典项' : '新增字典项'}
      width={500}
      open={open}
      onOpenChange={onOpenChange}
      modalProps={{ destroyOnClose: true }}
      onFinish={handleFinish}
      initialValues={{ status: 0, order: 1, ...current }}
    >
      <ProFormText
        name="name"
        label="字典项名称"
        placeholder="请输入字典项名称"
        rules={[{ required: true, message: '字典项名称不能为空' }]}
      />
      <ProFormText
        name="code"
        label="字典项编码"
        placeholder="请输入字典项编码"
        disabled={!!current?.id}
        rules={[
          { required: true, message: '字典项编码不能为空' },
          { pattern: /^[0-9]+$/, message: '编码必须为数字' },
        ]}
      />
      <ProFormRadio.Group
        name="status"
        label="状态"
        options={[
          { value: 0, label: '正常' },
          { value: 1, label: '停用' },
        ]}
      />
      <ProFormDigit
        name="order"
        label="显示排序"
        placeholder="请输入显示排序"
        min={0}
        rules={[{ required: true, message: '显示排序不能为空' }]}
        fieldProps={{ style: { width: '100%' } }}
      />
      <ProFormTextArea
        name="remark"
        label="备注"
        placeholder="请输入备注"
        fieldProps={{ rows: 2 }}
      />
    </ModalForm>
  );
};

export default DictDataFormModal;
