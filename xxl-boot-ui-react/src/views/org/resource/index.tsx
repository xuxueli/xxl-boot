/**
 * 页面：Resource（资源管理）
 * 功能：资源树展示，支持搜索、新增、修改、删除、图标选择及页内快速调整顺序
 */
import { useEffect, useRef, useState } from 'react'
import { Button, Form, Input, InputNumber, Modal, Popover, Radio, Select, Table, Tag, TreeSelect } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PlusOutlined, CheckOutlined, SortAscendingOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import RightToolbar from '@/components/RightToolbar'
import Auth from '@/components/Auth'
import SvgIcon from '@/components/SvgIcon'
import IconSelect, { type IconSelectHandle } from '@/components/IconSelect'
import { listResource, getResource, addResource, updateResource, delResource, updateResourceSort } from '@/api/org/resource'
import { useEnumOption } from '@/hooks/useEnumOption'
import { handleTree } from '@/utils/common'
import modal from '@/utils/modal'
import type { Resource, ResourceQuery } from '@/types/api'

/** 表格状态 */
interface TableState {
  list: Resource[]
  loading: boolean
  showSearch: boolean
  expandAll: boolean
}

/** 编辑弹窗状态 */
interface FormState {
  visible: boolean
  title: string
  form: Partial<Resource>
}

export default function Resource() {
  const iconSelectRef = useRef<IconSelectHandle>(null)

  // 枚举选项数据：资源类型、资源状态、显示状态
  const { ResourceTypeEnum: typeOptions, ResourceStatuEnum: statusOptions, ResourceVisibleEnum: visibleOptions } = useEnumOption(
    'ResourceTypeEnum',
    'ResourceStatuEnum',
    'ResourceVisibleEnum'
  )

  // 上级资源下拉树选项
  const [menuOptions, setMenuOptions] = useState<Resource[]>([])

  // 搜索栏：查询参数
  const [queryParams, setQueryParams] = useState<ResourceQuery & { [key: string]: unknown }>({ name: undefined, status: -1 })

  // 表格：树数据与 UI 状态
  const [table, setTable] = useState<TableState>({ list: [], loading: true, showSearch: true, expandAll: false })

  // 编辑表单：数据状态
  const [formState, setFormState] = useState<FormState>({ visible: false, title: '', form: {} })

  // 排序备份
  const originalOrders = useRef<Record<number, number | undefined>>({})

  // 表单实例
  const [queryForm] = Form.useForm()
  const [editForm] = Form.useForm()

  // 页面初始化
  useEffect(() => {
    getList()
     
  }, [])

  /** 查询资源树列表 */
  function getList() {
    setTable((prev) => ({ ...prev, loading: true }))
    listResource(queryParams).then((response) => {
      const list = handleTree(response.data, 'id')
      recordOriginalOrders(list)
      setTable((prev) => ({ ...prev, list, loading: false }))
    })
  }

  /** 查询上级资源下拉树结构 */
  function getTreeOptions() {
    listResource({}).then((response) => {
      // 补一个"顶级"根节点供选择
      const topNode: Resource = { id: 0, parentId: -1, name: '根节点', children: [] }
      topNode.children = handleTree(response.data, 'id')
      setMenuOptions([topNode])
    })
  }

  /** 状态编码 → 文案 */
  function statusText(status: number) {
    const item = statusOptions.find((i) => i.code === status)
    return item ? item.title : status
  }

  /** 显示状态编码 → 文案 */
  function visibleText(visible: number) {
    const item = visibleOptions.find((i) => i.code === visible)
    return item ? item.title : visible
  }

  /** 表单重置 */
  function reset() {
    setFormState((prev) => ({
      ...prev,
      form: { id: undefined, parentId: 0, name: undefined, type: 0, permission: undefined, url: undefined, icon: undefined, order: 0, status: 0, visible: 0 }
    }))
    editForm.resetFields()
  }

  /** 选择图标 */
  function selected(name: string) {
    setFormState((prev) => ({ ...prev, form: { ...prev.form, icon: name } }))
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

  /** 新增按钮操作 */
  function handleAdd(row?: Resource) {
    reset()
    getTreeOptions()
    setFormState((prev) => ({ ...prev, form: { ...prev.form, parentId: row != null && row.id ? row.id : 0 }, visible: true, title: '新增资源' }))
  }

  /** 修改按钮操作 */
  function handleUpdate(row: Resource) {
    reset()
    getTreeOptions()
    getResource(row.id as number).then((response) => {
      setFormState((prev) => ({ ...prev, form: response.data, visible: true, title: '修改资源' }))
    })
  }

  /** 展开/折叠操作 */
  function toggleExpandAll() {
    setTable((prev) => ({ ...prev, expandAll: !prev.expandAll }))
  }

  /** 提交按钮 */
  function submitForm() {
    editForm.validateFields().then(() => {
      // 后端 update 会自动维护 update_time
      const submitData: any = { ...formState.form }
      delete submitData.addTime
      delete submitData.updateTime
      if (formState.form.id !== undefined) {
        updateResource(submitData).then(() => {
          modal.msgSuccess('修改成功')
          setFormState((prev) => ({ ...prev, visible: false }))
          getList()
        })
      } else {
        addResource(submitData).then(() => {
          modal.msgSuccess('新增成功')
          setFormState((prev) => ({ ...prev, visible: false }))
          getList()
        })
      }
    })
  }

  /** 递归记录原始排序 */
  function recordOriginalOrders(list: Resource[]) {
    list.forEach((item) => {
      originalOrders.current[item.id as number] = item.order
      if (item.children && item.children.length) {
        recordOriginalOrders(item.children)
      }
    })
  }

  /** 保存排序 */
  function handleSaveSort() {
    const changedList: Resource[] = []
    const collectChanged = (list: Resource[]) => {
      list.forEach((item) => {
        if (String(originalOrders.current[item.id as number]) !== String(item.order)) {
          changedList.push(item)
        }
        if (item.children && item.children.length) {
          collectChanged(item.children)
        }
      })
    }
    collectChanged(table.list)
    if (changedList.length === 0) {
      modal.msgWarning('未检测到排序修改')
      return
    }
    updateResourceSort(
      changedList.map((item) => item.id as number),
      changedList.map((item) => item.order as number)
    ).then(() => {
      modal.msgSuccess('排序保存成功')
      recordOriginalOrders(table.list)
    })
  }

  /** 删除按钮操作 */
  function handleDelete(row: Resource) {
    modal
      .confirm('是否确认删除名称为"' + row.name + '"的数据项?')
      .then(function () {
        return delResource(row.id as number)
      })
      .then(() => {
        getList()
        modal.msgSuccess('删除成功')
      })
      .catch(() => {})
  }

  const columns: ColumnsType<Resource> = [
    {
      title: '资源名称',
      dataIndex: 'name',
      width: 220,
      ellipsis: true,
      render: (_v, row) => (
        <span>
          {row.icon ? <SvgIcon iconClass={row.icon} /> : null}
          <span className="ml5">{row.name}</span>
        </span>
      )
    },
    {
      title: '类型',
      key: 'type',
      width: 100,
      render: (_v, row) =>
        row.type === 0 ? (
          <Tag color="blue">目录</Tag>
        ) : row.type === 1 ? (
          <Tag color="green">菜单</Tag>
        ) : (
          <Tag color="orange">按钮</Tag>
        )
    },
    {
      title: '排序',
      key: 'order',
      width: 200,
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
    { title: '权限标识', dataIndex: 'permission', ellipsis: true },
    { title: '菜单地址', dataIndex: 'url', ellipsis: true },
    {
      title: '显示状态',
      key: 'visible',
      width: 100,
      render: (_v, row) => <Tag color={row.visible === 0 ? 'blue' : 'default'}>{visibleText(Number(row.visible))}</Tag>
    },
    {
      title: '状态',
      key: 'status',
      width: 80,
      render: (_v, row) => <Tag color={row.status === 0 ? 'green' : 'red'}>{statusText(Number(row.status))}</Tag>
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 210,
      render: (_v, row) => (
        <Auth perms={['org:resource']}>
          <a style={{ marginRight: 8 }} onClick={() => handleUpdate(row)}>
            修改
          </a>
          {row.type !== 2 && (
            <a style={{ marginRight: 8 }} onClick={() => handleAdd(row)}>
              新增
            </a>
          )}
          <a onClick={() => handleDelete(row)}>
            删除
          </a>
        </Auth>
      )
    }
  ]

  // 上级资源 TreeSelect 数据
  const treeSelectData = (list: Resource[]): any[] =>
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
        <Form.Item label="资源名称" name="name">
          <Input
            style={{ width: 200 }}
            placeholder="请输入资源名称"
            allowClear
            value={queryParams.name as string}
            onChange={(e) => setQueryParams((prev) => ({ ...prev, name: e.target.value }))}
            onPressEnter={handleQuery}
          />
        </Form.Item>
        <Form.Item label="状态" name="status">
          <Select
            style={{ width: 200 }}
            placeholder="资源状态"
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
        <Auth perms={['org:resource']}>
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

      {/* 资源树 */}
      <Table
        rowKey="id"
        loading={table.loading}
        dataSource={table.list}
        columns={columns}
        pagination={false}
        expandable={{ defaultExpandAllRows: table.expandAll }}
      />

      {/* 添加或修改资源对话框 */}
      <Modal
        title={formState.title}
        open={formState.visible}
        width={680}
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
          <Form.Item label="上级资源" name="parentId">
            <TreeSelect
              treeData={treeSelectData(menuOptions)}
              placeholder="选择上级资源"
              treeDefaultExpandAll
              value={formState.form.parentId}
              onChange={(v) => setFormState((prev) => ({ ...prev, form: { ...prev.form, parentId: v } }))}
            />
          </Form.Item>
          <Form.Item label="资源类型" name="type">
            <Radio.Group>
              {typeOptions.map((item) => (
                <Radio key={item.code} value={item.code}>
                  {item.title}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
          <Form.Item label="资源名称" name="name" rules={[{ required: true, message: '资源名称不能为空' }]}>
            <Input placeholder="请输入资源名称" />
          </Form.Item>
          <Form.Item label="显示排序" name="order" rules={[{ required: true, message: '显示排序不能为空' }]}>
            <InputNumber min={0} style={{ width: '100%' }} />
          </Form.Item>
          {formState.form.type !== 2 && (
            <Form.Item label="资源图标" name="icon">
              <Popover
                trigger="click"
                placement="bottomLeft"
                content={
                  <IconSelect ref={iconSelectRef} activeIcon={formState.form.icon} onSelected={selected} />
                }
              >
                <Input
                  value={formState.form.icon}
                  placeholder="点击选择图标"
                  readOnly
                  prefix={formState.form.icon ? <SvgIcon iconClass={formState.form.icon} /> : <SearchOutlined />}
                />
              </Popover>
            </Form.Item>
          )}
          {formState.form.type !== 2 && (
            <Form.Item label="菜单地址" name="url">
              <Input placeholder="请输入菜单地址" />
            </Form.Item>
          )}
          <Form.Item label="权限标识" name="permission">
            <Input placeholder="请输入权限标识" maxLength={100} />
          </Form.Item>
          <Form.Item label="显示状态" name="visible">
            <Radio.Group>
              {visibleOptions.map((item) => (
                <Radio key={item.code} value={item.code}>
                  {item.title}
                </Radio>
              ))}
            </Radio.Group>
          </Form.Item>
          <Form.Item label="资源状态" name="status">
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
