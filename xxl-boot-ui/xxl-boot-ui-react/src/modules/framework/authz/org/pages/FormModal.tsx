/**
 * @fileoverview FormModal（组织新增/编辑弹窗）
 * @description 上级组织、名称、排序、负责人、状态
 * @author xuxueli 2026-11-21
 */
import {
  ModalForm,
  ProFormDigit,
  ProFormRadio,
  ProFormText,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { App } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { t } from '@/i18n';
import { orgApi } from '@/modules/framework/authz/org/api';
import { handleTree } from '@/utils/common';

/** 组织树转 TreeSelect 数据（含根节点） */
const mapToSelect = (orgs: API.Org[]): any[] =>
  orgs.map((org) => ({
    title: org.name,
    value: org.id,
    children: org.children?.length ? mapToSelect(org.children) : undefined,
  }));

/** 含根节点的 TreeSelect 数据 */
const toTreeSelectData = (orgs: API.Org[]): any[] => [
  { title: t('authz.org.rootNode'), value: 0, children: mapToSelect(orgs) },
];

/** 判断某组织节点的树内是否包含目标 id（防环校验用） */
const isInTree = (node: API.Org, targetId: number | undefined): boolean => {
  if (!targetId) return false;
  if (node.id === targetId) return true;
  return (node.children || []).some((c) => isInTree(c, targetId));
};

// ---------------------- 表单组件 ----------------------

const FormModal = ({
  open,
  onOpenChange,
  current,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** 当前编辑的组织数据，null 表示新增 */
  current?: API.Org | null;
  /** 操作成功回调 */
  onSuccess?: () => void;
}) => {
  const { message } = App.useApp();

  // ---------------------- 表单状态 ----------------------

  // 有主键即编辑态：驱动弹窗标题、父级校验与提交分支
  const isEdit = current?.id != null;
  const [orgOptions, setOrgOptions] = useState<API.Org[]>([]);

  const treeSelectData = useMemo(
    () => toTreeSelectData(orgOptions),
    [orgOptions],
  );

  /** 加载组织树 */
  useEffect(() => {
    if (open) {
      orgApi.treeList({})
        .then((res) => {
          setOrgOptions(handleTree(res.data || []));
        })
        .catch(() => {});
    }
  }, [open]);

  // ---------------------- 数据操作 ----------------------

  /** 提交：防止选择自身或子孙作为父级 */
  const handleFinish = async (values: API.OrgForm) => {
    if (isEdit) {
      // 防环校验：选中的上级组织不能是自己或其子孙
      const currentNode = orgOptions.find((o) => o.id === current?.id);
      if (currentNode && isInTree(currentNode, values.parentId)) {
        message.warning(t('authz.org.parentInvalid'));
        return false;
      }
      await orgApi.update({ ...values, id: current?.id });
    } else {
      await orgApi.insert(values);
    }
    message.success(t('common.saveSuccess'));
    onSuccess?.();
    return true;
  };

  // ---------------------- 表单渲染 ----------------------

  return (
    <ModalForm<API.OrgForm>
      title={
        isEdit
          ? t('common.titleEdit', [t('common.noun.org')])
          : t('common.titleAdd', [t('common.noun.org')])
      }
      width={600}
      open={open}
      onOpenChange={onOpenChange}
      modalProps={{ destroyOnHidden: true, maskClosable: false }}
      layout="horizontal"
      grid
      labelCol={{ flex: '85px' }}
      onFinish={handleFinish}
      initialValues={{
        status: 0,
        order: 0,
        ...current,
        parentId: current?.parentId ?? 0,
      }}
    >
      <ProFormTreeSelect
        colProps={{ span: 24 }}
        name="parentId"
        label={t('authz.org.parent')}
        placeholder={t('common.selectPlaceholderText', [t('authz.org.parent')])}
        fieldProps={{
          treeData: treeSelectData,
          treeDefaultExpandAll: true,
        }}
        rules={[{ required: true, message: t('common.selectPlaceholderText', [t('authz.org.parent')]) }]}
      />
      <ProFormText
        colProps={{ span: 12 }}
        name="name"
        label={t('authz.org.name')}
        placeholder={t('common.inputPlaceholder', [t('authz.org.name')])}
        rules={[{ required: true, message: t('common.requiredMsg', [t('authz.org.name')]) }]}
      />
      <ProFormDigit
        colProps={{ span: 12 }}
        name="order"
        label={t('authz.org.order')}
        placeholder={t('common.inputPlaceholder', [t('authz.org.order')])}
        min={0}
        rules={[{ required: true, message: t('common.requiredMsg', [t('authz.org.order')]) }]}
        fieldProps={{ style: { width: '100%' } }}
      />
      <ProFormText
        colProps={{ span: 12 }}
        name="manager"
        label={t('authz.org.manager')}
        placeholder={t('common.inputPlaceholder', [t('authz.org.manager')])}
        fieldProps={{ maxLength: 50 }}
      />
      <ProFormRadio.Group
        colProps={{ span: 12 }}
        name="status"
        label={t('common.status')}
        options={[
          { value: 0, label: t('common.normal') },
          { value: 1, label: t('common.disabled') },
        ]}
      />
    </ModalForm>
  );
};

export default FormModal;
