<#function tsType javaType>
  <#local t = (javaType!"")?string />
  <#if t == "String"><#return "string" /></#if>
  <#if t == "Integer" || t == "int" || t == "Long" || t == "long" || t == "Short" || t == "Byte" || t == "Double" || t == "double" || t == "Float" || t == "BigDecimal" || t == "Character"><#return "number" /></#if>
  <#if t == "Boolean" || t == "boolean"><#return "boolean" /></#if>
  <#if t == "Date" || t == "LocalDate" || t == "LocalDateTime" || t == "LocalTime"><#return "string" /></#if>
  <#return "any" />
</#function>
<#assign formColNum = codegen.formColNum!1 />
<#if formColNum lt 1><#assign formColNum = 1 /></#if>
<#assign hasDate = false>
<#assign hasNumber = false>
<#assign hasSelect = false>
<#if fields?? && fields?size gt 0>
<#list fields as field>
<#if (field.isInsert == "1" || field.isEdit == "1") && field.javaField != "id" && field.javaField != "parentId" && field.javaField != "addTime" && field.javaField != "updateTime">
<#if field.htmlType == "datetime"><#assign hasDate = true></#if>
<#if field.htmlType == "input" && tsType(field.javaType) == "number"><#assign hasNumber = true></#if>
<#if field.htmlType == "select" || field.htmlType == "radio" || field.htmlType == "checkbox"><#assign hasSelect = true></#if>
</#if>
</#list>
</#if>
<#assign treeLabelField = "name">
<#if fields?? && fields?size gt 0>
<#list fields as field>
<#if field.javaField != "id" && field.javaType == "String" && field.isList == "1">
<#assign treeLabelField = field.javaField>
<#break>
</#if>
</#list>
</#if>
/**
 * ${codegen.functionName}（树表列表页）
 * Created by ${codegen.functionAuthor} on '${.now?string('yyyy-MM-dd HH:mm:ss')}'.
 * 放置路径：src/pages/${codegen.moduleName}/${codegen.businessName?lower_case}/index.tsx
 */
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import { PageContainer } from '@ant-design/pro-components';
import { App, Button, Form, Input, Modal, Table, TreeSelect } from 'antd';
<#if hasNumber>
import { InputNumber } from 'antd';
</#if>
<#if hasDate>
import { DatePicker } from 'antd';
</#if>
<#if hasSelect>
import { Select } from 'antd';
</#if>
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { usePermission } from '@/hooks/usePermission';
import {
  add${codegen.businessName},
  del${codegen.businessName},
  get${codegen.businessName},
  list${codegen.businessName},
  update${codegen.businessName},
} from '@/services/${codegen.moduleName}/${codegen.businessName?lower_case}';

const ${codegen.businessName}List = () => {
  const { message, modal } = App.useApp();
  const { hasPermi } = usePermission();

  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<API.${codegen.businessName}[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [formCurrent, setFormCurrent] = useState<API.${codegen.businessName} | null>(null);
  const [saving, setSaving] = useState(false);

  /** 加载${codegen.functionName}树表列表 */
  const getList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await list${codegen.businessName}({ offset: 0, pagesize: 999 });
      setList((res.data as unknown as API.${codegen.businessName}[]) || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    getList();
  }, [getList]);

  /** 递归构造上级选项树 */
  const buildTreeData = useCallback(
    (rows: API.${codegen.businessName}[]): any[] =>
      (rows || []).map((item) => ({
        title: String(item.${treeLabelField} ?? item.id),
        value: item.id,
        children: item.children ? buildTreeData(item.children) : undefined,
      })),
    [],
  );
  const treeOptions = useMemo(() => buildTreeData(list), [buildTreeData, list]);

  /** 打开新增/编辑弹窗 */
  const openForm = (row?: API.${codegen.businessName}, parentId?: number) => {
    setFormCurrent(row || null);
    form.resetFields();
    if (row) {
      form.setFieldsValue(row);
    } else {
      form.setFieldsValue({ parentId: parentId || undefined });
    }
    setFormOpen(true);
  };

  /** 提交保存 */
  const handleSubmit = async () => {
    const values = await form.validateFields();
    setSaving(true);
    try {
      const data = formCurrent?.id ? { ...values, id: formCurrent.id } : values;
      if (formCurrent?.id) {
        await update${codegen.businessName}(data);
      } else {
        await add${codegen.businessName}(data);
      }
      message.success('操作成功');
      setFormOpen(false);
      getList();
    } finally {
      setSaving(false);
    }
  };

  /** 删除${codegen.functionName} */
  const handleDelete = (row?: API.${codegen.businessName}) => {
    const ids = row ? [row.id as number] : [];
    if (ids.length === 0) return;
    modal.confirm({
      title: '系统提示',
      content:
        '是否确认删除' + '${codegen.functionName}' + '编号为"' + row?.id + '"的数据项？',
      onOk: async () => {
        await del${codegen.businessName}(ids);
        message.success('删除成功');
        getList();
      },
    });
  };

  const columns = [
    { title: '${treeLabelField}', dataIndex: '${treeLabelField}', ellipsis: true },
<#if fields?? && fields?size gt 0>
<#list fields as field>
    { title: '${field.columnComment!field.javaField}', dataIndex: '${field.javaField}', ellipsis: true },
</#list>
</#if>
    {
      title: '操作',
      width: 200,
      render: (_: unknown, record: API.${codegen.businessName}) => [
        hasPermi('${codegen.moduleName}:${codegen.businessName?lower_case}:add') && (
          <a key="add-child" onClick={() => openForm(undefined, record.id)}>
            <PlusOutlined /> 新增
          </a>
        ),
        hasPermi('${codegen.moduleName}:${codegen.businessName?lower_case}:edit') && (
          <a key="edit" onClick={() => openForm(record)}>
            <EditOutlined /> 修改
          </a>
        ),
        hasPermi('${codegen.moduleName}:${codegen.businessName?lower_case}:remove') && (
          <a key="delete" onClick={() => handleDelete(record)}>
            <DeleteOutlined /> 删除
          </a>
        ),
      ],
    },
  ];

  return (
    <PageContainer ghost title={false}>
      <div style={{ marginBottom: 16 }}>
        {hasPermi('${codegen.moduleName}:${codegen.businessName?lower_case}:add') && (
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openForm()}>
            新增
          </Button>
        )}
      </div>

      <Table<API.${codegen.businessName}>
        rowKey="id"
        size="small"
        loading={loading}
        columns={columns}
        dataSource={list}
        pagination={false}
        childrenColumnName="children"
      />

      <Modal
        title={formCurrent?.id ? '修改${codegen.functionName}' : '新增${codegen.functionName}'}
        width={720}
        open={formOpen}
        onCancel={() => setFormOpen(false)}
        onOk={handleSubmit}
        confirmLoading={saving}
        destroyOnHidden
        okText="保存"
        cancelText="取消"
      >
        <Form
          form={form}
          layout="horizontal"
          labelCol={{ flex: '130px' }}
          style={{ marginTop: 8 }}
        >
          <Form.Item name="parentId" label="上级">
            <TreeSelect treeData={treeOptions} treeDefaultExpandAll placeholder="请选择上级" allowClear />
          </Form.Item>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(${formColNum}, 1fr)',
            }}
          >
<#if fields?? && fields?size gt 0>
<#list fields as field>
<#if (field.isInsert == "1" || field.isEdit == "1") && field.javaField != "id" && field.javaField != "parentId" && field.javaField != "addTime" && field.javaField != "updateTime">
<#assign comment = field.columnComment!field.javaField />
<#if field.htmlType == "input">
<#if tsType(field.javaType) == "number">
            <Form.Item
              name="${field.javaField}"
              label="${comment}"
              rules={[<#if (field.isRequired!"0") == "1">{ required: true, message: '${comment}不能为空' }</#if>]}
            >
              <InputNumber style={{ width: '100%' }} placeholder="请输入${comment}" />
            </Form.Item>
<#else>
            <Form.Item
              name="${field.javaField}"
              label="${comment}"
              rules={[<#if (field.isRequired!"0") == "1">{ required: true, message: '${comment}不能为空' }</#if>]}
            >
              <Input placeholder="请输入${comment}" />
            </Form.Item>
</#if>
<#elseif field.htmlType == "textarea">
            <Form.Item
              name="${field.javaField}"
              label="${comment}"
              rules={[<#if (field.isRequired!"0") == "1">{ required: true, message: '${comment}不能为空' }</#if>]}
            >
              <Input.TextArea rows={2} placeholder="请输入${comment}" />
            </Form.Item>
<#elseif field.htmlType == "datetime">
            <Form.Item
              name="${field.javaField}"
              label="${comment}"
              rules={[<#if (field.isRequired!"0") == "1">{ required: true, message: '${comment}不能为空' }</#if>]}
            >
              <DatePicker style={{ width: '100%' }} showTime placeholder="请选择${comment}" />
            </Form.Item>
<#elseif field.htmlType == "select" || field.htmlType == "radio" || field.htmlType == "checkbox">
            <Form.Item
              name="${field.javaField}"
              label="${comment}"
              rules={[<#if (field.isRequired!"0") == "1">{ required: true, message: '${comment}不能为空' }</#if>]}
            >
              {/* TODO: <#if field.dictType?has_content>字典（${field.dictType}）</#if>选项请按需填充 options */}
              <Select placeholder="请选择${comment}" options={[]} allowClear />
            </Form.Item>
<#else>
            <Form.Item
              name="${field.javaField}"
              label="${comment}"
              rules={[<#if (field.isRequired!"0") == "1">{ required: true, message: '${comment}不能为空' }</#if>]}
            >
              <Input placeholder="请输入${comment}（如需上传/富文本请替换组件）" />
            </Form.Item>
</#if>
</#if>
</#list>
</#if>
          </div>
        </Form>
      </Modal>
    </PageContainer>
  );
};

export default ${codegen.businessName}List;