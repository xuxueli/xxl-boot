/**
 * @fileoverview FormModal（资源新增/编辑弹窗）
 * @description 资源类型、父级、名称、图标、地址、权限标识、可见/状态
 * @author xuxueli 2026-11-21
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
import { useEffect, useMemo, useState } from 'react';
import { IconSelect } from '@/components';
import { toSelectOptions, useEnumOption } from '@/hooks/useEnumOption';
import { t } from '@/i18n';
import { resourceApi } from '@/modules/framework/authz/resource/api';
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
  {
    title: t('authz.resource.rootNode'),
    value: 0,
    children: mapToSelect(resources),
  },
];

/** 在资源树中查找指定节点 */
const findResourceNode = (
  list: API.Resource[],
  id: number,
): API.Resource | undefined => {
  for (const item of list) {
    if (item.id === id) return item;
    const found = findResourceNode(item.children || [], id);
    if (found) return found;
  }
  return undefined;
};

/** 判断上级是否位于当前节点的子孙中，避免形成环 */
const isParentInDescendants = (
  list: API.Resource[],
  id?: number,
  parentId?: number,
): boolean => {
  if (id == null || parentId == null) return false;
  if (id === parentId) return true;
  const current = findResourceNode(list, id);
  if (!current) return false;
  return findResourceNode(current.children || [], parentId) != null;
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
  current?: API.Resource | null;
  onSuccess?: () => void;
}) => {
  const { message } = App.useApp();

  // ---------------------- 表单状态 ----------------------

  // 有主键即编辑态：驱动弹窗标题与提交分支
  const isEdit = current?.id != null;
  const [parentOptions, setParentOptions] = useState<API.Resource[]>([]);
  const resourceTypeOptions = useEnumOption('ResourceTypeEnum');
  const resourceVisibleOptions = useEnumOption('ResourceVisibleEnum');

  const parentTreeSelectData = useMemo(
    () => toTreeSelectData(parentOptions),
    [parentOptions],
  );

  /** 加载父级资源树 */
  useEffect(() => {
    if (open) {
      resourceApi
        .treeList({})
        .then((res) => {
          setParentOptions(handleTree(res.data || []));
        })
        .catch(() => {});
    }
  }, [open]);

  // ---------------------- 数据操作 ----------------------

  /** 提交表单：有主键走修改，否则新增 */
  const handleFinish = async (values: API.ResourceForm) => {
    if (isParentInDescendants(parentOptions, current?.id, values.parentId)) {
      message.error(t('authz.resource.parentInvalid'));
      return false;
    }
    if (isEdit) {
      await resourceApi.update({ ...values, id: current?.id });
    } else {
      await resourceApi.insert(values);
    }
    message.success(t('common.saveSuccess'));
    onSuccess?.();
    return true;
  };

  // ---------------------- 表单渲染 ----------------------

  return (
    <ModalForm<API.ResourceForm>
      title={
        isEdit
          ? t('common.titleEdit', [t('common.noun.resource')])
          : t('common.titleAdd', [t('common.noun.resource')])
      }
      width={680}
      open={open}
      onOpenChange={onOpenChange}
      modalProps={{ destroyOnHidden: true, mask: { closable: false } }}
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
            placeholder={t('common.selectPlaceholderText', [
              t('authz.resource.parent'),
            ])}
            fieldProps={{
              treeData: parentTreeSelectData,
              treeDefaultExpandAll: true,
            }}
            rules={[
              {
                required: true,
                message: t('common.selectPlaceholderText', [
                  t('authz.resource.parent'),
                ]),
              },
            ]}
          />
        </Col>
        <Col span={24}>
          <ProFormRadio.Group
            name="type"
            label={t('authz.resource.type')}
            options={toSelectOptions(resourceTypeOptions)}
          />
        </Col>
        <Col span={12}>
          <ProFormText
            name="name"
            label={t('authz.resource.menuName')}
            placeholder={t('common.inputPlaceholder', [
              t('authz.resource.menuName'),
            ])}
            rules={[
              {
                required: true,
                message: t('common.requiredMsg', [
                  t('authz.resource.menuName'),
                ]),
              },
            ]}
          />
        </Col>
        <Col span={12}>
          <ProFormDigit
            name="order"
            label={t('authz.resource.order')}
            placeholder={t('common.inputPlaceholder', [
              t('authz.resource.order'),
            ])}
            min={0}
            rules={[
              {
                required: true,
                message: t('common.requiredMsg', [t('authz.resource.order')]),
              },
            ]}
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
                      placeholder={t('common.inputPlaceholder', [
                        t('authz.resource.url'),
                      ])}
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
            placeholder={t('common.inputPlaceholder', [
              t('authz.resource.permission'),
            ])}
            fieldProps={{ maxLength: 100 }}
          />
        </Col>
        <Col span={12}>
          <ProFormRadio.Group
            name="visible"
            label={t('authz.resource.visible')}
            options={toSelectOptions(resourceVisibleOptions)}
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

export default FormModal;
