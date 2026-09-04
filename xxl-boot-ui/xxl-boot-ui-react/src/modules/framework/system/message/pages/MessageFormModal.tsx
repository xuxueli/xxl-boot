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
import { t } from '@/i18n';
import { Editor } from '@/components';
import { addMessage, updateMessage } from '@/modules/framework/system/message/api';

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
    message.success(t('common.saveSuccess'));
    onSuccess?.();
    return true;
  };

  return (
    <ModalForm<API.Message>
      title={
        current?.id
          ? t('common.titleEdit', [t('layout.header.messageTitle')])
          : t('common.titleAdd', [t('layout.header.messageTitle')])
      }
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
            label={t('system.message.title')}
            placeholder={t('common.inputPlaceholder', [t('system.message.title')])}
            rules={[{ required: true, message: t('common.requiredMsg', [t('system.message.title')]) }]}
          />
        </Col>
        <Col span={12}>
          <ProFormSelect
            name="category"
            label={t('system.message.category')}
            placeholder={t('common.selectPlaceholderText', [t('system.message.category')])}
            options={categoryOptions}
            rules={[{ required: true, message: t('common.selectPlaceholderText', [t('system.message.category')]) }]}
          />
        </Col>
        <Col span={24}>
          <ProFormRadio.Group
            name="status"
            label={t('common.status')}
            options={[
              { value: 0, label: t('common.normal') },
              { value: 1, label: t('system.message.offline') },
            ]}
          />
        </Col>
        <Col span={24}>
          <ProForm.Item
            name="content"
            label={t('system.message.content')}
            rules={[{ required: true, message: t('common.requiredMsg', [t('system.message.content')]) }]}
          >
            <Editor minHeight={210} />
          </ProForm.Item>
        </Col>
      </Row>
    </ModalForm>
  );
};

export default MessageFormModal;