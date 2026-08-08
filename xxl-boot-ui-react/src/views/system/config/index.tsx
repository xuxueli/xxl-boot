/**
 * 页面：Config（配置管理）
 * 功能：查询、新增、修改、删除系统配置
 * @author xuxueli 2026-08-09
 */
import { useEffect, useState } from 'react'
import { Button, Form, Input, Modal, Radio, Select, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import Pagination from '@/components/Pagination'
import RightToolbar from '@/components/RightToolbar'
import Auth from '@/components/Auth'
import { listConfig, getConfig, delConfig, addConfig, updateConfig } from '@/api/system/config'
import { useEnumOption } from '@/hooks/useEnumOption'
import { buildPageParams } from '@/hooks/buildPageParams'
import modal from '@/utils/modal'
import type { Config } from '@/types/api'
import type { EnumOption } from '@/types'

// --------------------------------- ref data ---------------------------------

/** 搜索栏：查询参数 */
interface ConfigQueryState {
  pageNum: number
  pageSize: number
  name?: string
  key?: string
  status?: number
  [key: string]: unknown
}

/** 表格：UI数据 */
interface TableState {
  list: Config[]
  total: number
  loading: boolean
  showSearch: boolean
  ids: number[]
  single: boolean
  multiple: boolean
}

/** 编辑表单：数据状态 */
interface FormState {
  visible: boolean
  title: string
  form: Partial<Config>
}

export default function Config() {
  // 页面初始化：加载配置列表
  useEffect(() => {
    getList()
     
  }, [])

  // 状态选项（从后端枚举接口加载，枚举项属性为 code、title）
  const { ConfigStatusEnum: statusOptions } = useEnumOption('ConfigStatusEnum')

  // 搜索栏：查询参数
  const [queryParams, setQueryParams] = useState<ConfigQueryState>({
    pageNum: 1,
    pageSize: 10,
    name: undefined,
    key: undefined,
    status: -1
  })

  // 表格：UI数据
  const [table, setTable] = useState<TableState>({
    list: [],
    total: 0,
    loading: true,
    showSearch: true,
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
  const [searchForm] = Form.useForm()
  const [editForm] = Form.useForm()

  // --------------------------------- fun ---------------------------------

  /** 查询配置列表 */
  function getList() {
    setTable((prev) => ({ ...prev, loading: true }))
    const params = buildPageParams(queryParams)()
    listConfig(params).then((response) => {
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
        name: undefined,
        key: undefined,
        value: undefined,
        status: 0,
        remark: undefined
      }
    }))
    editForm.resetFields()
  }

  /** 搜索按钮操作 */
  function handleQuery() {
    setQueryParams((prev) => ({ ...prev, pageNum: 1 }))
    getList()
  }

  /** 重置按钮操作 */
  function resetQuery() {
    searchForm.resetFields()
    setQueryParams((prev) => ({ ...prev, name: undefined, key: undefined, status: -1, pageNum: 1 }))
    handleQuery()
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

  /** 新增按钮操作 */
  function handleAdd() {
    reset()
    setFormState((prev) => ({ ...prev, visible: true, title: '新增配置' }))
  }

  /** 修改按钮操作（顶部按钮点击传入的是事件对象而非行数据，此时取勾选 id） */
  function handleUpdate(row: any) {
    reset()
    const id = row?.id ?? table.ids[0]
    if (id == null) {
      return
    }
    getConfig(id).then((response) => {
      setFormState((prev) => ({ ...prev, form: response.data, visible: true, title: '修改配置' }))
    })
  }

  /** 提交按钮 */
  function submitForm() {
    editForm.validateFields().then(() => {
      // 已有 id 走更新，否则走新增
      if (formState.form.id !== undefined) {
        updateConfig(formState.form as Config).then(() => {
          modal.msgSuccess('修改成功')
          setFormState((prev) => ({ ...prev, visible: false }))
          getList()
        })
      } else {
        addConfig(formState.form as Config).then(() => {
          modal.msgSuccess('新增成功')
          setFormState((prev) => ({ ...prev, visible: false }))
          getList()
        })
      }
    })
  }

  /** 删除按钮操作（顶部按钮点击传入的是事件对象而非行数据，此时取勾选 ids） */
  function handleDelete(row: any) {
    const configIds = row?.id ?? table.ids
    if (configIds == null || (Array.isArray(configIds) && configIds.length === 0)) {
      return
    }
    modal
      .confirm('是否确认删除配置编号为"' + configIds + '"的数据项？')
      .then(function () {
        return delConfig(configIds)
      })
      .then(() => {
        getList()
        modal.msgSuccess('删除成功')
      })
      .catch(() => {})
  }

  // --------------------------------- 表格列 ---------------------------------

  const columns: ColumnsType<Config> = [
    { title: '序号', dataIndex: 'id', key: 'id', width: 50, align: 'center' },
    { title: '配置名称', dataIndex: 'name', align: 'center', width: 180, ellipsis: true },
    { title: '配置Key', dataIndex: 'key', align: 'center', width: 180, ellipsis: true },
    { title: '配置Value', dataIndex: 'value', align: 'center', ellipsis: true },
    {
      title: '状态',
      key: 'status',
      width: 80,
      align: 'center',
      render: (_v, row) => (
        <Tag color={row.status === 0 ? 'green' : 'red'}>{statusText(Number(row.status))}</Tag>
      )
    },
    { title: '备注', dataIndex: 'remark', align: 'center', ellipsis: true },
    { title: '新增时间', dataIndex: 'addTime', align: 'center', width: 170 },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 150,
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
      {/* 搜索栏 */}
      <Form
        form={searchForm}
        layout="inline"
        style={{ display: table.showSearch ? 'flex' : 'none', marginBottom: 16, flexWrap: 'wrap', gap: '8px 0' }}
      >
        <Form.Item label="配置名称" name="name">
          <Input
            style={{ width: 200 }}
            placeholder="请输入配置名称"
            allowClear
            value={queryParams.name}
            onChange={(e) => setQueryParams((prev) => ({ ...prev, name: e.target.value }))}
            onPressEnter={handleQuery}
          />
        </Form.Item>
        <Form.Item label="配置Key" name="key">
          <Input
            style={{ width: 200 }}
            placeholder="请输入配置Key"
            allowClear
            value={queryParams.key}
            onChange={(e) => setQueryParams((prev) => ({ ...prev, key: e.target.value }))}
            onPressEnter={handleQuery}
          />
        </Form.Item>
        <Form.Item label="状态" name="status">
          <Select
            style={{ width: 200 }}
            placeholder="配置状态"
            allowClear
            value={queryParams.status}
            onChange={(v) => setQueryParams((prev) => ({ ...prev, status: v }))}
          >
            <Select.Option value={-1}>全部</Select.Option>
            {statusOptions.map((item: EnumOption) => (
              <Select.Option key={item.code} value={item.code}>
                {item.title}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" icon={<SearchOutlined />} onClick={handleQuery}>
            搜索
          </Button>
          <Button style={{ marginLeft: 8 }} icon={<ReloadOutlined />} onClick={resetQuery}>
            重置
          </Button>
        </Form.Item>
      </Form>

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
        <div style={{ marginLeft: 'auto' }}>
          <RightToolbar showSearch={table.showSearch} onUpdateShowSearch={(v) => setTable((prev) => ({ ...prev, showSearch: v }))} onQueryTable={getList} />
        </div>
      </div>

      {/* 配置列表 */}
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

      {/* 添加或修改配置对话框 */}
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
          <Form.Item label="配置名称" name="name" rules={[{ required: true, message: '配置名称不能为空' }]}>
            <Input placeholder="请输入配置名称" />
          </Form.Item>
          <Form.Item
            label="配置Key"
            name="key"
            rules={[
              { required: true, message: '配置Key不能为空' },
              { pattern: /^[a-z][a-z0-9.]*$/, message: '以小写字母开头，只能由小写字母、数字和点组成' },
              { min: 4, max: 100, message: '长度需在4-100之间' }
            ]}
          >
            <Input placeholder="请输入配置Key" disabled={formState.form.id !== undefined} />
          </Form.Item>
          <Form.Item label="配置Value" name="value" rules={[{ required: true, message: '配置Value不能为空' }]}>
            <Input.TextArea placeholder="请输入配置Value" />
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
          <Form.Item label="备注" name="remark">
            <Input.TextArea placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
