/**
 * 组件：MessageFormModal（消息新增/编辑弹窗）
 * 功能：标题、分类、状态、富文本内容
 */
import {
  ModalForm,
  ProForm,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { App, Col, Row } from 'antd';
import React from 'react';
import { Editor } from '@/components';
import { addMessage, updateMessage } from '@/services/system/message';

const MessageFormModal = ({
  open,
  onOpenChange,
  current,
  categoryOptions = [],
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  current?: API.Message | null;
  categoryOptions?: { value: number; label: string }[];
  onSuccess?: () => void;
}) => {
  const { message } = App.useApp();

  const handleFinish = async (values: API.Message) => {
    const data = { ...values };
    delete data.addTime;
    delete data.updateTime;
    if (current?.id) {
      await updateMessage({ ...data, id: current.id });
    } else {
      await addMessage(data);
    }
    message.success('操作成功');
    onSuccess?.();
    return true;
  };

  return (
    <ModalForm<API.Message>
      title={current?.id ? '修改站内消息' : '新增站内消息'}
      width={780}
      open={open}
      onOpenChange={onOpenChange}
      modalProps={{ destroyOnHidden: true }}
      layout="horizontal"
      labelCol={{ flex: '100px' }}
      onFinish={handleFinish}
      initialValues={{ category: 0, status: 0, ...current }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <ProFormText
            name="title"
            label="标题"
            placeholder="请输入标题"
            rules={[{ required: true, message: '标题不能为空' }]}
          />
        </Col>
        <Col span={12}>
          <ProFormSelect
            name="category"
            label="分类"
            placeholder="请选择分类"
            options={categoryOptions}
            rules={[{ required: true, message: '请选择分类' }]}
          />
        </Col>
        <Col span={24}>
          <ProFormRadio.Group
            name="status"
            label="状态"
            options={[
              { value: 0, label: '正常' },
              { value: 1, label: '下线' },
            ]}
          />
        </Col>
        <Col span={24}>
          <ProForm.Item
            name="content"
            label="内容"
            rules={[{ required: true, message: '内容不能为空' }]}
          >
            <Editor minHeight={210} />
          </ProForm.Item>
        </Col>
      </Row>
    </ModalForm>
  );
};

export default MessageFormModal;
