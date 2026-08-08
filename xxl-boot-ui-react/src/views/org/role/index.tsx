/**
 * 页面：Role（角色管理）
 * 功能：角色列表查询、新增、修改、删除、菜单权限授权
 */
import { useEffect, useRef, useState } from 'react'
import { Button, Checkbox, Form, Input, InputNumber, Modal, Radio, Select, Table, Tag, Tree } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import type { DataNode } from 'antd/es/tree'
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import RightToolbar from '@/components/RightToolbar'
import Auth from '@/components/Auth'
import Pagination from '@/components/Pagination'
import { listRole, getRole, addRole, updateRole, delRole, roleMenuTreeselect, updateRoleRes } from '@/api/org/role'
import { listResource as menuTreeselect } from '@/api/org/resource'
import { useEnumOption } from '@/hooks/useEnumOption'
import { buildPageParams } from '@/hooks/buildPageParams'
import { handleTree, parseTime } from '@/utils/common'
import modal from '@/utils/modal'
import type { Role, Resource, RoleQuery } from '@/types/api'

/** 表格状态 */
interface TableState {
  list: Role[]
  total: number
  loading: boolean
  showSearch: boolean
  ids: number[]
  single: boolean
  multiple: boolean
}

/** 编辑表单状态 */
interface FormState {
  visible: boolean
  title: string
  form: Partial<Role>
}

export default function Role() {
  // 角色状态枚举选项
  const { RoleStatusEnum: statusOptions } = useEnumOption('RoleStatusEnum')

  // 菜单权限树数据与交互状态
  const [menuOptions, setMenuOptions] = useState<Resource[]>([])
  const [menuExpand, setMenuExpand] = useState(false)
  const [menuNodeAll, setMenuNodeAll] = useState(false)
  const [menuCheckStrictly, setMenuCheckStrictly] = useState(true)
  const [checkedKeys, setCheckedKeys] = useState<number[]>([])

  // 搜索栏：查询参数
  const [queryParams, setQueryParams] = useState<RoleQuery & { [key: string]: unknown }>({
    pageNum: 1,
    pageSize: 10,
    name: undefined,
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
  const [formState, setFormState] = useState<FormState>({ visible: false, title: '', form: {} })

  // 表单实例
  const [queryForm] = Form.useForm()
  const [editForm] = Form.useForm()

  // 页面初始化：加载角色列表
  useEffect(() => {
    getList()
     
  }, [])

  /** 状态编码 → 文案 */
  function statusText(status: number) {
    const item = statusOptions.find((i) => i.code === status)
    return item ? item.title : status
  }

  /** 查询角色列表 */
  function getList() {
    setTable((prev) => ({ ...prev, loading: true }))
    const params = buildPageParams(queryParams)()
    listRole(params).then((response) => {
      setTable((prev) => ({
        ...prev,
        list: response.data.data,
        total: response.data.total,
        loading: false
      }))
    })
  }

  /** 搜索按钮操作 */
  function handleQuery() {
    setQueryParams((prev) => ({ ...prev, pageNum: 1 }))
    getList()
  }

  /** 重置按钮操作 */
  function resetQuery() {
    queryForm.resetFields()
    setQueryParams((prev) => ({ ...prev, name: undefined, status: -1, pageNum: 1 }))
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

  /** 表单重置 */
  function reset() {
    setFormState((prev) => ({
      ...prev,
      form: { id: undefined, name: undefined, code: undefined, order: 0, status: 0 }
    }))
    setCheckedKeys([])
    setMenuExpand(false)
    setMenuNodeAll(false)
    editForm.resetFields()
  }

  /** 查询菜单权限树结构 */
  function getMenuTreeselect() {
    return menuTreeselect({}).then((response) => {
      setMenuOptions(handleTree(response.data, 'id'))
    })
  }

  /** 新增按钮操作 */
  function handleAdd() {
    reset()
    getMenuTreeselect()
    setFormState((prev) => ({ ...prev, visible: true, title: '新增角色' }))
  }

  /** 修改按钮操作 */
  function handleUpdate(row: any) {
    reset()
    const id = row?.id ?? table.ids[0]
    if (id == null) {
      return
    }
    getRole(id).then((response) => {
      setFormState((prev) => ({ ...prev, form: response.data, visible: true, title: '修改角色' }))
      // 加载菜单权限树后，再勾选角色已授权资源
      getMenuTreeselect().then(() => {
        return roleMenuTreeselect(id)
      }).then((res) => {
        setTimeout(() => {
          setCheckedKeys(res.data.map((rid: number) => Number(rid)))
        }, 0)
      })
    })
  }

  /** 树权限（展开/折叠） */
  function handleCheckedTreeExpand(value: boolean) {
    setMenuExpand(value)
  }

  /** 树权限（全选/全不选） */
  function handleCheckedTreeNodeAll(value: boolean) {
    setMenuNodeAll(value)
    const allIds = collectAllIds(menuOptions)
    setCheckedKeys(value ? allIds : [])
  }

  /** 树权限（父子联动） */
  function handleCheckedTreeConnect(value: boolean) {
    setMenuCheckStrictly(value)
  }

  /** 收集菜单权限勾选节点（含半选） */
  function getMenuAllCheckedKeys(checked: number[], halfChecked: number[]) {
    return [...halfChecked, ...checked]
  }

  /** 提交按钮 */
  function submitForm() {
    editForm.validateFields().then(() => {
      // 后端 update 会自动维护 update_time，回传 addTime/updateTime 会导致 Date 绑定失败
      const submitData: any = { ...formState.form }
      delete submitData.addTime
      delete submitData.updateTime
      const resourceIds = getMenuAllCheckedKeys(checkedKeys, [])

      // 已有 id 走更新，否则走新增
      if (formState.form.id !== undefined) {
        updateRole(submitData)
          .then(() => {
            return updateRoleRes(submitData.id as number, resourceIds)
          })
          .then(() => {
            modal.msgSuccess('修改成功')
            setFormState((prev) => ({ ...prev, visible: false }))
            getList()
          })
      } else {
        addRole(submitData)
          .then((response) => {
            return updateRoleRes(response.data as number, resourceIds)
          })
          .then(() => {
            modal.msgSuccess('新增成功')
            setFormState((prev) => ({ ...prev, visible: false }))
            getList()
          })
      }
    })
  }

  /** 删除按钮操作 */
  function handleDelete(row: any) {
    const roleIds = row?.id ?? table.ids
    if (roleIds == null || (Array.isArray(roleIds) && roleIds.length === 0)) {
      return
    }
    modal
      .confirm('是否确认删除角色编号为"' + roleIds + '"的数据项？')
      .then(function () {
        return delRole(roleIds)
      })
      .then(() => {
        getList()
        modal.msgSuccess('删除成功')
      })
      .catch(() => {})
  }

  const columns: ColumnsType<Role> = [
    { title: '角色编号', dataIndex: 'id', align: 'center', width: 100 },
    { title: '角色名称', dataIndex: 'name', align: 'center', ellipsis: true },
    { title: '权限字符', dataIndex: 'code', align: 'center', ellipsis: true },
    { title: '显示顺序', dataIndex: 'order', align: 'center', width: 100 },
    {
      title: '状态',
      key: 'status',
      width: 100,
      align: 'center',
      render: (_v, row) => <Tag color={row.status === 0 ? 'green' : 'red'}>{statusText(Number(row.status))}</Tag>
    },
    {
      title: '创建时间',
      dataIndex: 'addTime',
      align: 'center',
      width: 170,
      render: (value: string) => <span>{parseTime(value)}</span>
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 160,
      render: (_v, row) => (
        <Auth perms={['org:role']}>
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

  // 菜单树数据
  const menuTreeData = (list: Resource[]): DataNode[] =>
    list.map((item) => ({
      key: item.id as number,
      title: item.name,
      children: item.children && item.children.length ? menuTreeData(item.children) : undefined
    }))

  return (
    <div className="app-container">
      {/* 搜索栏 */}
      <Form
        form={queryForm}
        layout="inline"
        style={{ display: table.showSearch ? 'flex' : 'none', marginBottom: 16, flexWrap: 'wrap' }}
      >
        <Form.Item label="角色名称" name="name">
          <Input
            style={{ width: 200 }}
            placeholder="请输入角色名称"
            allowClear
            value={queryParams.name as string}
            onChange={(e) => setQueryParams((prev) => ({ ...prev, name: e.target.value }))}
            onPressEnter={handleQuery}
          />
        </Form.Item>
        <Form.Item label="状态" name="status">
          <Select
            style={{ width: 200 }}
            placeholder="角色状态"
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
        <Auth perms={['org:role']}>
          <Button icon={<PlusOutlined />} onClick={handleAdd}>
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

      {/* 角色列表 */}
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
          page={queryParams.pageNum as number}
          limit={queryParams.pageSize as number}
          onPageChange={(v) => setQueryParams((prev) => ({ ...prev, pageNum: v }))}
          onLimitChange={(v) => setQueryParams((prev) => ({ ...prev, pageSize: v }))}
          onPagination={getList}
        />
      </div>

      {/* 添加或修改角色对话框 */}
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
          <Form.Item label="角色名称" name="name" rules={[{ required: true, message: '角色名称不能为空' }]}>
            <Input placeholder="请输入角色名称" maxLength={30} />
          </Form.Item>
          <Form.Item label="权限字符" name="code" rules={[{ required: true, message: '权限字符不能为空' }]}>
            <Input placeholder="请输入权限字符" maxLength={30} />
          </Form.Item>
          <Form.Item label="显示顺序" name="order">
            <InputNumber min={0} style={{ width: '100%' }} />
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
          <Form.Item label="菜单权限" style={{ marginBottom: 0 }}>
            <div>
              <Checkbox checked={menuExpand} onChange={(e) => handleCheckedTreeExpand(e.target.checked)}>
                展开/折叠
              </Checkbox>
              <Checkbox checked={menuNodeAll} onChange={(e) => handleCheckedTreeNodeAll(e.target.checked)}>
                全选/全不选
              </Checkbox>
              <Checkbox checked={menuCheckStrictly} onChange={(e) => handleCheckedTreeConnect(e.target.checked)}>
                父子联动
              </Checkbox>
            </div>
            <Tree
              className="tree-border"
              treeData={menuTreeData(menuOptions)}
              checkable
              checkStrictly={!menuCheckStrictly}
              checkedKeys={checkedKeys}
              onCheck={(keys) => {
                const arr = Array.isArray(keys) ? keys : keys.checked
                setCheckedKeys(arr.map((k) => Number(k)))
              }}
              expandedKeys={menuExpand ? collectAllKeys(menuOptions) : undefined}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

/**
 * 递归收集所有节点 id
 */
function collectAllIds(list: Resource[]): number[] {
  const ids: number[] = []
  list.forEach((item) => {
    ids.push(item.id as number)
    if (item.children && item.children.length) {
      ids.push(...collectAllIds(item.children))
    }
  })
  return ids
}

/**
 * 递归收集所有含子节点的 key
 */
function collectAllKeys(list: Resource[]): number[] {
  const keys: number[] = []
  list.forEach((item) => {
    keys.push(item.id as number)
    if (item.children && item.children.length) {
      keys.push(...collectAllKeys(item.children))
    }
  })
  return keys
}
