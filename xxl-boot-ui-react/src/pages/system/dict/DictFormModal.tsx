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
import { addType, updateType } from '@/services/system/dict';

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
    message.success('操作成功');
    onSuccess?.();
    return true;
  };

  return (
    <ModalForm<API.Dict>
      title={current?.id ? '修改字典类型' : '新增字典类型'}
      width={500}
      open={open}
      onOpenChange={onOpenChange}
      modalProps={{ destroyOnClose: true }}
      onFinish={handleFinish}
      initialValues={{ status: 0, ...current }}
    >
      <ProFormText
        name="name"
        label="字典名称"
        placeholder="请输入字典名称"
        rules={[{ required: true, message: '字典名称不能为空' }]}
      />
      <ProFormText
        name="type"
        label="字典类型"
        placeholder="请输入字典类型"
        disabled={!!current?.id}
        rules={[
          { required: true, message: '字典类型不能为空' },
          { min: 2, max: 100, message: '字典类型长度必须在 2 到 100 个字符' },
          {
            pattern: /^[a-z][a-zA-Z0-9]*$/,
            message: '小写字母开头，仅允许字母和数字',
          },
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
      <ProFormTextArea
        name="remark"
        label="备注"
        placeholder="请输入备注"
        fieldProps={{ rows: 2 }}
      />
    </ModalForm>
  );
};

export default DictFormModal;
