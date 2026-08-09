/**
 * 组件：ResourceFormModal（资源新增/编辑弹窗）
 * 功能：资源类型、父级、名称、图标、地址、权限标识、可见/状态
 */
import {
  ModalForm,
  ProForm,
  ProFormDependency,
  ProFormDigit,
  ProFormRadio,
  ProFormText,
  ProFormTreeSelect,
} from '@ant-design/pro-components';
import { App } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { IconSelect } from '@/components';
import {
  addResource,
  listResource,
  updateResource,
} from '@/services/xxl-boot/authz/resource';
import { handleTree } from '@/utils/common';

/** 资源树转 TreeSelect 数据 */
const mapToSelect = (resources: API.Resource[]): any[] =>
  resources.map((r) => ({
    title: r.name,
    value: r.id,
    children: r.children?.length ? mapToSelect(r.children) : undefined,
  }));

/** 含根节点的 TreeSelect 数据 */
const toTreeSelectData = (resources: API.Resource[]): any[] => [
  { title: '根节点', value: 0, children: mapToSelect(resources) },
];

const ResourceFormModal: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  current?: API.Resource | null;
  onSuccess?: () => void;
}> = ({ open, onOpenChange, current, onSuccess }) => {
  const { message } = App.useApp();
  const [parentOptions, setParentOptions] = useState<API.Resource[]>([]);

  const parentTreeSelectData = useMemo(
    () => toTreeSelectData(parentOptions),
    [parentOptions],
  );

  /** 加载父级资源树 */
  useEffect(() => {
    if (open) {
      listResource({})
        .then((res) => {
          setParentOptions(handleTree(res.data || []));
        })
        .catch(() => {});
    }
  }, [open]);

  /** 提交：剥离时间字段 */
  const handleFinish = async (values: API.Resource) => {
    const data = { ...values };
    delete data.addTime;
    delete data.updateTime;
    if (current?.id) {
      await updateResource({ ...data, id: current.id });
    } else {
      await addResource(data);
    }
    message.success('操作成功');
    onSuccess?.();
    return true;
  };

  return (
    <ModalForm<API.Resource>
      title={current?.id ? '修改资源' : '新增资源'}
      width={680}
      open={open}
      onOpenChange={onOpenChange}
      modalProps={{ destroyOnClose: true }}
      onFinish={handleFinish}
      initialValues={{ type: 0, status: 0, visible: 0, order: 1, ...current }}
    >
      <ProFormTreeSelect
        name="parentId"
        label="上级资源"
        placeholder="请选择上级资源"
        initialValue={current?.parentId ?? 0}
        fieldProps={{
          treeData: parentTreeSelectData,
          treeDefaultExpandAll: true,
        }}
        rules={[{ required: true, message: '请选择上级资源' }]}
      />
      <ProFormRadio.Group
        name="type"
        label="资源类型"
        options={[
          { value: 0, label: '目录' },
          { value: 1, label: '菜单' },
          { value: 2, label: '按钮' },
        ]}
      />
      <ProFormText
        name="name"
        label="资源名称"
        placeholder="请输入资源名称"
        rules={[{ required: true, message: '资源名称不能为空' }]}
      />
      <ProFormDigit
        name="order"
        label="显示排序"
        placeholder="请输入显示排序"
        min={0}
        rules={[{ required: true, message: '显示排序不能为空' }]}
        fieldProps={{ style: { width: '100%' } }}
      />
      <ProFormDependency name={['type']}>
        {({ type }) =>
          type !== 2 ? (
            <>
              <ProForm.Item name="icon" label="图标">
                <IconSelect />
              </ProForm.Item>
              <ProFormText
                name="url"
                label="菜单地址"
                placeholder="请输入菜单地址"
              />
            </>
          ) : null
        }
      </ProFormDependency>
      <ProFormText
        name="permission"
        label="权限标识"
        placeholder="请输入权限标识"
        fieldProps={{ maxLength: 100 }}
      />
      <ProFormRadio.Group
        name="visible"
        label="显示状态"
        options={[
          { value: 0, label: '显示' },
          { value: 1, label: '隐藏' },
        ]}
      />
      <ProFormRadio.Group
        name="status"
        label="资源状态"
        options={[
          { value: 0, label: '正常' },
          { value: 1, label: '停用' },
        ]}
      />
    </ModalForm>
  );
};

export default ResourceFormModal;
