/**
 * 组件：EditTableModal（代码生成编辑弹窗）
 * 功能：Tab1 配置信息表单 + Tab2 字段信息可拖拽排序表格
 */

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
import { HolderOutlined } from '@ant-design/icons';
import { App, Checkbox, Form, Input, Modal, Select, Table, Tabs } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { queryDictList } from '@/services/system/dict';
import { getGenTable, updateGenTable } from '@/services/tool/codegen';

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
  { value: 'input', label: '文本框' },
  { value: 'textarea', label: '文本域' },
  { value: 'select', label: '下拉框' },
  { value: 'radio', label: '单选框' },
  { value: 'checkbox', label: '复选框' },
  { value: 'datetime', label: '日期控件' },
  { value: 'imageUpload', label: '图片上传' },
  { value: 'fileUpload', label: '文件上传' },
  { value: 'editor', label: '富文本控件' },
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
      message.warning('字段信息不能为空');
      return;
    }
    setSaving(true);
    try {
      await updateGenTable({ ...info, ...values, fieldList: fields });
      message.success('操作成功');
      onSuccess?.();
      onOpenChange(false);
    } finally {
      setSaving(false);
    }
  };

  const columns: ColumnsType<API.CodegenField> = [
    {
      title: '排序',
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
      title: '字段名',
      dataIndex: 'columnName',
      width: 120,
      render: (v) => <span style={{ color: 'rgba(0,0,0,0.45)' }}>{v}</span>,
    },
    {
      title: '字段注释',
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
      title: 'Java类型',
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
      title: 'Java属性',
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
      title: '插入',
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
      title: '编辑',
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
      title: '列表',
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
      title: '查询',
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
      title: '查询方式',
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
      title: '必填',
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
      title: '显示类型',
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
      title: '字典类型',
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
      title="编辑生成配置"
      width="90%"
      open={open}
      onCancel={() => onOpenChange(false)}
      onOk={handleSubmit}
      confirmLoading={saving}
      destroyOnHidden
      okText="保存"
      cancelText="取消"
    >
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'info',
            label: '配置信息',
            children: (
              <Form
                form={form}
                labelCol={{ flex: '150px' }}
                style={{ marginTop: 8 }}
              >
                <div style={{ fontWeight: 600, marginBottom: 8 }}>基本信息</div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                  }}
                >
                  <Form.Item
                    name="tableName"
                    label="表名称"
                    rules={[{ required: true, message: '表名称不能为空' }]}
                  >
                    <Input placeholder="请输入表名称" />
                  </Form.Item>
                  <Form.Item name="tableComment" label="表描述">
                    <Input placeholder="请输入表描述" />
                  </Form.Item>
                </div>
                <div style={{ fontWeight: 600, margin: '16px 0 8px' }}>
                  生成信息
                </div>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                  }}
                >
                  <Form.Item
                    name="packageName"
                    label="生成包路径"
                    rules={[{ required: true, message: '生成包路径不能为空' }]}
                  >
                    <Input placeholder="如 com.xxl.boot" />
                  </Form.Item>
                  <Form.Item
                    name="moduleName"
                    label="生成模块名"
                    rules={[{ required: true, message: '生成模块名不能为空' }]}
                  >
                    <Input placeholder="如 system" />
                  </Form.Item>
                  <Form.Item
                    name="businessName"
                    label="生成业务名"
                    rules={[{ required: true, message: '生成业务名不能为空' }]}
                  >
                    <Input placeholder="如 user" />
                  </Form.Item>
                  <Form.Item
                    name="functionName"
                    label="生成功能名"
                    rules={[{ required: true, message: '生成功能名不能为空' }]}
                  >
                    <Input placeholder="如 用户管理" />
                  </Form.Item>
                  <Form.Item name="functionAuthor" label="生成功能作者">
                    <Input placeholder="如 xuxueli" />
                  </Form.Item>
                  <Form.Item name="formColNum" label="表单布局">
                    <Select
                      options={[
                        { value: 1, label: '单列' },
                        { value: 2, label: '双列' },
                        { value: 3, label: '三列' },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item name="tplCategory" label="生成模板">
                    <Select
                      options={[
                        { value: 'crud', label: '单表（crud）' },
                        { value: 'tree', label: '树表（tree）' },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item name="tplWebType" label="前端模板">
                    <Select options={tplWebTypeOptions} />
                  </Form.Item>
                  <Form.Item
                    name="remark"
                    label="备注"
                    style={{ gridColumn: '1 / -1' }}
                  >
                    <Input.TextArea rows={2} placeholder="请输入备注" />
                  </Form.Item>
                </div>
              </Form>
            ),
          },
          {
            key: 'fields',
            label: '字段信息',
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
                      footer={() => '拖拽行首把手可调整字段顺序'}
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
