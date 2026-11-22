/**
 * @fileoverview FormModal（配置新增/编辑弹窗）
 * @description 配置名称、Key、Value、状态、备注
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
import { configApi } from '@/modules/framework/system/config/api';

// ---------------------- 表单组件 ----------------------

/**
 * 配置新增/编辑弹窗
 *
 * 受控 ModalForm：关闭时销毁并复位，父页面只负责传入当前行。
 */
function FormModal({
  open,
  onOpenChange,
  current,
  onSuccess,
}: {
  /** 弹窗显隐 */
  open: boolean;
  /** 显隐变更回调 */
  onOpenChange: (open: boolean) => void;
  /** 当前编辑行，null 表示新增 */
  current?: API.Config | null;
  /** 保存成功回调 */
  onSuccess?: () => void;
}) {
  const { message } = App.useApp();

  // ---------------------- 表单状态 ----------------------

  // 有主键即编辑态：同时决定弹窗标题、Key 是否可改与提交分支
  const isEdit = current?.id != null;

  // ---------------------- 数据操作 ----------------------

  /**
   * 提交表单：有主键走修改，否则新增
   *
   * @param values 表单值，仅包含可编辑字段
   * @returns 是否提交成功
   */
  const handleFinish = async (values: API.ConfigForm) => {
    if (isEdit) {
      await configApi.update({ ...values, id: current?.id });
    } else {
      await configApi.insert(values);
    }
    message.success(t('common.saveSuccess'));
    onSuccess?.();
    return true;
  };

  // ---------------------- 表单渲染 ----------------------

  return (
    <ModalForm<API.ConfigForm>
      title={
        isEdit
          ? t('common.titleEdit', [t('common.noun.config')])
          : t('common.titleAdd', [t('common.noun.config')])
      }
      width={500}
      open={open}
      onOpenChange={onOpenChange}
      /* 关闭后销毁，配合 initialValues 保证每次打开都是最新数据；禁止点击遮罩关闭，避免误触丢失输入 */
      modalProps={{ destroyOnHidden: true, mask: { closable: false } }}
      layout="horizontal"
      labelCol={{ flex: '100px' }}
      onFinish={handleFinish}
      initialValues={{ status: 0, ...current }}
    >
      {/* 配置名称 */}
      <ProFormText
        name="name"
        label={t('system.config.configName')}
        placeholder={t('common.inputPlaceholder', [
          t('system.config.configName'),
        ])}
        rules={[
          {
            required: true,
            message: t('common.requiredMsg', [t('system.config.configName')]),
          },
        ]}
      />

      {/* 配置 Key */}
      <ProFormText
        name="key"
        label={t('system.config.configKey')}
        placeholder={t('common.inputPlaceholder', [
          t('system.config.configKey'),
        ])}
        /* Key 创建后不可修改，与后端校验保持一致 */
        disabled={isEdit}
        rules={[
          {
            required: true,
            message: t('common.requiredMsg', [t('system.config.configKey')]),
          },
          { min: 4, max: 100, message: t('system.config.keyLength') },
          {
            pattern: /^[a-z][a-z0-9.]*$/,
            message: t('system.config.keyPattern'),
          },
        ]}
      />

      {/* 配置内容：Value 可能较长，使用多行文本 */}
      <ProFormTextArea
        name="value"
        label={t('system.config.configValue')}
        placeholder={t('common.inputPlaceholder', [
          t('system.config.configValue'),
        ])}
        rules={[
          {
            required: true,
            message: t('common.requiredMsg', [t('system.config.configValue')]),
          },
        ]}
        fieldProps={{ rows: 3 }}
      />

      {/* 配置状态 */}
      <ProFormRadio.Group
        name="status"
        label={t('common.status')}
        options={[
          { value: 0, label: t('common.normal') },
          { value: 1, label: t('common.disabled') },
        ]}
      />

      {/* 配置备注 */}
      <ProFormTextArea
        name="remark"
        label={t('common.remark')}
        placeholder={t('common.inputPlaceholder', [t('common.remark')])}
        fieldProps={{ rows: 2 }}
      />
    </ModalForm>
  );
}

export default FormModal;
