/**
 * 页面：DictData（字典项管理）
 * 功能：查询、新增、修改、删除指定字典下的字典项
 * @author xuxueli 2026-08-09
 */
import { useEffect, useMemo, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Button, Form, Input, InputNumber, Modal, Radio, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, EditOutlined, DeleteOutlined, CloseOutlined } from '@ant-design/icons'
import Pagination from '@/components/Pagination'
import Auth from '@/components/Auth'
import { getType } from '@/api/system/dict/type'
import { listData, getData, delData, addData, updateData } from '@/api/system/dict/data'
import { useEnumOption } from '@/hooks/useEnumOption'
import { buildPageParams } from '@/hooks/buildPageParams'
import modal from '@/utils/modal'
import tab from '@/utils/tab'
import type { DictItem } from '@/types/api'
import type { EnumOption } from '@/types'
import './data.scss'

// --------------------------------- ref data ---------------------------------

/** 搜索栏：查询参数 */
interface DataQueryState {
  pageNum: number
  pageSize: number
  dictId?: number
  [key: string]: unknown
}

/** 表格：UI数据 */
interface TableState {
  list: DictItem[]
  total: number
  loading: boolean
  ids: number[]
  single: boolean
  multiple: boolean
}

/** 编辑表单：数据状态 */
interface FormState {
  visible: boolean
  title: string
  form: Partial<DictItem>
}

export default function DictData() {
  // 路由参数：当前字典ID（来自 tab.openPage 传入的 query）
  const location = useLocation()
  const dictId = useMemo(() => {
    const value = new URLSearchParams(location.search).get('dictId')
    return value ? Number(value) : undefined
  }, [location.search])

  // 页面初始化：加载字典名称、状态选项 + 字典项列表
  useEffect(() => {
    getDictName()
    getList()
     
  }, [])

  // 状态选项（从后端枚举接口加载，枚举项属性为 code、title）
  const { DictStatusEnum: statusOptions } = useEnumOption('DictStatusEnum')

  // 页面标题：字典名称
  const [dictName, setDictName] = useState<string | undefined>('')

  // 搜索栏：查询参数
  const [queryParams, setQueryParams] = useState<DataQueryState>({
    pageNum: 1,
    pageSize: 10,
    dictId
  })

  // 表格：UI数据
  const [table, setTable] = useState<TableState>({
    list: [],
    total: 0,
    loading: true,
    ids: [],
    single: true,
    multiple: true
  })

  // 编辑表单：数据状态
  const [formState, setFormState] = useState<FormState>({
    visible: false,
    title: '',
    form: {}
  })

  // 表单实例
  const [editForm] = Form.useForm()

  // --------------------------------- fun ---------------------------------

  /** 查询当前字典名称 */
  function getDictName() {
    if (dictId == null) {
      return
    }
    getType(dictId).then((response) => {
      setDictName(response.data ? response.data.name : '')
    })
  }

  /** 查询字典项列表 */
  function getList() {
    setTable((prev) => ({ ...prev, loading: true }))
    const params = buildPageParams(queryParams)()
    // 字典ID为空（无路由来源进入）时不携带该参数，避免后端可选 long 参数收到空值
    if (dictId != null) {
      params.dictId = dictId
    }
    listData(params).then((response) => {
      setTable((prev) => ({
        ...prev,
        list: response.data.data,
        total: response.data.total,
        loading: false
      }))
    })
  }

  /** 状态编码 → 文案 */
  function statusText(status: number) {
    const item = statusOptions.find((i) => i.code === status)
    return item ? item.title : status
  }

  /** 取消按钮 */
  function cancel() {
    setFormState((prev) => ({ ...prev, visible: false }))
    reset()
  }

  /** 表单重置 */
  function reset() {
    setFormState((prev) => ({
      ...prev,
      form: {
        id: undefined,
        dictId,
        name: undefined,
        code: undefined,
        status: 0,
        order: 0,
        remark: undefined
      }
    }))
    editForm.resetFields()
  }

  /** 返回按钮操作 */
  function handleClose() {
    const obj = { path: '/system/dict' }
    tab.closeOpenPage(obj)
  }

  /** 新增按钮操作 */
  function handleAdd() {
    reset()
    setFormState((prev) => ({ ...prev, visible: true, title: '新增字典项' }))
  }

  /** 多选框选中数据 */
  function handleSelectionChange(selectedRowKeys: React.Key[]) {
    const ids = selectedRowKeys.map((k) => Number(k))
    setTable((prev) => ({
      ...prev,
      ids,
      single: selectedRowKeys.length !== 1,
      multiple: !selectedRowKeys.length
    }))
  }

  /** 修改按钮操作（顶部按钮点击传入的是事件对象而非行数据，此时取勾选 id） */
  function handleUpdate(row: any) {
    reset()
    const id = row?.id ?? table.ids[0]
    if (id == null) {
      return
    }
    getData(id).then((response) => {
      setFormState((prev) => ({ ...prev, form: response.data, visible: true, title: '修改字典项' }))
    })
  }

  /** 提交按钮 */
  function submitForm() {
    editForm.validateFields().then(() => {
      // 已有 id 走更新，否则走新增
      if (formState.form.id !== undefined) {
        updateData(formState.form as DictItem).then(() => {
          modal.msgSuccess('修改成功')
          setFormState((prev) => ({ ...prev, visible: false }))
          getList()
        })
      } else {
        addData(formState.form as DictItem).then(() => {
          modal.msgSuccess('新增成功')
          setFormState((prev) => ({ ...prev, visible: false }))
          getList()
        })
      }
    })
  }

  /** 删除按钮操作（顶部按钮点击传入的是事件对象而非行数据，此时取勾选 ids） */
  function handleDelete(row: any) {
    const itemIds = row?.id ?? table.ids
    if (itemIds == null || (Array.isArray(itemIds) && itemIds.length === 0)) {
      return
    }
    modal
      .confirm('是否确认删除字典项编号为"' + itemIds + '"的数据项？')
      .then(function () {
        return delData(itemIds)
      })
      .then(() => {
        getList()
        modal.msgSuccess('删除成功')
      })
      .catch(() => {})
  }

  // --------------------------------- 表格列 ---------------------------------

  const columns: ColumnsType<DictItem> = [
    { title: '序号', dataIndex: 'id', key: 'id', width: 80, align: 'center' },
    { title: '字典项名称', dataIndex: 'name', align: 'center', width: 180, ellipsis: true },
    { title: '字典项Code', dataIndex: 'code', align: 'center', ellipsis: true },
    {
      title: '状态',
      key: 'status',
      width: 80,
      align: 'center',
      render: (_v, row) => (
        <Tag color={row.status === 0 ? 'green' : 'red'}>{statusText(Number(row.status))}</Tag>
      )
    },
    { title: '顺序', dataIndex: 'order', align: 'center', width: 80 },
    { title: '备注', dataIndex: 'remark', align: 'center', ellipsis: true },
    { title: '新增时间', dataIndex: 'addTime', align: 'center', width: 170 },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 160,
      render: (_v, row) => (
        <Auth roles={['admin']}>
          <a style={{ marginRight: 8 }} onClick={() => handleUpdate(row)}>
            <EditOutlined /> 修改
          </a>
          <a onClick={() => handleDelete(row)}>
            <DeleteOutlined /> 删除
          </a>
        </Auth>
      )
    }
  ]

  return (
    <div className="app-container">
      {/* 页面标题 */}
      <div className="dict-data-header">
        <span>字典名称：{dictName}</span>
      </div>

      {/* 操作按钮 */}
      <div className="mb8" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Auth roles={['admin']}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            新增
          </Button>
          <Button icon={<EditOutlined />} disabled={table.single} onClick={handleUpdate}>
            修改
          </Button>
          <Button danger icon={<DeleteOutlined />} disabled={table.multiple} onClick={handleDelete}>
            删除
          </Button>
        </Auth>
        <Button icon={<CloseOutlined />} onClick={handleClose}>
          关闭
        </Button>
      </div>

      {/* 字典项列表 */}
      <Table
        rowKey={(record) => String(record.id)}
        loading={table.loading}
        dataSource={table.list}
        columns={columns}
        rowSelection={{ onChange: handleSelectionChange }}
        pagination={false}
      />

      {/* 分页 */}
      <div style={{ display: table.total > 0 ? 'block' : 'none' }}>
        <Pagination
          total={table.total}
          page={queryParams.pageNum}
          limit={queryParams.pageSize}
          onPageChange={(v) => setQueryParams((prev) => ({ ...prev, pageNum: v }))}
          onLimitChange={(v) => setQueryParams((prev) => ({ ...prev, pageSize: v }))}
          onPagination={getList}
        />
      </div>

      {/* 添加或修改字典项对话框 */}
      <Modal
        title={formState.title}
        open={formState.visible}
        width={500}
        onCancel={cancel}
        onOk={submitForm}
        okText="确 定"
        cancelText="取 消"
        destroyOnClose
      >
        <Form
          form={editForm}
          labelCol={{ span: 6 }}
          initialValues={formState.form}
          onValuesChange={(changed) => setFormState((prev) => ({ ...prev, form: { ...prev.form, ...changed } }))}
        >
          <Form.Item label="字典项名称" name="name" rules={[{ required: true, message: '字典项名称不能为空' }]}>
            <Input placeholder="请输入字典项名称" />
          </Form.Item>
          <Form.Item
            label="字典项Code"
            name="code"
            rules={[
              { required: true, message: '字典项Code不能为空' },
              { pattern: /^[0-9]+$/, message: '只允许输入数字' },
              {
                validator: (_rule, value) => {
                  const n = Number(value)
                  if (value == null || value === '' || (n >= 1 && n <= 10000000)) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('需在1-10000000之间'))
                }
              }
            ]}
          >
            <Input placeholder="请输入字典项Code" disabled={formState.form.id !== undefined} />
          </Form.Item>
          <Form.Item label="状态" name="status">
            <Radio.Group>
              {statusOptions.map((item: EnumOption) => (
                <Radio key={item.code} value={item.code}>
                  {item.title}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
          <Form.Item label="顺序" name="order" rules={[{ required: true, message: '顺序不能为空' }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <Input.TextArea placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
