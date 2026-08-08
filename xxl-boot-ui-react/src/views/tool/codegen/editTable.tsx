/**
 * 组件：代码生成编辑弹框
 * 功能：修改已导入表的配置信息（基本信息 + 生成信息 + 字段配置）
 * @author xuxueli 2026-08-09
 */
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { Button, Checkbox, Col, Divider, Form, Input, Modal, Row, Select, Table, Tabs } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import Sortable from 'sortablejs'
import { getGenTable, updateGenTable } from '@/api/tool/codegen'
import { queryDictList, type DictSelectOption } from '@/api/system/dict/type'
import modal from '@/utils/modal'
import './editTable.scss'

export interface EditTableHandle {
  /** 打开编辑弹框 */
  open: (id: number) => void
}

/** 组件入参类型 */
interface EditTableProps {
  /** 提交成功后回调（父组件刷新列表） */
  onOk?: () => void
}

/** Java 类型下拉选项 */
const javaTypeOptions = ['Long', 'String', 'Integer', 'Double', 'BigDecimal', 'Date', 'Boolean']

/** 查询方式下拉选项 */
const queryTypeOptions = [
  { label: '=', value: 'EQ' },
  { label: '!=', value: 'NE' },
  { label: '>', value: 'GT' },
  { label: '>=', value: 'GTE' },
  { label: '<', value: 'LT' },
  { label: '<=', value: 'LTE' },
  { label: 'LIKE', value: 'LIKE' },
  { label: 'BETWEEN', value: 'BETWEEN' }
]

/** 显示类型下拉选项 */
const htmlTypeOptions = [
  { label: '文本框', value: 'input' },
  { label: '文本域', value: 'textarea' },
  { label: '下拉框', value: 'select' },
  { label: '单选框', value: 'radio' },
  { label: '复选框', value: 'checkbox' },
  { label: '日期控件', value: 'datetime' },
  { label: '图片上传', value: 'imageUpload' },
  { label: '文件上传', value: 'fileUpload' },
  { label: '富文本控件', value: 'editor' }
]

/**
 * 代码生成编辑弹框
 */
const EditTable = forwardRef<EditTableHandle, EditTableProps>(function EditTable({ onOk }, ref) {
  // 当前 TAB
  const [activeName, setActiveName] = useState('basic')
  // 字段列表
  const [columns, setColumns] = useState<any[]>([])
  // 字典类型选项
  const [dictOptions, setDictOptions] = useState<DictSelectOption[]>([])
  // 表配置信息
  const [info, setInfo] = useState<Record<string, any>>({})
  // 弹框显隐
  const [visible, setVisible] = useState(false)
  // 当前编辑的表 ID
  const tableIdRef = useRef(0)
  // 字段表格 ref，用于拖拽排序
  const fieldTableRef = useRef<HTMLDivElement>(null)

  // 基本信息表单实例
  const [basicForm] = Form.useForm()
  // 生成信息表单实例
  const [genForm] = Form.useForm()

  /**
   * 打开编辑弹框（暴露组件方法）
   * @param id 表编码
   */
  function open(id: number) {
    tableIdRef.current = id
    setActiveName('basic')
    setInfo({ formColNum: 1, tplWebType: 'element-plus-typescript' })
    setColumns([])
    setVisible(true)

    // 加载表配置 + 字段列表
    getGenTable(id).then((res) => {
      const { fieldList, ...rest } = (res.data || {}) as { fieldList?: any[]; [key: string]: any }
      const nextInfo: Record<string, any> = { formColNum: 1, tplWebType: 'element-plus-typescript', ...rest }
      /* 校验默认值是否在可选范围内 */
      if (![1, 2, 3].includes(nextInfo.formColNum)) nextInfo.formColNum = 1
      if (nextInfo.tplWebType !== 'element-plus-typescript') nextInfo.tplWebType = 'element-plus-typescript'
      const nextColumns = (fieldList || []).map((col) => {
        /* id 主键字段：插入/编辑不可勾选，强制置 0（自增主键不参与新增/编辑） */
        if (col.javaField === 'id') {
          col.isInsert = '0'
          col.isEdit = '0'
        }
        return col
      })
      setInfo(nextInfo)
      setColumns(nextColumns)
      basicForm.setFieldsValue(nextInfo)
      genForm.setFieldsValue(nextInfo)
    })

    // 加载字典类型下拉
    queryDictList().then((response) => {
      setDictOptions(response.data || [])
    })
  }

  // 暴露命令式方法
  useImperativeHandle(ref, () => ({ open }))

  /**
   * 更新字段行数据
   */
  function updateColumn(row: any, patch: Record<string, unknown>) {
    setColumns((prev) => prev.map((col) => (col.id === row.id ? { ...col, ...patch } : col)))
  }

  /**
   * 提交保存
   */
  function submitForm() {
    /* 校验两个表单 */
    Promise.all([basicForm.validateFields(), genForm.validateFields()])
      .then(() => {
        const genTable: Record<string, any> = {
          ...info,
          ...basicForm.getFieldsValue(),
          ...genForm.getFieldsValue(),
          fieldList: columns
        }
        updateGenTable(genTable).then((res) => {
          if (res.code === 200) {
            modal.msgSuccess(res.msg)
            setVisible(false)
            onOk && onOk()
          }
        })
      })
      .catch(() => {
        modal.msgError('表单校验未通过，请重新检查提交内容')
      })
  }

  // 拖拽排序：切换到字段信息 TAB 时初始化，确保 DOM 已渲染
  useEffect(() => {
    if (activeName !== 'columnInfo' || !columns.length) {
      return
    }
    const tbody = fieldTableRef.current?.querySelector('.ant-table-tbody') as HTMLElement | null
    if (!tbody || (tbody as any).__sortable) {
      return
    }
    ;(tbody as any).__sortable = Sortable.create(tbody, {
      handle: '.allowDrag',
      animation: 150,
      ghostClass: 'sortable-ghost',
      onStart: () => (document.onselectstart = () => false),
      onEnd: (evt) => {
        document.onselectstart = null
        setColumns((prev) => {
          const next = [...prev]
          const [item] = next.splice(evt.oldIndex ?? 0, 1)
          next.splice(evt.newIndex ?? 0, 0, item)
          return next.map((c, i) => ({ ...c, sort: i + 1 }))
        })
      }
    })
     
  }, [activeName])

  // --------------------------------- 字段表格列 ---------------------------------

  const fieldColumns: ColumnsType<any> = [
    {
      title: '序号',
      key: 'index',
      width: 60,
      align: 'center',
      className: 'allowDrag',
      render: (_v, _row, index) => <span>{(index ?? 0) + 1}</span>
    },
    { title: '字段列名', dataIndex: 'columnName', ellipsis: true, className: 'allowDrag' },
    {
      title: '字段描述',
      key: 'columnComment',
      render: (_v, row) => (
        <Input value={row.columnComment} onChange={(e) => updateColumn(row, { columnComment: e.target.value })} />
      )
    },
    {
      title: 'Java类型',
      key: 'javaType',
      render: (_v, row) => (
        <Select value={row.javaType} onChange={(v) => updateColumn(row, { javaType: v })} style={{ width: '100%' }}>
          {javaTypeOptions.map((item) => (
            <Select.Option key={item} value={item}>
              {item}
            </Select.Option>
          ))}
        </Select>
      )
    },
    {
      title: 'java属性',
      key: 'javaField',
      render: (_v, row) => (
        <Input value={row.javaField} onChange={(e) => updateColumn(row, { javaField: e.target.value })} />
      )
    },
    {
      title: '插入',
      key: 'isInsert',
      width: 60,
      align: 'center',
      render: (_v, row) => (
        <Checkbox
          checked={row.isInsert === '1'}
          disabled={row.javaField === 'id'}
          onChange={(e) => updateColumn(row, { isInsert: e.target.checked ? '1' : '0' })}
        />
      )
    },
    {
      title: '编辑',
      key: 'isEdit',
      width: 60,
      align: 'center',
      render: (_v, row) => (
        <Checkbox
          checked={row.isEdit === '1'}
          disabled={row.javaField === 'id'}
          onChange={(e) => updateColumn(row, { isEdit: e.target.checked ? '1' : '0' })}
        />
      )
    },
    {
      title: '列表',
      key: 'isList',
      width: 60,
      align: 'center',
      render: (_v, row) => (
        <Checkbox
          checked={row.isList === '1'}
          disabled={row.javaField === 'id'}
          onChange={(e) => updateColumn(row, { isList: e.target.checked ? '1' : '0' })}
        />
      )
    },
    {
      title: '查询',
      key: 'isQuery',
      width: 60,
      align: 'center',
      render: (_v, row) => (
        <Checkbox
          checked={row.isQuery === '1'}
          disabled={row.javaField === 'id'}
          onChange={(e) => updateColumn(row, { isQuery: e.target.checked ? '1' : '0' })}
        />
      )
    },
    {
      title: '查询方式',
      key: 'queryType',
      render: (_v, row) => (
        <Select value={row.queryType} onChange={(v) => updateColumn(row, { queryType: v })} style={{ width: '100%' }}>
          {queryTypeOptions.map((item) => (
            <Select.Option key={item.value} value={item.value}>
              {item.label}
            </Select.Option>
          ))}
        </Select>
      )
    },
    {
      title: '必填',
      key: 'isRequired',
      width: 60,
      align: 'center',
      render: (_v, row) => (
        <Checkbox
          checked={row.isRequired === '1'}
          onChange={(e) => updateColumn(row, { isRequired: e.target.checked ? '1' : '0' })}
        />
      )
    },
    {
      title: '显示类型',
      key: 'htmlType',
      render: (_v, row) => (
        <Select value={row.htmlType} onChange={(v) => updateColumn(row, { htmlType: v })} style={{ width: '100%' }}>
          {htmlTypeOptions.map((item) => (
            <Select.Option key={item.value} value={item.value}>
              {item.label}
            </Select.Option>
          ))}
        </Select>
      )
    },
    {
      title: '字典类型',
      key: 'dictType',
      render: (_v, row) => (
        <Select
          value={row.dictType}
          placeholder="请选择"
          allowClear
          showSearch
          onChange={(v) => updateColumn(row, { dictType: v })}
          style={{ width: '100%' }}
        >
          {dictOptions.map((item) => (
            <Select.Option key={item.dictType} value={item.dictType}>
              <span style={{ float: 'left' }}>{item.dictName}</span>
              <span style={{ float: 'right', color: '#8492a6', fontSize: 13 }}>{item.dictType}</span>
            </Select.Option>
          ))}
        </Select>
      )
    }
  ]

  // TAB 数据
  const tabItems = [
    {
      key: 'basic',
      label: '配置信息',
      children: (
        <div>
          {/* 基本信息 */}
          <h4 style={{ margin: '0 0 8px 0', fontWeight: 600 }}>基本信息</h4>
          <Form form={basicForm} labelCol={{ flex: '150px' }}>
            <Row>
              <Col span={12}>
                <Form.Item label="表名称" name="tableName" rules={[{ required: true, message: '请输入表名称' }]}>
                  <Input placeholder="请输入表名称" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="表描述" name="tableComment">
                  <Input placeholder="请输入表描述" />
                </Form.Item>
              </Col>
            </Row>
          </Form>

          <Divider style={{ margin: '8px 0' }} />

          {/* 生成信息 */}
          <h4 style={{ margin: '0 0 8px 0', fontWeight: 600 }}>生成信息</h4>
          <Form form={genForm} labelCol={{ flex: '150px' }}>
            <Row>
              <Col span={12}>
                <Form.Item
                  label="生成包路径"
                  name="packageName"
                  rules={[{ required: true, message: '请输入生成包路径' }]}
                >
                  <Input placeholder="com.xxl.boot.api.business" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="生成模块名" name="moduleName" rules={[{ required: true, message: '请输入生成模块名' }]}>
                  <Input placeholder="system" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="生成业务名"
                  name="businessName"
                  rules={[{ required: true, message: '请输入生成业务名' }]}
                >
                  <Input placeholder="User" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="生成功能名"
                  name="functionName"
                  rules={[{ required: true, message: '请输入生成功能名' }]}
                >
                  <Input placeholder="用户管理" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="生成功能作者" name="functionAuthor">
                  <Input placeholder="xxl-boot" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="表单布局" name="formColNum">
                  <Select style={{ width: '100%' }}>
                    <Select.Option value={1}>单列</Select.Option>
                    <Select.Option value={2}>双列</Select.Option>
                    <Select.Option value={3}>三列</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="使用的模板" name="tplCategory">
                  <Select style={{ width: '100%' }}>
                    <Select.Option value="crud">单表（增删改查）</Select.Option>
                    <Select.Option value="tree">树表（增删改查）</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="前端模板类型" name="tplWebType">
                  <Select style={{ width: '100%' }}>
                    <Select.Option value="element-plus-typescript">Element Plus + TypeScript</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item label="备注" name="remark">
                  <Input.TextArea rows={2} placeholder="请输入备注" />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      )
    },
    {
      key: 'columnInfo',
      label: '字段信息',
      children: (
        <div ref={fieldTableRef}>
          <Table
            rowKey="id"
            dataSource={columns}
            columns={fieldColumns}
            pagination={false}
            scroll={{ y: 420 }}
            size="small"
          />
        </div>
      )
    }
  ]

  return (
    <Modal
      title="修改生成配置"
      open={visible}
      width="90%"
      style={{ top: '3vh' }}
      onCancel={() => setVisible(false)}
      destroyOnClose
      footer={
        <div>
          <Button type="primary" onClick={submitForm}>
            提交
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={() => setVisible(false)}>
            取消
          </Button>
        </div>
      }
    >
      <Tabs activeKey={activeName} onChange={setActiveName} items={tabItems} />
    </Modal>
  )
})

EditTable.displayName = 'EditTable'
export default EditTable
