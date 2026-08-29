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
import { App, Col, Row } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { IconSelect } from '@/components';
import {
  addResource,
  listResource,
  updateResource,
} from '@/services/authz/resource';
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

const ResourceFormModal = ({
  open,
  onOpenChange,
  current,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  current?: API.Resource | null;
  onSuccess?: () => void;
}) => {
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
      layout="horizontal"
      labelCol={{ flex: '100px' }}
      onFinish={handleFinish}
      initialValues={{
        type: 0,
        status: 0,
        visible: 0,
        order: 0,
        parentId: 0,
        ...current,
      }}
    >
      <Row gutter={16}>
        <Col span={24}>
          <ProFormTreeSelect
            name="parentId"
            label="上级资源"
            placeholder="请选择上级资源"
            fieldProps={{
              treeData: parentTreeSelectData,
              treeDefaultExpandAll: true,
            }}
            rules={[{ required: true, message: '请选择上级资源' }]}
          />
        </Col>
        <Col span={24}>
          <ProFormRadio.Group
            name="type"
            label="资源类型"
            options={[
              { value: 0, label: '目录' },
              { value: 1, label: '菜单' },
              { value: 2, label: '按钮' },
            ]}
          />
        </Col>
        <Col span={12}>
          <ProFormText
            name="name"
            label="资源名称"
            placeholder="请输入资源名称"
            rules={[{ required: true, message: '资源名称不能为空' }]}
          />
        </Col>
        <Col span={12}>
          <ProFormDigit
            name="order"
            label="显示排序"
            placeholder="请输入显示排序"
            min={0}
            rules={[{ required: true, message: '显示排序不能为空' }]}
            fieldProps={{ style: { width: '100%' } }}
          />
        </Col>
        <Col span={24}>
          <ProFormDependency name={['type']}>
            {({ type }) =>
              type !== 2 ? (
                <Row gutter={16}>
                  <Col span={12}>
                    <ProForm.Item name="icon" label="资源图标">
                      <IconSelect />
                    </ProForm.Item>
                  </Col>
                  <Col span={12}>
                    <ProFormText
                      name="url"
                      label="菜单地址"
                      placeholder="请输入菜单地址"
                    />
                  </Col>
                </Row>
              ) : null
            }
          </ProFormDependency>
        </Col>
        <Col span={24}>
          <ProFormText
            name="permission"
            label="权限标识"
            placeholder="请输入权限标识"
            fieldProps={{ maxLength: 100 }}
          />
        </Col>
        <Col span={12}>
          <ProFormRadio.Group
            name="visible"
            label="显示状态"
            options={[
              { value: 0, label: '显示' },
              { value: 1, label: '隐藏' },
            ]}
          />
        </Col>
        <Col span={12}>
          <ProFormRadio.Group
            name="status"
            label="资源状态"
            options={[
              { value: 0, label: '正常' },
              { value: 1, label: '停用' },
            ]}
          />
        </Col>
      </Row>
    </ModalForm>
  );
};

export default ResourceFormModal;
