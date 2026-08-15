/**
 * 组件：ConfigFormModal（配置新增/编辑弹窗）
 * 功能：配置名称、key、值、状态、备注
 */
import {
  ModalForm,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { App } from 'antd';
import React from 'react';
import { addConfig, updateConfig } from '@/services/system/config';

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
    message.success('操作成功');
    onSuccess?.();
    return true;
  };

  return (
    <ModalForm<API.Config>
      title={current?.id ? '修改配置' : '新增配置'}
      width={500}
      open={open}
      onOpenChange={onOpenChange}
      modalProps={{ destroyOnClose: true }}
      onFinish={handleFinish}
      initialValues={{ status: 0, ...current }}
    >
      <ProFormText
        name="name"
        label="配置名称"
        placeholder="请输入配置名称"
        rules={[{ required: true, message: '配置名称不能为空' }]}
      />
      <ProFormText
        name="key"
        label="配置键名"
        placeholder="请输入配置键名"
        disabled={!!current?.id}
        rules={[
          { required: true, message: '配置键名不能为空' },
          { min: 4, max: 100, message: '配置键名长度必须在 4 到 100 个字符' },
          {
            pattern: /^[a-z][a-z0-9.]*$/,
            message: '小写字母开头，仅允许小写字母、数字和点',
          },
        ]}
      />
      <ProFormTextArea
        name="value"
        label="配置值"
        placeholder="请输入配置值"
        rules={[{ required: true, message: '配置值不能为空' }]}
        fieldProps={{ rows: 3 }}
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

export default ConfigFormModal;
