/**
 * 页面：Message（站内消息管理）
 * 功能：站内消息列表查询、新增、修改、删除、查看详情、查看已读用户
 */
import { useEffect, useRef, useState } from 'react'
import { Button, Form, Input, Modal, Radio, Select, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons'
import ReadUsers, { type ReadUsersHandle } from './ReadUsers'
import HeaderMessageDetail, { type HeaderMessageDetailHandle } from '@/layout/components/Navbar/HeaderMessageDetail'
import Editor from '@/components/Editor'
import Pagination from '@/components/Pagination'
import RightToolbar from '@/components/RightToolbar'
import Auth from '@/components/Auth'
import { listMessage, getMessage, delMessage, addMessage, updateMessage } from '@/api/system/message'
import { useEnumOption } from '@/hooks/useEnumOption'
import { buildPageParams } from '@/hooks/buildPageParams'
import modal from '@/utils/modal'
import type { Message, MessageQuery } from '@/types/api'
import type { EnumOption } from '@/types'

// --------------------------------- ref data ---------------------------------

/** 搜索栏：查询参数 */
interface MessageQueryState {
  pageNum: number
  pageSize: number
  category?: number
  status?: number
  title?: string
  [key: string]: unknown
}

/** 表格：UI数据 */
interface TableState {
  list: Message[]
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
  form: Partial<Message>
}

export default function Message() {
  const messageViewRef = useRef<HeaderMessageDetailHandle>(null)
  const readUsersRef = useRef<ReadUsersHandle>(null)

  // 页面初始化：加载消息列表
  useEffect(() => {
    getList()
     
  }, [])

  // 筛选项数据：消息分类 + 消息状态
  const { MessageCategoryEnum: categoryOptions, MessageStatusEnum: statusOptions } = useEnumOption(
    'MessageCategoryEnum',
    'MessageStatusEnum'
  )

  // 搜索栏：查询参数
  const [queryParams, setQueryParams] = useState<MessageQueryState>({
    pageNum: 1,
    pageSize: 10,
    category: -1,
    status: -1,
    title: undefined
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

  /** 查询消息列表 */
  function getList() {
    setTable((prev) => ({ ...prev, loading: true }))
    const params = buildPageParams(queryParams)()
    listMessage(params).then((response) => {
      setTable((prev) => ({
        ...prev,
        list: response.data.data,
        total: response.data.total,
        loading: false
      }))
    })
  }

  /** 分类编码 → 文案 */
  function categoryText(category: number) {
    const item = categoryOptions.find((i) => i.code === category)
    return item ? item.title : category
  }

  /** 状态编码 → 文案 */
  function statusText(status: number) {
    const item = statusOptions.find((i) => i.code === status)
    return item ? item.title : status
  }

  /** 表单重置 */
  function reset() {
    setFormState((prev) => ({
      ...prev,
      form: {
        id: undefined,
        title: undefined,
        category: 0,
        content: undefined,
        status: 0
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
    setQueryParams((prev) => ({
      ...prev,
      category: -1,
      status: -1,
      title: undefined,
      pageNum: 1
    }))
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
    setFormState((prev) => ({ ...prev, visible: true, title: '新增站内消息' }))
  }

  /** 修改按钮操作 */
  function handleUpdate(row: any) {
    reset()
    // 顶部按钮点击传入的是事件对象而非行数据，此时取勾选 id
    const id = row?.id ?? table.ids[0]
    if (id == null) {
      return
    }
    getMessage(id).then((response) => {
      setFormState((prev) => ({ ...prev, form: response.data, visible: true, title: '修改站内消息' }))
    })
  }

  /** 提交按钮 */
  function submitForm() {
    editForm.validateFields().then(() => {
      // 已有 id 走更新，否则走新增
      if (formState.form.id !== undefined) {
        updateMessage(formState.form as Message).then(() => {
          modal.msgSuccess('修改成功')
          setFormState((prev) => ({ ...prev, visible: false }))
          getList()
        })
      } else {
        addMessage(formState.form as Message).then(() => {
          modal.msgSuccess('新增成功')
          setFormState((prev) => ({ ...prev, visible: false }))
          getList()
        })
      }
    })
  }

  /** 查看消息详情 */
  function handleViewData(row: Message) {
    messageViewRef.current?.open(row.id as number)
  }

  /** 查看已读用户 */
  function handleReadUsers(row: Message) {
    readUsersRef.current?.open(row)
  }

  /** 删除按钮操作 */
  function handleDelete(row: any) {
    const messageIds = row?.id ?? table.ids
    if (messageIds == null || (Array.isArray(messageIds) && messageIds.length === 0)) {
      return
    }
    modal
      .confirm('是否确认删除消息编号为"' + messageIds + '"的数据项？')
      .then(function () {
        return delMessage(messageIds)
      })
      .then(() => {
        getList()
        modal.msgSuccess('删除成功')
      })
      .catch(() => {})
  }

  // --------------------------------- 表格列 ---------------------------------

  const columns: ColumnsType<Message> = [
    { title: '序号', dataIndex: 'id', key: 'id', width: 100, align: 'center' },
    {
      title: '消息标题',
      key: 'title',
      align: 'center',
      ellipsis: true,
      render: (_v, row) => (
        <a className="link-type" style={{ cursor: 'pointer' }} onClick={() => handleViewData(row)}>
          {row.title}
        </a>
      )
    },
    {
      title: '分类',
      key: 'category',
      width: 100,
      align: 'center',
      render: (_v, row) => (
        <Tag color={row.category === 0 ? 'blue' : 'orange'}>{categoryText(Number(row.category))}</Tag>
      )
    },
    {
      title: '状态',
      key: 'status',
      width: 100,
      align: 'center',
      render: (_v, row) => (
        <Tag color={row.status === 0 ? 'green' : 'red'}>{statusText(Number(row.status))}</Tag>
      )
    },
    { title: '发送人', dataIndex: 'sender', align: 'center', width: 100 },
    {
      title: '发送时间',
      dataIndex: 'addTime',
      align: 'center',
      width: 170,
      render: (value: string) => <span>{value}</span>
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 240,
      render: (_v, row) => (
        <Auth roles={['admin']}>
          <a style={{ marginRight: 8 }} onClick={() => handleReadUsers(row)}>
            <UserOutlined /> 阅读用户
          </a>
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
        <Form.Item label="分类" name="category">
          <Select
            style={{ width: 200 }}
            placeholder="消息分类"
            allowClear
            value={queryParams.category}
            onChange={(v) => setQueryParams((prev) => ({ ...prev, category: v }))}
          >
            <Select.Option value={-1}>全部</Select.Option>
            {categoryOptions.map((item: EnumOption) => (
              <Select.Option key={item.code} value={item.code}>
                {item.title}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="状态" name="status">
          <Select
            style={{ width: 200 }}
            placeholder="消息状态"
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
        <Form.Item label="标题" name="title">
          <Input
            style={{ width: 200 }}
            placeholder="请输入标题"
            allowClear
            value={queryParams.title}
            onChange={(e) => setQueryParams((prev) => ({ ...prev, title: e.target.value }))}
            onPressEnter={handleQuery}
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" onClick={handleQuery}>
            搜索
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={resetQuery}>
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

      {/* 消息列表 */}
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

      {/* 添加或修改消息对话框 */}
      <Modal
        title={formState.title}
        open={formState.visible}
        width={780}
        onCancel={() => setFormState((prev) => ({ ...prev, visible: false }))}
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
          <Form.Item label="消息标题" name="title" rules={[{ required: true, message: '消息标题不能为空' }]}>
            <Input placeholder="请输入消息标题" />
          </Form.Item>
          <Form.Item label="分类" name="category" rules={[{ required: true, message: '分类不能为空' }]}>
            <Select placeholder="请选择">
              {categoryOptions.map((item: EnumOption) => (
                <Select.Option key={item.code} value={item.code}>
                  {item.title}
                </Select.Option>
              ))}
            </Select>
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
          <Form.Item label="内容" name="content">
            <Editor minHeight={192} />
          </Form.Item>
        </Form>
      </Modal>
      <HeaderMessageDetail ref={messageViewRef} />
      <ReadUsers ref={readUsersRef} />
    </div>
  )
}
