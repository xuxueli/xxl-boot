/**
 * 组件：OrgFormModal（组织新增/编辑弹窗）
 * 功能：上级组织、名称、排序、负责人、状态
 */
import {
  ModalForm,
  ProFormDigit,
  ProFormRadio,
  ProFormText,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { App } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { addOrg, listOrg, updateOrg } from '@/services/authz/org';
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
  { title: '根组织', value: 0, children: mapToSelect(orgs) },
];

/** 判断当前组织 id 是否为某组织的子孙节点（防环校验） */
const isDescendant = (node: API.Org, targetId: number | undefined): boolean => {
  if (!targetId) return false;
  if (node.id === targetId) return true;
  return (node.children || []).some((c) => isDescendant(c, targetId));
};

const OrgFormModal = ({
  open,
  onOpenChange,
  current,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  current?: API.Org | null;
  onSuccess?: () => void;
}) => {
  const { message } = App.useApp();
  const [orgOptions, setOrgOptions] = useState<API.Org[]>([]);

  const treeSelectData = useMemo(
    () => toTreeSelectData(orgOptions),
    [orgOptions],
  );

  /** 加载组织树 */
  useEffect(() => {
    if (open) {
      listOrg({})
        .then((res) => {
          setOrgOptions(handleTree(res.data || []));
        })
        .catch(() => {});
    }
  }, [open]);

  /** 提交：防止选择自身或子孙作为父级 */
  const handleFinish = async (values: API.Org) => {
    const data = { ...values };
    delete data.addTime;
    delete data.updateTime;
    if (current?.id) {
      // 防环校验
      const parentNode = orgOptions.find((o) => o.id === values.parentId);
      if (parentNode && isDescendant(parentNode, current.id)) {
        message.warning('不能选择自身或子孙组织作为上级组织');
        return false;
      }
      await updateOrg({ ...data, id: current.id });
    } else {
      await addOrg(data);
    }
    message.success('操作成功');
    onSuccess?.();
    return true;
  };

  return (
    <ModalForm<API.Org>
      title={current?.id ? '修改组织' : '新增组织'}
      width={600}
      open={open}
      onOpenChange={onOpenChange}
      modalProps={{ destroyOnHidden: true }}
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
        label="上级组织"
        placeholder="请选择上级组织"
        fieldProps={{
          treeData: treeSelectData,
          treeDefaultExpandAll: true,
        }}
        rules={[{ required: true, message: '请选择上级组织' }]}
      />
      <ProFormText
        colProps={{ span: 12 }}
        name="name"
        label="组织名称"
        placeholder="请输入组织名称"
        rules={[{ required: true, message: '组织名称不能为空' }]}
      />
      <ProFormDigit
        colProps={{ span: 12 }}
        name="order"
        label="顺序"
        placeholder="请输入顺序"
        min={0}
        rules={[{ required: true, message: '顺序不能为空' }]}
        fieldProps={{ style: { width: '100%' } }}
      />
      <ProFormText
        colProps={{ span: 12 }}
        name="manager"
        label="负责人"
        placeholder="请输入负责人"
        fieldProps={{ maxLength: 50 }}
      />
      <ProFormRadio.Group
        colProps={{ span: 12 }}
        name="status"
        label="状态"
        options={[
          { value: 0, label: '正常' },
          { value: 1, label: '停用' },
        ]}
      />
    </ModalForm>
  );
};

export default OrgFormModal;
