/**
 * 组件：MessageFormModal（消息新增/编辑弹窗）
 * 功能：消息标题、分类、状态、富文本内容
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
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { addMessage, updateMessage } from '@/services/system/message';

const MessageFormModal = ({
  open,
  onOpenChange,
  current,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  current?: API.Message | null;
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
      title={current?.id ? '修改消息' : '新增消息'}
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
            label="消息标题"
            placeholder="请输入消息标题"
            rules={[{ required: true, message: '消息标题不能为空' }]}
          />
        </Col>
        <Col span={12}>
          <ProFormSelect
            name="category"
            label="消息分类"
            placeholder="请选择消息分类"
            options={[
              { value: 0, label: '通知' },
              { value: 1, label: '公告' },
            ]}
            rules={[{ required: true, message: '请选择消息分类' }]}
          />
        </Col>
        <Col span={24}>
          <ProFormRadio.Group
            name="status"
            label="消息状态"
            options={[
              { value: 0, label: '正常' },
              { value: 1, label: '下线' },
            ]}
          />
        </Col>
        <Col span={24}>
          <ProForm.Item
            name="content"
            label="消息内容"
            rules={[{ required: true, message: '消息内容不能为空' }]}
          >
            <ReactQuill
              theme="snow"
              style={{ minHeight: 192 }}
              placeholder="请输入消息内容"
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, false] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ list: 'ordered' }, { list: 'bullet' }],
                  ['link', 'image'],
                  ['clean'],
                ],
              }}
            />
          </ProForm.Item>
        </Col>
      </Row>
    </ModalForm>
  );
};

export default MessageFormModal;
