/**
 * @fileoverview FormModal（消息新增/编辑弹窗）
 * @description 标题、分类、状态、富文本内容
 * @author xuxueli 2026-11-21
 */
import {
  ModalForm,
  ProForm,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { App, Col, Row } from 'antd';
import { t } from '@/i18n';
import { Editor } from '@/components';
import { messageApi } from '@/modules/framework/system/message/api';

// ---------------------- 表单组件 ----------------------

const FormModal = ({
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

  // ---------------------- 表单状态 ----------------------

  // 有主键即编辑态：驱动弹窗标题与提交分支
  const isEdit = current?.id != null;

  // ---------------------- 数据操作 ----------------------

  /** 提交表单：有主键走修改，否则新增 */
  const handleFinish = async (values: API.MessageForm) => {
    if (isEdit) {
      await messageApi.update({ ...values, id: current?.id });
    } else {
      await messageApi.insert(values);
    }
    message.success(t('common.saveSuccess'));
    onSuccess?.();
    return true;
  };

  // ---------------------- 表单渲染 ----------------------

  return (
    <ModalForm<API.MessageForm>
      title={
        isEdit
          ? t('common.titleEdit', [t('common.noun.message')])
          : t('common.titleAdd', [t('common.noun.message')])
      }
      width={780}
      open={open}
      onOpenChange={onOpenChange}
      modalProps={{ destroyOnHidden: true, maskClosable: false }}
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

export default FormModal;