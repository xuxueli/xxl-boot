/**
 * @fileoverview FormModal（字典项新增/编辑弹窗）
 * @description 字典项名称、编码、状态、排序、备注
 * @author xuxueli 2026-11-21
 */
import {
  ModalForm,
  ProFormDigit,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { App } from 'antd';
import { t } from '@/i18n';
import { dictApi } from '@/modules/framework/system/dict/api';

// ---------------------- 表单组件 ----------------------

const FormModal = ({
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

  // ---------------------- 表单状态 ----------------------

  // 有主键即编辑态：驱动弹窗标题、编码不可改与提交分支
  const isEdit = current?.id != null;

  // ---------------------- 数据操作 ----------------------

  /** 提交表单：有主键走修改，否则新增 */
  const handleFinish = async (values: API.DictItemForm) => {
    if (isEdit) {
      await dictApi.itemUpdate({ ...values, id: current?.id });
    } else {
      await dictApi.itemInsert({ ...values, dictId });
    }
    message.success(t('common.saveSuccess'));
    onSuccess?.();
    return true;
  };

  // ---------------------- 表单渲染 ----------------------

  return (
    <ModalForm<API.DictItemForm>
      title={
        isEdit
          ? t('common.titleEdit', [t('common.noun.dictItem')])
          : t('common.titleAdd', [t('common.noun.dictItem')])
      }
      width={500}
      open={open}
      onOpenChange={onOpenChange}
      modalProps={{ destroyOnHidden: true, mask: { closable: false } }}
      layout="horizontal"
      labelCol={{ flex: '100px' }}
      onFinish={handleFinish}
      initialValues={{ status: 0, order: 1, ...current }}
    >
      <ProFormText
        name="name"
        label={t('system.dict.itemName')}
        placeholder={t('common.inputPlaceholder', [t('system.dict.itemName')])}
        rules={[
          {
            required: true,
            message: t('common.requiredMsg', [t('system.dict.itemName')]),
          },
        ]}
      />
      <ProFormText
        name="code"
        label={t('system.dict.itemCode')}
        placeholder={t('common.inputPlaceholder', [t('system.dict.itemCode')])}
        disabled={isEdit}
        rules={[
          {
            required: true,
            message: t('common.requiredMsg', [t('system.dict.itemCode')]),
          },
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
        placeholder={t('common.inputPlaceholder', [t('system.dict.order')])}
        min={0}
        rules={[
          {
            required: true,
            message: t('common.requiredMsg', [t('system.dict.order')]),
          },
        ]}
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

export default FormModal;
