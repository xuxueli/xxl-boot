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
import { App, Checkbox, Form, Input, Modal, Select, Table, Tabs } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import React, { useEffect, useState } from 'react';
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
const queryTypeOptions = [
  'EQ',
  'NE',
  'GT',
  'GTE',
  'LT',
  'LTE',
  'LIKE',
  'BETWEEN',
];
const htmlTypeOptions = [
  'input',
  'textarea',
  'select',
  'radio',
  'checkbox',
  'datetime',
  'imageUpload',
  'fileUpload',
  'editor',
];

/** 可拖拽表格行 */
const SortableRow = (props: any) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props['data-row-key'] });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 999 } : {}),
  };
  return (
    <tr
      ref={setNodeRef}
      style={style}
      {...props}
      {...attributes}
      {...listeners}
    />
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
          setInfo(rest);
          setFields(fieldList.map((f) => ({ ...f })));
          form.setFieldsValue(rest);
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
      width: 48,
      align: 'center',
      render: (_, _r, index) => index + 1,
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
      width: 110,
      render: (_, record) => (
        <Select
          size="small"
          value={record.javaType}
          options={javaTypeOptions.map((v) => ({ value: v, label: v }))}
          onChange={(v) => updateField(record.id, { javaType: v })}
        />
      ),
    },
    {
      title: 'Java属性',
      dataIndex: 'javaField',
      width: 120,
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
      width: 100,
      render: (_, record) => (
        <Select
          size="small"
          value={record.queryType}
          options={queryTypeOptions.map((v) => ({ value: v, label: v }))}
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
      width: 120,
      render: (_, record) => (
        <Select
          size="small"
          value={record.htmlType}
          options={htmlTypeOptions.map((v) => ({ value: v, label: v }))}
          onChange={(v) => updateField(record.id, { htmlType: v })}
        />
      ),
    },
    {
      title: '字典类型',
      dataIndex: 'dictType',
      width: 130,
      render: (_, record) => (
        <Select
          size="small"
          value={record.dictType}
          allowClear
          showSearch
          filterOption={(input, option) =>
            String(option?.label || '')
              .toLowerCase()
              .includes(input.toLowerCase())
          }
          options={dictOptions}
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
              <Form form={form} layout="vertical" style={{ marginTop: 8 }}>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>基本信息</div>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  <Form.Item
                    name="tableName"
                    label="表名称"
                    rules={[{ required: true, message: '表名称不能为空' }]}
                    style={{ width: 260 }}
                  >
                    <Input placeholder="请输入表名称" />
                  </Form.Item>
                  <Form.Item
                    name="tableComment"
                    label="表描述"
                    style={{ width: 260 }}
                  >
                    <Input placeholder="请输入表描述" />
                  </Form.Item>
                </div>
                <div style={{ fontWeight: 600, marginBottom: 8 }}>生成信息</div>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                  <Form.Item
                    name="packageName"
                    label="生成包路径"
                    rules={[{ required: true, message: '生成包路径不能为空' }]}
                    style={{ width: 240 }}
                  >
                    <Input placeholder="如 com.xxl.boot" />
                  </Form.Item>
                  <Form.Item
                    name="moduleName"
                    label="生成模块名"
                    rules={[{ required: true, message: '生成模块名不能为空' }]}
                    style={{ width: 180 }}
                  >
                    <Input placeholder="如 system" />
                  </Form.Item>
                  <Form.Item
                    name="businessName"
                    label="生成业务名"
                    rules={[{ required: true, message: '生成业务名不能为空' }]}
                    style={{ width: 180 }}
                  >
                    <Input placeholder="如 user" />
                  </Form.Item>
                  <Form.Item
                    name="functionName"
                    label="生成功能名"
                    rules={[{ required: true, message: '生成功能名不能为空' }]}
                    style={{ width: 180 }}
                  >
                    <Input placeholder="如 用户管理" />
                  </Form.Item>
                  <Form.Item
                    name="functionAuthor"
                    label="生成作者"
                    style={{ width: 180 }}
                  >
                    <Input placeholder="如 xuxueli" />
                  </Form.Item>
                  <Form.Item
                    name="formColNum"
                    label="表单布局"
                    style={{ width: 180 }}
                  >
                    <Select
                      options={[
                        { value: 1, label: '1列' },
                        { value: 2, label: '2列' },
                        { value: 3, label: '3列' },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item
                    name="tplCategory"
                    label="生成模板"
                    style={{ width: 180 }}
                  >
                    <Select
                      options={[
                        { value: 'crud', label: '单表（crud）' },
                        { value: 'tree', label: '树表（tree）' },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item
                    name="tplWebType"
                    label="前端模板"
                    style={{ width: 200 }}
                  >
                    <Select
                      options={[
                        {
                          value: 'element-plus-typescript',
                          label: 'element-plus-typescript',
                        },
                      ]}
                    />
                  </Form.Item>
                  <Form.Item name="remark" label="备注" style={{ width: 520 }}>
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
