/**
 * 页面：Org（组织管理）
 * 功能：树形展示组织，支持搜索、新增、修改、删除及页内快速调整顺序
 */
import { useEffect, useRef, useState } from 'react'
import { Button, Form, Input, InputNumber, Modal, Radio, Select, Table, Tag, TreeSelect } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, CheckOutlined, SortAscendingOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import RightToolbar from '@/components/RightToolbar'
import Auth from '@/components/Auth'
import { listOrg, getOrg, delOrg, addOrg, updateOrg, updateOrgSort } from '@/api/authz/org'
import { useEnumOption } from '@/hooks/useEnumOption'
import { handleTree, parseTime } from '@/utils/common'
import modal from '@/utils/modal'
import type { Org, OrgQuery } from '@/types/api'

/** 表格状态 */
interface TableState {
  list: Org[]
  loading: boolean
  showSearch: boolean
  isExpandAll: boolean
}

/** 编辑弹窗状态 */
interface FormState {
  visible: boolean
  title: string
  form: Partial<Org>
}

export default function Org() {
  // 搜索栏：查询参数
  const [queryParams, setQueryParams] = useState<OrgQuery & { [key: string]: unknown }>({ name: undefined, status: -1 })

  // 表格：UI数据
  const [table, setTable] = useState<TableState>({ list: [], loading: true, showSearch: true, isExpandAll: true })

  // 编辑弹窗：表单状态
  const [formState, setFormState] = useState<FormState>({ visible: false, title: '', form: {} })

  // 上级组织树选项
  const [orgOptions, setOrgOptions] = useState<Org[]>([])

  // 排序：原始顺序快照
  const originalOrders = useRef<Record<number, number | undefined>>({})

  // 状态选项
  const { OrgStatuEnum: statusOptions } = useEnumOption('OrgStatuEnum')

  // 表单实例
  const [editForm] = Form.useForm()
  const [queryForm] = Form.useForm()

  // 页面初始化：加载状态选项与组织树
  useEffect(() => {
    getList()
     
  }, [])

  /** 查询组织树列表 */
  function getList() {
    setTable((prev) => ({ ...prev, loading: true }))
    listOrg(queryParams).then((response) => {
      const list = handleTree(response.data, 'id')
      recordOriginalOrders(list)
      setTable((prev) => ({ ...prev, list, loading: false }))
    })
  }

  /** 查询上级组织树选项 */
  function loadOrgOptions() {
    listOrg({}).then((response) => {
      setOrgOptions(handleTree(response.data, 'id'))
    })
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
      form: { id: undefined, parentId: 0, name: undefined, order: 0, status: 0, manager: undefined }
    }))
    editForm.resetFields()
  }

  /** 搜索按钮操作 */
  function handleQuery() {
    getList()
  }

  /** 重置按钮操作 */
  function resetQuery() {
    queryForm.resetFields()
    setQueryParams({ name: undefined, status: -1 })
    handleQuery()
  }

  /** 展开/折叠操作 */
  function toggleExpandAll() {
    setTable((prev) => ({ ...prev, isExpandAll: !prev.isExpandAll }))
  }

  /** 新增按钮操作 */
  function handleAdd(row?: Org) {
    reset()
    loadOrgOptions()
    if (row !== undefined) {
      setFormState((prev) => ({ ...prev, form: { ...prev.form, parentId: row.id } }))
    }
    setFormState((prev) => ({ ...prev, visible: true, title: '新增组织' }))
  }

  /** 修改按钮操作 */
  function handleUpdate(row: Org) {
    reset()
    loadOrgOptions()
    getOrg(row.id as number).then((response) => {
      setFormState((prev) => ({ ...prev, form: response.data, visible: true, title: '修改组织' }))
    })
  }

  /** 校验上级组织是否合法：修改时不能选择自己或自己的子孙组织，避免成环 */
  function validParentId() {
    const form = formState.form
    if (form.id === undefined) {
      return true
    }
    if (form.parentId === form.id) {
      return false
    }
    // 递归判断子孙节点中是否包含选中的上级组织
    const findInChildren = (children: Org[]): boolean => {
      for (const child of children) {
        if (child.id === form.parentId) return true
        if (findInChildren(child.children || [])) return true
      }
      return false
    }
    const isParentInDescendants = (list: Org[]): boolean => {
      for (const item of list) {
        if (item.id === form.id) {
          return findInChildren(item.children || [])
        }
        if (item.children && isParentInDescendants(item.children)) return true
      }
      return false
    }
    return !isParentInDescendants(table.list)
  }

  /** 提交按钮 */
  function submitForm() {
    editForm.validateFields().then(() => {
      // 上级组织不能选自己或自己的子孙
      if (!validParentId()) {
        modal.msgError('上级组织不能选择自己或其下级组织')
        return
      }
      // 已有 id 走更新，否则走新增
      if (formState.form.id !== undefined) {
        updateOrg(formState.form as Org).then(() => {
          modal.msgSuccess('修改成功')
          setFormState((prev) => ({ ...prev, visible: false }))
          getList()
        })
      } else {
        addOrg(formState.form as Org).then(() => {
          modal.msgSuccess('新增成功')
          setFormState((prev) => ({ ...prev, visible: false }))
          getList()
        })
      }
    })
  }

  /** 递归记录原始顺序 */
  function recordOriginalOrders(list: Org[]) {
    list.forEach((item) => {
      originalOrders.current[item.id as number] = item.order
      if (item.children && item.children.length) {
        recordOriginalOrders(item.children)
      }
    })
  }

  /** 保存排序：收集变更项后批量提交 */
  function handleSaveSort() {
    const changedIds: number[] = []
    const changedOrders: number[] = []
    const collectChanged = (list: Org[]) => {
      list.forEach((item) => {
        if (String(originalOrders.current[item.id as number]) !== String(item.order)) {
          changedIds.push(item.id as number)
          changedOrders.push(item.order as number)
        }
        if (item.children && item.children.length) {
          collectChanged(item.children)
        }
      })
    }
    collectChanged(table.list)
    if (changedIds.length === 0) {
      modal.msgWarning('未检测到排序修改')
      return
    }
    updateOrgSort({ ids: changedIds, orders: changedOrders }).then(() => {
      modal.msgSuccess('排序保存成功')
      recordOriginalOrders(table.list)
    })
  }

  /** 删除按钮操作 */
  function handleDelete(row: Org) {
    modal
      .confirm('是否确认删除名称为"' + row.name + '"的数据项？')
      .then(function () {
        return delOrg([row.id as number])
      })
      .then(() => {
        getList()
        modal.msgSuccess('删除成功')
      })
      .catch(() => {})
  }

  const columns: ColumnsType<Org> = [
    { title: '组织名称', dataIndex: 'name', width: 260 },
    {
      title: '顺序',
      key: 'order',
      width: 130,
      align: 'center',
      render: (_v, row) => (
        <InputNumber
          min={0}
          style={{ width: 88 }}
          value={row.order}
          onChange={(v) => {
            row.order = v || 0
            setTable((prev) => ({ ...prev }))
          }}
        />
      )
    },
    {
      title: '状态',
      key: 'status',
      width: 100,
      align: 'center',
      render: (_v, row) => <Tag color={row.status === 0 ? 'green' : 'red'}>{statusText(Number(row.status))}</Tag>
    },
    { title: '负责人', dataIndex: 'manager', width: 120, align: 'center' },
    {
      title: '新增时间',
      dataIndex: 'addTime',
      align: 'center',
      width: 170,
      render: (value: string) => <span>{parseTime(value)}</span>
    },
    {
      title: '操作',
      key: 'action',
      align: 'left',
      width: 220,
      render: (_v, row) => (
        <Auth roles={['admin']}>
          <a style={{ marginRight: 8 }} onClick={() => handleUpdate(row)}>
            修改
          </a>
          <a style={{ marginRight: 8 }} onClick={() => handleAdd(row)}>
            新增
          </a>
          {row.parentId !== 0 && (
            <a onClick={() => handleDelete(row)}>
              删除
            </a>
          )}
        </Auth>
      )
    }
  ]

  // 上级组织树选项（TreeSelect 数据）
  const treeSelectData = (list: Org[]): any[] =>
    list.map((item) => ({
      value: item.id,
      title: item.name,
      children: item.children && item.children.length ? treeSelectData(item.children) : undefined
    }))

  return (
    <div className="app-container">
      {/* 搜索栏 */}
      <Form
        form={queryForm}
        layout="inline"
        style={{ display: table.showSearch ? 'flex' : 'none', marginBottom: 16, flexWrap: 'wrap' }}
      >
        <Form.Item label="组织名称" name="name">
          <Input
            style={{ width: 200 }}
            placeholder="请输入组织名称"
            allowClear
            value={queryParams.name}
            onChange={(e) => setQueryParams((prev) => ({ ...prev, name: e.target.value }))}
            onPressEnter={handleQuery}
          />
        </Form.Item>
        <Form.Item label="状态" name="status">
          <Select
            style={{ width: 200 }}
            placeholder="组织状态"
            allowClear
            value={queryParams.status}
            onChange={(v) => setQueryParams((prev) => ({ ...prev, status: v }))}
          >
            <Select.Option value={-1}>全部</Select.Option>
            {statusOptions.map((item) => (
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
          <Button icon={<PlusOutlined />} onClick={() => handleAdd()}>
            新增
          </Button>
          <Button icon={<CheckOutlined />} onClick={handleSaveSort}>
            保存排序
          </Button>
        </Auth>
        <Button icon={<SortAscendingOutlined />} onClick={toggleExpandAll}>
          展开/折叠
        </Button>
        <div style={{ marginLeft: 'auto' }}>
          <RightToolbar showSearch={table.showSearch} onUpdateShowSearch={(v) => setTable((prev) => ({ ...prev, showSearch: v }))} onQueryTable={getList} />
        </div>
      </div>

      {/* 组织树列表 */}
      <Table
        rowKey="id"
        loading={table.loading}
        dataSource={table.list}
        columns={columns}
        pagination={false}
        expandable={{ defaultExpandAllRows: table.isExpandAll }}
      />

      {/* 添加或修改组织对话框 */}
      <Modal
        title={formState.title}
        open={formState.visible}
        width={600}
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
          {formState.form.parentId !== 0 && (
            <Form.Item label="上级组织" name="parentId">
              <TreeSelect
                treeData={treeSelectData(orgOptions)}
                placeholder="选择上级组织"
                treeDefaultExpandAll
                value={formState.form.parentId}
                onChange={(v) => setFormState((prev) => ({ ...prev, form: { ...prev.form, parentId: v } }))}
              />
            </Form.Item>
          )}
          <Form.Item label="组织名称" name="name" rules={[{ required: true, message: '组织名称不能为空' }]}>
            <Input placeholder="请输入组织名称" />
          </Form.Item>
          <Form.Item label="顺序" name="order" rules={[{ required: true, message: '顺序不能为空' }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="负责人" name="manager">
            <Input placeholder="请输入负责人" maxLength={50} />
          </Form.Item>
          <Form.Item label="状态" name="status">
            <Radio.Group>
              {statusOptions.map((item) => (
                <Radio key={item.code} value={item.code}>
                  {item.title}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
