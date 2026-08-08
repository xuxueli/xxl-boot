/**
 * 页面：User（用户管理）
 * 功能：左侧组织结构，选中组织后传递该组织及全部子组织作为查询条件；用户增删改查、重置密码、状态切换
 */
import { useEffect, useRef, useState } from 'react'
import { Button, Dropdown, Form, Input, InputNumber, Modal, Radio, Select, Switch, Table, TreeSelect } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ReloadOutlined,
  DownOutlined,
  KeyOutlined
} from '@ant-design/icons'
import TreePanel, { type TreePanelHandle } from '@/components/TreePanel'
import RightToolbar from '@/components/RightToolbar'
import Auth from '@/components/Auth'
import Pagination from '@/components/Pagination'
import UserViewDrawer, { type UserViewHandle } from './view'
import { listUser, addUser, updateUser, delUser } from '@/api/org/user'
import { listRole } from '@/api/org/role'
import { listOrg } from '@/api/org/org'
import { useEnumOption } from '@/hooks/useEnumOption'
import { handleTree, parseTime } from '@/utils/common'
import modal from '@/utils/modal'
import type { User, Org, Role, UserQuery } from '@/types/api'

/** 编辑表单数据 */
interface UserFormData {
  id?: number
  username?: string
  realName?: string
  orgId?: number
  password?: string
  phone?: string
  email?: string
  status?: number
  roleIds?: number[]
  [key: string]: unknown
}

/** 表格状态 */
interface TableState {
  list: User[]
  total: number
  loading: boolean
  showSearch: boolean
  ids: number[]
  single: boolean
  multiple: boolean
}

export default function User() {
  const deptTreeRef = useRef<TreePanelHandle>(null)
  const userViewRef = useRef<UserViewHandle>(null)

  // 用户状态枚举选项
  const { UserStatuEnum: statusOptions } = useEnumOption('UserStatuEnum')

  // 角色选项
  const [roleOptions, setRoleOptions] = useState<Role[]>([])
  // 组织树
  const [deptOptions, setDeptOptions] = useState<Org[]>([])
  const [orgOptions, setOrgOptions] = useState<Org[]>([])

  // 搜索栏：查询参数
  const [queryParams, setQueryParams] = useState<{ [key: string]: unknown }>({
    pageNum: 1,
    pageSize: 10,
    username: undefined,
    status: -1,
    orgIds: []
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
  const [formState, setFormState] = useState<{ visible: boolean; title: string; form: UserFormData }>({
    visible: false,
    title: '',
    form: {}
  })

  const [queryForm] = Form.useForm()
  const [editForm] = Form.useForm()

  // 页面初始化
  useEffect(() => {
    getDeptTree()
    getList()
     
  }, [])

  /** 加载角色选项 */
  function loadRoleOptions() {
    listRole({ offset: 0, pagesize: 999 } as any).then((response) => {
      setRoleOptions(response.data.data)
    })
  }

  /** 查询组织树列表 */
  function getDeptTree() {
    listOrg({}).then((response) => {
      setDeptOptions(handleTree(JSON.parse(JSON.stringify(response.data)), 'id'))
      setOrgOptions([
        { id: 0, name: '未选择', parentId: -1, children: [] },
        ...handleTree(JSON.parse(JSON.stringify(response.data)), 'id')
      ])
    })
  }

  /** 组织树节点过滤方法 */
  function filterOrg(value: string, data: any) {
    if (!value) return true
    return data.name && data.name.indexOf(value) !== -1
  }

  /** 递归收集节点及其全部子节点 ID */
  function collectOrgIds(node: Org): number[] {
    const ids = [node.id as number]
    if (node.children && node.children.length) {
      node.children.forEach((child) => {
        ids.push(...collectOrgIds(child))
      })
    }
    return ids
  }

  /** 节点单击事件 */
  function handleNodeClick(data: Org) {
    setQueryParams((prev) => ({ ...prev, orgIds: collectOrgIds(data) }))
    handleQuery()
  }

  /** 查询用户列表 */
  function getList() {
    setTable((prev) => ({ ...prev, loading: true }))
    const { pageNum, pageSize, orgIds, ...rest } = queryParams
    const params = {
      ...rest,
      orgIds: (orgIds as number[]).join(',') || undefined,
      offset: ((pageNum as number) - 1) * (pageSize as number),
      pagesize: pageSize
    }
    listUser(params as any).then((response) => {
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
    setQueryParams((prev) => ({ ...prev, username: undefined, status: -1, orgIds: [], pageNum: 1 }))
    deptTreeRef.current?.setCurrentKey(null)
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
      form: { id: undefined, username: undefined, realName: undefined, orgId: 0, password: '123456', phone: undefined, email: undefined, status: 0, roleIds: [] }
    }))
    editForm.resetFields()
  }

  /** 新增按钮操作 */
  function handleAdd() {
    reset()
    getDeptTree()
    loadRoleOptions()
    setFormState((prev) => ({ ...prev, visible: true, title: '新增用户' }))
  }

  /** 修改按钮操作 */
  function handleUpdate(row: any) {
    reset()
    getDeptTree()
    loadRoleOptions()
    const id = row?.id ?? table.ids[0]
    if (id == null) {
      return
    }
    const current = table.list.find((item) => item.id === id)
    if (!current) {
      return
    }
    setFormState((prev) => ({ ...prev, form: { ...current }, visible: true, title: '修改用户' }))
  }

  /** 提交按钮 */
  function submitForm() {
    editForm.validateFields().then(() => {
      const submitData: any = { ...formState.form }
      delete submitData.addTime
      delete submitData.updateTime
      delete submitData.orgName
      delete submitData.roleNames
      submitData.orgId = submitData.orgId || 0

      if (formState.form.id !== undefined) {
        updateUser(submitData).then(() => {
          modal.msgSuccess('修改成功')
          setFormState((prev) => ({ ...prev, visible: false }))
          getList()
        })
      } else {
        addUser(submitData).then(() => {
          modal.msgSuccess('新增成功')
          setFormState((prev) => ({ ...prev, visible: false }))
          getList()
        })
      }
    })
  }

  /** 删除按钮操作 */
  function handleDelete(row: any) {
    const userIds = row?.id ?? table.ids
    if (userIds == null || (Array.isArray(userIds) && userIds.length === 0)) {
      return
    }
    modal
      .confirm('是否确认删除用户编号为"' + userIds + '"的数据项？')
      .then(function () {
        return delUser(userIds)
      })
      .then(() => {
        getList()
        modal.msgSuccess('删除成功')
      })
      .catch(() => {})
  }

  /** 重置密码按钮操作 */
  function handleResetPwd(row: User) {
    let inputValue = ''
    Modal.confirm({
      title: '重置密码',
      content: (
        <div>
          <div style={{ marginBottom: 8 }}>请输入「{row.username}」的新密码</div>
          <Input.Password placeholder="请输入新密码" onChange={(e) => (inputValue = e.target.value)} />
        </div>
      ),
      okText: '确定',
      cancelText: '取消',
      centered: true,
      onOk: () => {
        if (!inputValue) {
          modal.msgError('密码不能为空')
          return Promise.reject()
        }
        if (inputValue.length < 4 || inputValue.length > 20) {
          modal.msgError('密码长度 4-20')
          return Promise.reject()
        }
        const submitData: any = { ...row, password: inputValue }
        delete submitData.addTime
        delete submitData.updateTime
        delete submitData.orgName
        delete submitData.roleNames
        return updateUser(submitData).then(() => {
          modal.msgSuccess('修改成功，新密码是：' + inputValue)
        })
      }
    })
  }

  /** 用户状态快速切换 */
  function handleStatusChange(row: User) {
    const text = Number(row.status) === 0 ? '正常' : '停用'
    const submitData: any = { ...row, status: Number(row.status) }
    delete submitData.addTime
    delete submitData.updateTime
    delete submitData.orgName
    delete submitData.roleNames
    updateUser(submitData)
      .then(() => {
        modal.msgSuccess(text + '成功')
      })
      .catch(() => {
        // 失败时回滚开关状态
        row.status = Number(row.status) === 0 ? 1 : 0
        setTable((prev) => ({ ...prev }))
      })
  }

  /** 详情按钮操作 */
  function handleViewData(row: User) {
    userViewRef.current?.open(row)
  }

  const columns: ColumnsType<User> = [
    { title: '用户编号', dataIndex: 'id', align: 'center', width: 80 },
    {
      title: '账号',
      dataIndex: 'username',
      align: 'center',
      width: 110,
      ellipsis: true,
      render: (_v, row) => (
        <a className="link-type" style={{ cursor: 'pointer' }} onClick={() => handleViewData(row)}>
          {row.username}
        </a>
      )
    },
    { title: '用户名称', dataIndex: 'realName', align: 'center', width: 110, ellipsis: true },
    { title: '所属组织', dataIndex: 'orgName', align: 'center', width: 120, ellipsis: true },
    {
      title: '状态',
      key: 'status',
      width: 100,
      align: 'center',
      render: (_v, row) => (
        <Switch
          size="small"
          checkedChildren="正常"
          unCheckedChildren="停用"
          checked={row.status === 0}
          onChange={() => {
            row.status = Number(row.status) === 0 ? 1 : 0
            setTable((prev) => ({ ...prev }))
            handleStatusChange(row)
          }}
        />
      )
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
      width: 190,
      render: (_v, row) => (
        <Auth perms={['org:user']}>
          <a style={{ marginRight: 8 }} onClick={() => handleUpdate(row)}>
            <EditOutlined /> 修改
          </a>
          <a style={{ marginRight: 8 }} onClick={() => handleDelete(row)}>
            <DeleteOutlined /> 删除
          </a>
          <Dropdown
            menu={{
              items: [{ key: 'resetPwd', label: <span><KeyOutlined /> 重置密码</span> }],
              onClick: () => handleResetPwd(row)
            }}
            trigger={['click']}
          >
            <a onClick={(e) => e.preventDefault()}>
              更多 <DownOutlined style={{ fontSize: 12 }} />
            </a>
          </Dropdown>
        </Auth>
      )
    }
  ]

  // 组织树 TreeSelect 数据
  const orgTreeData = (list: Org[]): any[] =>
    list.map((item) => ({
      value: item.id,
      title: item.name,
      children: item.children && item.children.length ? orgTreeData(item.children) : undefined
    }))

  return (
    <div className="app-container tree-sidebar-manage-wrap">
      {/* 左侧组织树 */}
      <TreePanel
        title="组织机构"
        treeData={deptOptions}
        treeProps={{ label: 'name', children: 'children' }}
        filterMethod={filterOrg}
        searchPlaceholder="请输入组织名称"
        storageKey="boot-user-org-sidebar-width"
        defaultExpandAll
        onNodeClick={handleNodeClick}
        onRefresh={getDeptTree}
        ref={deptTreeRef}
      />

      <div className="tree-sidebar-content">
        <div className="content-inner">
          {/* 搜索栏 */}
          <Form form={queryForm} layout="inline" style={{ display: table.showSearch ? 'flex' : 'none', marginBottom: 16, flexWrap: 'wrap' }}>
            <Form.Item label="用户名称" name="username">
              <Input
                style={{ width: 200 }}
                placeholder="请输入用户名称"
                allowClear
                value={queryParams.username as string}
                onChange={(e) => setQueryParams((prev) => ({ ...prev, username: e.target.value }))}
                onPressEnter={handleQuery}
              />
            </Form.Item>
            <Form.Item label="状态" name="status">
              <Select
                style={{ width: 200 }}
                placeholder="用户状态"
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
            <Auth perms={['org:user']}>
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

          {/* 用户列表 */}
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
        </div>
      </div>

      {/* 添加或修改用户对话框 */}
      <Modal
        title={formState.title}
        open={formState.visible}
        width={640}
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
          <Form.Item label="账号" name="username" rules={[{ required: true, message: '账号不能为空' }, { pattern: /^[a-z][a-z0-9]*$/, message: '格式：小写字母开头，字母/数字' }]}>
            <Input placeholder="请输入账号" maxLength={20} disabled={formState.form.id !== undefined} />
          </Form.Item>
          <Form.Item
            label="密码"
            name="password"
            rules={formState.form.id === undefined ? [{ required: true, message: '密码不能为空' }, { min: 4, max: 20, message: '密码长度 4-20' }] : []}
          >
            <Input.Password placeholder="请输入密码" maxLength={20} disabled={formState.form.id !== undefined} />
          </Form.Item>
          <Form.Item label="用户名称" name="realName" rules={[{ required: true, message: '用户名称不能为空' }]}>
            <Input placeholder="请输入用户名称" maxLength={50} />
          </Form.Item>
          <Form.Item label="角色" name="roleIds">
            <Select mode="multiple" placeholder="请选择角色" value={formState.form.roleIds}>
              {roleOptions.map((item) => (
                <Select.Option key={item.id} value={item.id} disabled={item.status === 1}>
                  {item.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="归属组织" name="orgId">
            <TreeSelect
              treeData={orgTreeData(orgOptions)}
              placeholder="请选择归属组织"
              allowClear
              treeDefaultExpandAll
              value={formState.form.orgId}
              onChange={(v) => setFormState((prev) => ({ ...prev, form: { ...prev.form, orgId: v } }))}
            />
          </Form.Item>
          <Form.Item label="邮箱" name="email" rules={[{ type: 'email', message: '邮箱格式不正确' }]}>
            <Input placeholder="请输入邮箱" maxLength={100} />
          </Form.Item>
          <Form.Item label="手机号" name="phone" rules={[{ pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '手机号码格式不正确' }]}>
            <Input placeholder="请输入手机号" maxLength={20} />
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

      {/* 用户详情抽屉 */}
      <UserViewDrawer ref={userViewRef} />
    </div>
  )
}
