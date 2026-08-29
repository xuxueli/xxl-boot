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
<#if (field.isInsert == "1" || field.isEdit == "1") && field.javaField != "id" && field.javaField != "addTime" && field.javaField != "updateTime">
<#if field.htmlType == "datetime"><#assign hasDate = true></#if>
<#if field.htmlType == "input" && tsType(field.javaType) == "number"><#assign hasNumber = true></#if>
<#if field.htmlType == "select" || field.htmlType == "radio" || field.htmlType == "checkbox"><#assign hasSelect = true></#if>
</#if>
</#list>
</#if>
/**
 * ${codegen.functionName}（列表页）
 * Created by ${codegen.functionAuthor} on '${.now?string('yyyy-MM-dd HH:mm:ss')}'.
 * 放置路径：src/pages/${codegen.moduleName}/${codegen.businessName?lower_case}/index.tsx
 */
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { App, Button, Form, Input, Modal } from 'antd';
<#if hasNumber>
import { InputNumber } from 'antd';
</#if>
<#if hasDate>
import { DatePicker } from 'antd';
</#if>
<#if hasSelect>
import { Select } from 'antd';
</#if>
import { createStyles } from 'antd-style';
import React, { useRef, useState } from 'react';
import { usePermission } from '@/hooks/usePermission';
import {
  add${codegen.businessName},
  del${codegen.businessName},
  get${codegen.businessName},
  list${codegen.businessName},
  update${codegen.businessName},
} from '@/services/${codegen.moduleName}/${codegen.businessName?lower_case}';

/**
 * 表格样式
 * 功能：顶部操作按钮靠左展示，密度/刷新等设置项仍靠右
 */
const useStyles = createStyles(({ css }) => ({
  table: css`
    .ant-pro-table-list-toolbar-container {
      justify-content: flex-start;
    }

    .ant-pro-table-list-toolbar-container .ant-pro-table-list-toolbar-right {
      justify-content: flex-start;
    }

    .ant-pro-table-list-toolbar-container
      .ant-pro-table-list-toolbar-right
      .ant-pro-table-list-toolbar-setting-items {
      margin-left: auto;
    }
  `,
}));

const ${codegen.businessName}List = () => {
  const { message, modal } = App.useApp();
  const actionRef = useRef<ActionType>(null);
  const { hasPermi } = usePermission();
  const { styles } = useStyles();

  const [form] = Form.useForm();
  const [formOpen, setFormOpen] = useState(false);
  const [formCurrent, setFormCurrent] = useState<API.${codegen.businessName} | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);

  /** 打开新增/编辑弹窗 */
  const openForm = (row?: API.${codegen.businessName}) => {
    setFormCurrent(row || null);
    form.resetFields();
    if (row) {
      form.setFieldsValue(row);
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
      actionRef.current?.reload();
    } finally {
      setSaving(false);
    }
  };

  /** 删除${codegen.functionName} */
  const handleDelete = (row?: API.${codegen.businessName}) => {
    const ids = row ? [row.id as number] : selectedIds;
    if (ids.length === 0) return;
    modal.confirm({
      title: '系统提示',
      content:
        '是否确认删除' + '${codegen.functionName}' + '编号为"' +
        (row ? row.id : ids.join(',')) +
        '"的数据项？',
      onOk: async () => {
        await del${codegen.businessName}(ids);
        message.success('删除成功');
        setSelectedIds([]);
        actionRef.current?.reload();
      },
    });
  };

  const columns: ProColumns<API.${codegen.businessName}>[] = [
    { title: '序号', dataIndex: 'id', search: false, width: 80 },
<#if fields?? && fields?size gt 0>
<#list fields as field>
<#if field.isList == "1">
    {
      title: '${field.columnComment!field.javaField}',
      dataIndex: '${field.javaField}',<#if field.isQuery != "1"> search: false,</#if><#if field.htmlType == "textarea"> ellipsis: true,</#if>
    },
<#elseif field.isQuery == "1">
    {
      title: '${field.columnComment!field.javaField}',
      dataIndex: '${field.javaField}',
      hideInTable: true,
    },
</#if>
</#list>
</#if>
    {
      title: '操作',
      valueType: 'option',
      width: 140,
      render: (_, record) => [
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
      <div className={styles.table}>
        <ProTable<API.${codegen.businessName}>
          actionRef={actionRef}
          rowKey="id"
          columns={columns}
          search={{
            labelWidth: 80,
            optionRender: (_searchConfig, _formProps, dom) => [...dom.reverse()],
          }}
          request={async (params) => {
            const res = await list${codegen.businessName}(params);
            return {
              data: res.data?.data || [],
              total: res.data?.total || 0,
              success: true,
            };
          }}
          toolBarRender={() => [
            hasPermi('${codegen.moduleName}:${codegen.businessName?lower_case}:add') && (
              <Button
                key="add"
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => openForm()}
              >
                新增
              </Button>
            ),
            hasPermi('${codegen.moduleName}:${codegen.businessName?lower_case}:edit') && (
              <Button
                key="edit"
                icon={<EditOutlined />}
                disabled={selectedIds.length !== 1}
                onClick={() => openForm({ id: selectedIds[0] })}
              >
                修改
              </Button>
            ),
            hasPermi('${codegen.moduleName}:${codegen.businessName?lower_case}:remove') && (
              <Button
                key="delete"
                danger
                icon={<DeleteOutlined />}
                disabled={!selectedIds.length}
                onClick={() => handleDelete()}
              >
                删除
              </Button>
            ),
          ]}
          rowSelection={{
            onChange: (_keys, rows) => {
              setSelectedIds(rows.map((r) => r.id as number));
            },
          }}
          tableAlertRender={false}
        />
      </div>

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
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(${formColNum}, 1fr)',
            }}
          >
<#if fields?? && fields?size gt 0>
<#list fields as field>
<#if (field.isInsert == "1" || field.isEdit == "1") && field.javaField != "id" && field.javaField != "addTime" && field.javaField != "updateTime">
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