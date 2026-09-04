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
import { t } from '@/i18n';
import { IconSelect } from '@/components';
import {
  addResource,
  listResource,
  updateResource,
} from '@/modules/framework/authz/resource/api';
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
  { title: t('authz.resource.rootNode'), value: 0, children: mapToSelect(resources) },
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
    message.success(t('common.operationSuccess'));
    onSuccess?.();
    return true;
  };

  return (
    <ModalForm<API.Resource>
      title={current?.id ? t('common.titleEdit', [t('common.noun.resource')]) : t('common.titleAdd', [t('common.noun.resource')])}
      width={680}
      open={open}
      onOpenChange={onOpenChange}
      modalProps={{ destroyOnHidden: true }}
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
            label={t('authz.resource.parent')}
            placeholder={t('common.selectPlaceholderText', [t('authz.resource.parent')])}
            fieldProps={{
              treeData: parentTreeSelectData,
              treeDefaultExpandAll: true,
            }}
            rules={[{ required: true, message: t('common.selectPlaceholderText', [t('authz.resource.parent')]) }]}
          />
        </Col>
        <Col span={24}>
          <ProFormRadio.Group
            name="type"
            label={t('authz.resource.type')}
            options={[
              { value: 0, label: t('authz.resource.typeDir') },
              { value: 1, label: t('authz.resource.typeMenu') },
              { value: 2, label: t('authz.resource.typeBtn') },
            ]}
          />
        </Col>
        <Col span={12}>
          <ProFormText
            name="name"
            label={t('authz.resource.menuName')}
            placeholder={t('common.inputPlaceholder', [t('authz.resource.menuName')])}
            rules={[{ required: true, message: t('common.requiredMsg', [t('authz.resource.menuName')]) }]}
          />
        </Col>
        <Col span={12}>
          <ProFormDigit
            name="order"
            label={t('authz.resource.order')}
            placeholder={t('common.inputPlaceholder', [t('authz.resource.order')])}
            min={0}
            rules={[{ required: true, message: t('common.requiredMsg', [t('authz.resource.order')]) }]}
            fieldProps={{ style: { width: '100%' } }}
          />
        </Col>
        <Col span={24}>
          <ProFormDependency name={['type']}>
            {({ type }) =>
              type !== 2 ? (
                <Row gutter={16}>
                  <Col span={12}>
                    <ProForm.Item name="icon" label={t('authz.resource.icon')}>
                      <IconSelect />
                    </ProForm.Item>
                  </Col>
                  <Col span={12}>
                    <ProFormText
                      name="url"
                      label={t('authz.resource.url')}
                      placeholder={t('common.inputPlaceholder', [t('authz.resource.url')])}
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
            label={t('authz.resource.permission')}
            placeholder={t('common.inputPlaceholder', [t('authz.resource.permission')])}
            fieldProps={{ maxLength: 100 }}
          />
        </Col>
        <Col span={12}>
          <ProFormRadio.Group
            name="visible"
            label={t('authz.resource.visible')}
            options={[
              { value: 0, label: t('authz.resource.visibleShow') },
              { value: 1, label: t('authz.resource.visibleHide') },
            ]}
          />
        </Col>
        <Col span={12}>
          <ProFormRadio.Group
            name="status"
            label={t('authz.resource.statusLabel')}
            options={[
              { value: 0, label: t('common.normal') },
              { value: 1, label: t('common.disabled') },
            ]}
          />
        </Col>
      </Row>
    </ModalForm>
  );
};

export default ResourceFormModal;
