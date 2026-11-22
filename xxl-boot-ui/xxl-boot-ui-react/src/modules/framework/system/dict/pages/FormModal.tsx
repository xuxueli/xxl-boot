/**
 * @fileoverview FormModal（字典类型新增/编辑弹窗）
 * @description 字典名称、类型、状态、备注
 * @author xuxueli 2026-11-21
 */
import {
  ModalForm,
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
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  current?: API.Dict | null;
  onSuccess?: () => void;
}) => {
  const { message } = App.useApp();

  // ---------------------- 表单状态 ----------------------

  // 有主键即编辑态：驱动弹窗标题、类型不可改与提交分支
  const isEdit = current?.id != null;

  // ---------------------- 数据操作 ----------------------

  /** 提交表单：有主键走修改，否则新增 */
  const handleFinish = async (values: API.DictForm) => {
    if (isEdit) {
      await dictApi.update({ ...values, id: current?.id });
    } else {
      await dictApi.insert(values);
    }
    message.success(t('common.saveSuccess'));
    onSuccess?.();
    return true;
  };

  // ---------------------- 表单渲染 ----------------------

  return (
    <ModalForm<API.DictForm>
      title={
        isEdit
          ? t('common.titleEdit', [t('system.dict.dictType')])
          : t('common.titleAdd', [t('system.dict.dictType')])
      }
      width={500}
      open={open}
      onOpenChange={onOpenChange}
      modalProps={{ destroyOnHidden: true, mask: { closable: false } }}
      layout="horizontal"
      labelCol={{ flex: '100px' }}
      onFinish={handleFinish}
      initialValues={{ status: 0, ...current }}
    >
      <ProFormText
        name="name"
        label={t('system.dict.dictName')}
        placeholder={t('common.inputPlaceholder', [t('system.dict.dictName')])}
        rules={[
          {
            required: true,
            message: t('common.requiredMsg', [t('system.dict.dictName')]),
          },
        ]}
      />
      <ProFormText
        name="type"
        label={t('system.dict.dictType')}
        placeholder={t('common.inputPlaceholder', [t('system.dict.dictType')])}
        disabled={isEdit}
        rules={[
          {
            required: true,
            message: t('common.requiredMsg', [t('system.dict.dictType')]),
          },
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

export default FormModal;
