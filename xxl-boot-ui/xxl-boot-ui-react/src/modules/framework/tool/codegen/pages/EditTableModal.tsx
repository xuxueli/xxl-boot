/**
 * 组件：EditTableModal（代码生成编辑弹窗）
 * 功能：Tab1 配置信息表单 + Tab2 字段信息可拖拽排序表格
 */

import { HolderOutlined } from '@ant-design/icons';
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { App, Checkbox, Form, Input, Modal, Select, Table, Tabs } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { queryDictList } from '@/modules/framework/system/dict/api';
import { getGenTable, updateGenTable } from '@/modules/framework/tool/codegen/api';
import { t } from '@/i18n';

const javaTypeOptions = [
  'Long',
  'String',
  'Integer',
  'Double',
  'BigDecimal',
  'Date',
  'Boolean',
];
/* 前端模板可选值（第一个为默认选中） */
const tplWebTypeOptions = [
  { value: 'antd-typescript', label: 'Ant Design + TypeScript' },
  { value: 'element-plus-typescript', label: 'Element Plus + TypeScript' },
];
const tplWebTypeValues = tplWebTypeOptions.map((item) => item.value);
const queryTypeOptions = [
  { value: 'EQ', label: '=' },
  { value: 'NE', label: '!=' },
  { value: 'GT', label: '>' },
  { value: 'GTE', label: '>=' },
  { value: 'LT', label: '<' },
  { value: 'LTE', label: '<=' },
  { value: 'LIKE', label: 'LIKE' },
  { value: 'BETWEEN', label: 'BETWEEN' },
];
const htmlTypeOptions = [
  { value: 'input', label: t('tool.codegen.htmlTypeInput') },
  { value: 'textarea', label: t('tool.codegen.htmlTypeTextarea') },
  { value: 'select', label: t('tool.codegen.htmlTypeSelect') },
  { value: 'radio', label: t('tool.codegen.htmlTypeRadio') },
  { value: 'checkbox', label: t('tool.codegen.htmlTypeCheckbox') },
  { value: 'datetime', label: t('tool.codegen.htmlTypeDatetime') },
  { value: 'imageUpload', label: t('tool.codegen.htmlTypeImageUpload') },
  { value: 'fileUpload', label: t('tool.codegen.htmlTypeFileUpload') },
  { value: 'editor', label: t('tool.codegen.htmlTypeEditor') },
];

/** 拖拽行上下文：向行内单元格的拖拽手柄传递激活节点与事件 */
const RowContext = React.createContext<{
  setActivatorNodeRef: (ref: HTMLElement | null) => void;
  attributes: any;
  listeners: any;
} | null>(null);

/** 拖拽手柄：用于拖拽调整字段行顺序 */
const DragHandle = () => {
  const ctx = useContext(RowContext);
  if (!ctx) return null;
  return (
    <HolderOutlined
      ref={ctx.setActivatorNodeRef}
      style={{ cursor: 'move' }}
      {...ctx.attributes}
      {...ctx.listeners}
    />
  );
};

/** 可拖拽表格行 */
const SortableRow = (props: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props['data-row-key'] });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 999 } : {}),
  };
  const rowContext = useMemo(
    () => ({ setActivatorNodeRef, attributes, listeners }),
    [setActivatorNodeRef, attributes, listeners],
  );
  return (
    <RowContext.Provider value={rowContext}>
      <tr ref={setNodeRef} {...props} style={style} />
    </RowContext.Provider>
  );
};

/** 字段单元格渲染组件 */
const FieldInput = ({
  value,
  onChange,
  disabled,
}: {
  value?: string;
  onChange?: (value: string) => void;
  type?: 'input';
  disabled?: boolean;
}) => (
  <Input
    size="small"
    value={value}
    disabled={disabled}
    onChange={(e) => onChange?.(e.target.value)}
  />
);

const FieldCheckbox = ({
  value,
  onChange,
  disabled,
}: {
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}) => (
  <Checkbox
    checked={value === '1'}
    disabled={disabled}
    onChange={(e) => onChange?.(e.target.checked ? '1' : '0')}
  />
);

const EditTableModal = ({
  open,
  onOpenChange,
  id,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id?: number;
  onSuccess?: () => void;
}) => {
  const { message } = App.useApp();
  const [form] = Form.useForm();
  const [activeTab, setActiveTab] = useState('info');

  const [info, setInfo] = useState<API.Codegen>({});
  const [fields, setFields] = useState<API.CodegenField[]>([]);
  const [dictOptions, setDictOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [saving, setSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  /** 加载表详情 */
  useEffect(() => {
    if (open && id) {
      setActiveTab('info');
      getGenTable(id)
        .then((res) => {
          const data = res.data || {};
          const { fieldList = [], ...rest } = data;
          const merge = {
            formColNum: 1,
            tplWebType: tplWebTypeValues[0],
            ...rest,
          };
          /* 校验默认值：表单布局默认单列，前端模板默认第一个选项 */
          if (![1, 2, 3].includes(merge.formColNum)) merge.formColNum = 1;
          if (!tplWebTypeValues.includes(merge.tplWebType)) {
            merge.tplWebType = tplWebTypeValues[0];
          }
          setInfo(merge);
          setFields(fieldList.map((f) => ({ ...f })));
          form.setFieldsValue(merge);
        })
        .catch(() => {});
      queryDictList()
        .then((res) => {
          setDictOptions(
            (res.data || []).map((d) => ({
              value: d.type || '',
              label: d.name || '',
            })),
          );
        })
        .catch(() => {});
    }
  }, [open, id, form]);

  /** 拖拽排序：重新生成 sort */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setFields((prev) => {
        const oldIndex = prev.findIndex((f) => f.id === active.id);
        const newIndex = prev.findIndex((f) => f.id === over?.id);
        const next = arrayMove(prev, oldIndex, newIndex);
        return next.map((f, i) => ({ ...f, sort: i + 1 }));
      });
    }
  };

  /** 更新字段单项 */
  const updateField = (
    fieldId: number | undefined,
    patch: Partial<API.CodegenField>,
  ) => {
    setFields((prev) =>
      prev.map((f) => (f.id === fieldId ? { ...f, ...patch } : f)),
    );
  };

  /** 提交保存 */
  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (fields.length === 0) {
      message.warning(t('tool.codegen.fieldEmpty'));
      return;
    }
    setSaving(true);
    try {
      await updateGenTable({ ...info, ...values, fieldList: fields });
      message.success(t('common.saveSuccess'));
      onSuccess?.();
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  const columns: ColumnsType<API.CodegenField> = [
    {
      title: t('tool.codegen.sort'),
      width: 72,
      align: 'center',
      render: (_, _r, index) => (
        <span>
          <DragHandle />
          <span style={{ marginLeft: 4 }}>{index + 1}</span>
        </span>
      ),
    },
    {
      title: t('tool.codegen.fieldColumn'),
      dataIndex: 'columnName',
      width: 120,
      render: (v) => <span style={{ color: 'rgba(0,0,0,0.45)' }}>{v}</span>,
    },
    {
      title: t('tool.codegen.fieldComment'),
      dataIndex: 'columnComment',
      width: 100,
      render: (_, record) => (
        <FieldInput
          value={record.columnComment}
          onChange={(v) => updateField(record.id, { columnComment: v })}
        />
      ),
    },
    {
      title: t('tool.codegen.javaType'),
      dataIndex: 'javaType',
      width: 95,
      render: (_, record) => (
        <Select
          size="small"
          style={{ width: '100%' }}
          value={record.javaType}
          options={javaTypeOptions.map((v) => ({ value: v, label: v }))}
          onChange={(v) => updateField(record.id, { javaType: v })}
        />
      ),
    },
    {
      title: t('tool.codegen.javaField'),
      dataIndex: 'javaField',
      width: 100,
      render: (_, record) => (
        <FieldInput
          value={record.javaField}
          onChange={(v) => updateField(record.id, { javaField: v })}
        />
      ),
    },
    {
      title: t('tool.codegen.isInsert'),
      dataIndex: 'isInsert',
      width: 56,
      align: 'center',
      render: (_, record) => (
        <FieldCheckbox
          value={record.isInsert}
          disabled={record.columnName === 'id'}
          onChange={(v) => updateField(record.id, { isInsert: v })}
        />
      ),
    },
    {
      title: t('common.edit'),
      dataIndex: 'isEdit',
      width: 56,
      align: 'center',
      render: (_, record) => (
        <FieldCheckbox
          value={record.isEdit}
          disabled={record.columnName === 'id'}
          onChange={(v) => updateField(record.id, { isEdit: v })}
        />
      ),
    },
    {
      title: t('tool.codegen.isList'),
      dataIndex: 'isList',
      width: 56,
      align: 'center',
      render: (_, record) => (
        <FieldCheckbox
          value={record.isList}
          disabled={record.columnName === 'id'}
          onChange={(v) => updateField(record.id, { isList: v })}
        />
      ),
    },
    {
      title: t('tool.codegen.isQuery'),
      dataIndex: 'isQuery',
      width: 56,
      align: 'center',
      render: (_, record) => (
        <FieldCheckbox
          value={record.isQuery}
          disabled={record.columnName === 'id'}
          onChange={(v) => updateField(record.id, { isQuery: v })}
        />
      ),
    },
    {
      title: t('tool.codegen.queryType'),
      dataIndex: 'queryType',
      width: 95,
      render: (_, record) => (
        <Select
          size="small"
          style={{ width: '100%' }}
          value={record.queryType}
          options={queryTypeOptions}
          onChange={(v) => updateField(record.id, { queryType: v })}
        />
      ),
    },
    {
      title: t('tool.codegen.isRequired'),
      dataIndex: 'isRequired',
      width: 56,
      align: 'center',
      render: (_, record) => (
        <FieldCheckbox
          value={record.isRequired}
          onChange={(v) => updateField(record.id, { isRequired: v })}
        />
      ),
    },
    {
      title: t('tool.codegen.htmlType'),
      dataIndex: 'htmlType',
      width: 105,
      render: (_, record) => (
        <Select
          size="small"
          style={{ width: '100%' }}
          value={record.htmlType}
          options={htmlTypeOptions}
          onChange={(v) => updateField(record.id, { htmlType: v })}
        />
      ),
    },
    {
      title: t('tool.codegen.dictType'),
      dataIndex: 'dictType',
      width: 110,
      render: (_, record) => (
        <Select
          size="small"
          style={{ width: '100%' }}
          value={record.dictType}
          allowClear
          showSearch
          filterOption={(input, option) =>
            String(option?.label || '')
              .toLowerCase()
              .includes(input.toLowerCase())
          }
          options={dictOptions}
          optionRender={(option) => (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{option.label}</span>
              <span style={{ color: '#8492a6', fontSize: 13 }}>
                {option.value}
              </span>
            </div>
          )}
          onChange={(v) => updateField(record.id, { dictType: v })}
        />
      ),
    },
  ];

  return (
    <Modal
      title={t('tool.codegen.editConfig')}
      width="90%"
      open={open}
      onCancel={() => onOpenChange(false)}
      onOk={handleSubmit}
      confirmLoading={saving}
      destroyOnHidden
      okText={t('common.save')}
      cancelText={t('modal.cancelButton')}
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'info',
            label: t('tool.codegen.configInfo'),
            children: (
              <Form
                form={form}
                labelCol={{ flex: '150px' }}
                style={{ marginTop: 8 }}
              >
                <div style={{ fontWeight: 600, marginBottom: 8 }}>
                  {t('tool.codegen.baseInfo')}
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                  }}
                >
                  <Form.Item
                    name="tableName"
                    label={t('tool.codegen.tableName')}
                    rules={[
                      {
                        required: true,
                        message: t('common.requiredMsg', [t('tool.codegen.tableName')]),
                      },
                    ]}
                  >
                    <Input placeholder={t('common.inputPlaceholder', [t('tool.codegen.tableName')])} />
                  </Form.Item>
                  <Form.Item
                    name="tableComment"
                    label={t('tool.codegen.tableComment')}
                  >
                    <Input
                      placeholder={t('common.inputPlaceholder', [t('tool.codegen.tableComment')])}
                    />
                  </Form.Item>
                </div>
                <div style={{ fontWeight: 600, margin: '16px 0 8px' }}>
                  {t('tool.codegen.genInfo')}
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                  }}
                >
                  <Form.Item
                    name="packageName"
                    label={t('tool.codegen.packageName')}
                    rules={[
                      {
                        required: true,
                        message: t('common.requiredMsg', [t('tool.codegen.packageName')]),
                      },
                    ]}
                  >
                    <Input placeholder={t('tool.codegen.packageNamePlaceholder')} />
                  </Form.Item>
                  <Form.Item
                    name="moduleName"
                    label={t('tool.codegen.moduleName')}
                    rules={[
                      {
                        required: true,
                        message: t('common.requiredMsg', [t('tool.codegen.moduleName')]),
                      },
                    ]}
                  >
                    <Input placeholder={t('tool.codegen.moduleNamePlaceholder')} />
                  </Form.Item>
                  <Form.Item
                    name="businessName"
                    label={t('tool.codegen.businessName')}
                    rules={[
                      {
                        required: true,
                        message: t('common.requiredMsg', [t('tool.codegen.businessName')]),
                      },
                    ]}
                  >
                    <Input placeholder={t('tool.codegen.businessNamePlaceholder')} />
                  </Form.Item>
                  <Form.Item
                    name="functionName"
                    label={t('tool.codegen.functionName')}
                    rules={[
                      {
                        required: true,
                        message: t('common.requiredMsg', [t('tool.codegen.functionName')]),
                      },
                    ]}
                  >
                    <Input placeholder={t('tool.codegen.functionNamePlaceholder')} />
                  </Form.Item>
                  <Form.Item name="functionAuthor" label={t('tool.codegen.functionAuthor')}>
                    <Input placeholder={t('tool.codegen.functionAuthorPlaceholder')} />
                  </Form.Item>
                  <Form.Item name="formColNum" label={t('tool.codegen.formLayout')}>
                    <Select
                      options={[
                        { value: 1, label: t('tool.codegen.singleCol') },
                        { value: 2, label: t('tool.codegen.doubleCol') },
                        { value: 3, label: t('tool.codegen.tripleCol') },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item name="tplCategory" label={t('tool.codegen.tplCategory')}>
                    <Select
                      options={[
                        { value: 'crud', label: t('tool.codegen.singleTable') },
                        { value: 'tree', label: t('tool.codegen.treeTable') },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item name="tplWebType" label={t('tool.codegen.tplWebType')}>
                    <Select options={tplWebTypeOptions} />
                  </Form.Item>
                  <Form.Item
                    name="remark"
                    label={t('common.remark')}
                    style={{ gridColumn: '1 / -1' }}
                  >
                    <Input.TextArea
                      rows={2}
                      placeholder={t('common.inputPlaceholder', [t('common.remark')])}
                    />
                  </Form.Item>
                </div>
              </Form>
            ),
          },
          {
            key: 'fields',
            label: t('tool.codegen.fieldInfo'),
            children: (
              <div style={{ marginTop: 8 }}>
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext
                    items={fields.map((f) => f.id as number)}
                    strategy={verticalListSortingStrategy}
                  >
                    <Table<API.CodegenField>
                      rowKey="id"
                      size="small"
                      scroll={{ x: 1400 }}
                      pagination={false}
                      columns={columns}
                      dataSource={fields}
                      components={{ body: { row: SortableRow } }}
                      footer={() => t('tool.codegen.dragTip')}
                    />
                  </SortableContext>
                </DndContext>
              </div>
            ),
          },
        ]}
      />
    </Modal>
  );
};

export default EditTableModal;
