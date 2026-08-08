/**
 * 页面：代码生成管理
 * 功能：查询、创建、修改、删除、预览、生成代码
 * @author xuxueli 2026-08-09
 */
import { useEffect, useRef, useState } from 'react'
import { Button, Form, Input, Modal, Table, Tabs, Tooltip } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EyeOutlined,
  CopyOutlined,
  SearchOutlined,
  ReloadOutlined
} from '@ant-design/icons'
import Pagination from '@/components/Pagination'
import RightToolbar from '@/components/RightToolbar'
import Auth from '@/components/Auth'
import EditTable, { type EditTableHandle } from './editTable'
import { listTable, previewTable, delTable, createTable } from '@/api/tool/codegen'
import type { CodegenTable } from '@/api/tool/codegen'
import { buildPageParams } from '@/hooks/buildPageParams'
import modal from '@/utils/modal'
import downloadPlugin from '@/utils/download'
import './index.scss'

// --------------------------------- ref data ---------------------------------

/** 搜索栏：查询参数 */
interface CodegenQueryState {
  pageNum: number
  pageSize: number
  tableName?: string
  tableComment?: string
  [key: string]: unknown
}

/** 表格：UI数据 */
interface TableState {
  list: CodegenTable[]
  total: number
  loading: boolean
  showSearch: boolean
  ids: number[]
  single: boolean
  multiple: boolean
}

/** 预览弹窗：数据状态 */
interface PreviewState {
  open: boolean
  title: string
  data: Record<string, string>
  activeName: string
}

/** 创建表弹窗：数据状态 */
interface CreateDialogState {
  visible: boolean
  content: string
}

export default function Codegen() {
  // 编辑弹窗 ref
  const editRef = useRef<EditTableHandle>(null)

  // 页面初始化：加载生成表列表
  useEffect(() => {
    getList()
     
  }, [])

  // 搜索栏：查询参数
  const [queryParams, setQueryParams] = useState<CodegenQueryState>({
    pageNum: 1,
    pageSize: 10,
    tableName: undefined,
    tableComment: undefined
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

  // 预览弹窗：数据状态
  const [preview, setPreview] = useState<PreviewState>({
    open: false,
    title: '代码预览',
    data: {},
    activeName: 'entity.java'
  })

  // 创建表弹窗：数据状态
  const [createDialog, setCreateDialog] = useState<CreateDialogState>({
    visible: false,
    content: ''
  })

  // 表单实例
  const [searchForm] = Form.useForm()

  // --------------------------------- fun ---------------------------------

  /** 查询表集合 */
  function getList() {
    setTable((prev) => ({ ...prev, loading: true }))
    const params = buildPageParams(queryParams)()
    listTable(params).then((response) => {
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
    searchForm.resetFields()
    setQueryParams((prev) => ({ ...prev, tableName: undefined, tableComment: undefined, pageNum: 1 }))
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

  /** 生成代码操作 */
  function handleGenTable(row: any) {
    const idList = row && row.id != null ? [row.id] : table.ids
    if (!idList || idList.length === 0) {
      modal.msgError('请选择要生成的数据')
      return
    }
    const zipName = 'xxl-boot-codegen.zip'
    const query = idList.map((id) => 'ids=' + id).join('&')
    downloadPlugin.zip('/tool/codegen/batchGenCode?' + query, zipName)
  }

  /** 打开创建表弹窗 */
  function openCreateDialog() {
    const demoSql = `CREATE TABLE \`product01\` (
      \`id\`            INT             NOT NULL AUTO_INCREMENT      COMMENT '主键ID',
      \`name\`          VARCHAR(50)     NOT NULL                     COMMENT '产品名称',
      \`num\`           INT             NOT NULL                     COMMENT '产品数量',
      \`add_time\`      DATETIME        NOT NULL                     COMMENT '新增时间',
      \`update_time\`   DATETIME        NOT NULL                     COMMENT '更新时间',
      PRIMARY KEY (\`id\`)
  ) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COMMENT='产品信息表';
  `
    setCreateDialog({ visible: true, content: demoSql })
  }

  /** 创建表 */
  function handleCreateTable() {
    if (createDialog.content === '') {
      modal.msgError('请输入建表语句')
      return
    }
    createTable({ tableSql: createDialog.content }).then(() => {
      modal.msgSuccess('创建成功')
      setCreateDialog((prev) => ({ ...prev, visible: false }))
      handleQuery()
    })
  }

  /** 预览按钮 */
  function handlePreview(row: any) {
    previewTable(row.id).then((response) => {
      const data = response.data || {}
      const keys = Object.keys(data)
      setPreview({
        open: true,
        title: '代码预览',
        data,
        activeName:
          keys.length > 0 ? keys[0].substring(keys[0].lastIndexOf('/') + 1, keys[0].indexOf('.ftl')) : 'entity.java'
      })
    })
  }

  /** 复制代码 */
  function handleCopy(value: string) {
    navigator.clipboard.writeText(value).then(() => modal.msgSuccess('复制成功'))
  }

  /** 修改按钮操作（顶部按钮点击传入事件对象，此时取勾选 id） */
  function handleEditTable(row: any) {
    const id = row?.id ?? table.ids[0]
    if (id == null) {
      return
    }
    editRef.current?.open(id)
  }

  /** 删除按钮操作（顶部按钮点击传入事件对象，此时取勾选 ids） */
  function handleDelete(row: any) {
    const tableIds = row?.id ?? table.ids
    if (tableIds == null || (Array.isArray(tableIds) && tableIds.length === 0)) {
      return
    }
    modal
      .confirm('是否确认删除表编号为"' + tableIds + '"的数据项？')
      .then(function () {
        return delTable(tableIds)
      })
      .then(() => {
        getList()
        modal.msgSuccess('删除成功')
      })
      .catch(() => {})
  }

  // --------------------------------- 表格列 ---------------------------------

  const columns: ColumnsType<CodegenTable> = [
    {
      title: '序号',
      key: 'index',
      width: 50,
      align: 'center',
      render: (_v, _row, index) => (
        <span>{(queryParams.pageNum - 1) * queryParams.pageSize + (index ?? 0) + 1}</span>
      )
    },
    { title: '表名称', dataIndex: 'tableName', align: 'center', ellipsis: true },
    { title: '表描述', dataIndex: 'tableComment', align: 'center', ellipsis: true },
    { title: '创建时间', dataIndex: 'addTime', align: 'center', width: 160 },
    { title: '更新时间', dataIndex: 'updateTime', align: 'center', width: 160 },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 330,
      render: (_v, row) => (
        <Auth roles={['admin']}>
          <Tooltip title="编辑" placement="top">
            <a style={{ marginRight: 8 }} onClick={() => handleEditTable(row)}>
              <EditOutlined /> 编辑
            </a>
          </Tooltip>
          <Tooltip title="删除" placement="top">
            <a style={{ marginRight: 8 }} onClick={() => handleDelete(row)}>
              <DeleteOutlined /> 删除
            </a>
          </Tooltip>
          <Tooltip title="预览" placement="top">
            <a style={{ marginRight: 8 }} onClick={() => handlePreview(row)}>
              <EyeOutlined /> 预览
            </a>
          </Tooltip>
          <Tooltip title="生成代码" placement="top">
            <a onClick={() => handleGenTable(row)}>
              <DownloadOutlined /> 生成代码
            </a>
          </Tooltip>
        </Auth>
      )
    }
  ]

  // 预览弹窗 TAB 数据（key → 代码内容）
  const previewItems = Object.keys(preview.data).map((key) => {
    const label = key.substring(key.lastIndexOf('/') + 1, key.indexOf('.ftl'))
    return {
      key: label,
      label,
      children: (
        <div>
          <a style={{ float: 'right' }} onClick={() => handleCopy(preview.data[key])}>
            <CopyOutlined /> 复制
          </a>
          <pre className="codegen-pre">{preview.data[key]}</pre>
        </div>
      )
    }
  })

  return (
    <div className="app-container">
      {/* 搜索栏 */}
      <Form
        form={searchForm}
        layout="inline"
        style={{ display: table.showSearch ? 'flex' : 'none', marginBottom: 16, flexWrap: 'wrap', gap: '8px 0' }}
      >
        <Form.Item label="表名称" name="tableName">
          <Input
            style={{ width: 200 }}
            placeholder="请输入表名称"
            allowClear
            value={queryParams.tableName}
            onChange={(e) => setQueryParams((prev) => ({ ...prev, tableName: e.target.value }))}
            onPressEnter={handleQuery}
          />
        </Form.Item>
        <Form.Item label="表描述" name="tableComment">
          <Input
            style={{ width: 200 }}
            placeholder="请输入表描述"
            allowClear
            value={queryParams.tableComment}
            onChange={(e) => setQueryParams((prev) => ({ ...prev, tableComment: e.target.value }))}
            onPressEnter={handleQuery}
          />
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
          <Button type="primary" icon={<PlusOutlined />} onClick={openCreateDialog}>
            创建
          </Button>
          <Button type="primary" icon={<EditOutlined />} disabled={table.single} onClick={handleEditTable}>
            修改
          </Button>
          <Button danger icon={<DeleteOutlined />} disabled={table.multiple} onClick={handleDelete}>
            删除
          </Button>
          <Button type="primary" icon={<DownloadOutlined />} disabled={table.multiple} onClick={handleGenTable}>
            生成
          </Button>
        </Auth>
        <div style={{ marginLeft: 'auto' }}>
          <RightToolbar showSearch={table.showSearch} onUpdateShowSearch={(v) => setTable((prev) => ({ ...prev, showSearch: v }))} onQueryTable={getList} />
        </div>
      </div>

      {/* 生成表列表 */}
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

      {/* 预览界面 */}
      <Modal
        title={preview.title}
        open={preview.open}
        width="80%"
        style={{ top: '5vh' }}
        footer={null}
        onCancel={() => setPreview((prev) => ({ ...prev, open: false }))}
        destroyOnClose
      >
        <Tabs
          activeKey={preview.activeName}
          onChange={(key) => setPreview((prev) => ({ ...prev, activeName: key }))}
          items={previewItems}
        />
      </Modal>

      {/* 创建表弹窗 */}
      <Modal
        title="创建表"
        open={createDialog.visible}
        width={800}
        style={{ top: '5vh' }}
        onCancel={() => setCreateDialog((prev) => ({ ...prev, visible: false }))}
        footer={
          <div>
            <Button type="primary" onClick={handleCreateTable}>
              确 定
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={() => setCreateDialog((prev) => ({ ...prev, visible: false }))}>
              取 消
            </Button>
          </div>
        }
      >
        <span>创建表语句(支持多个建表语句)：</span>
        <Input.TextArea
          rows={10}
          placeholder="请输入文本"
          value={createDialog.content}
          onChange={(e) => setCreateDialog((prev) => ({ ...prev, content: e.target.value }))}
        />
      </Modal>

      {/* 编辑代码生成信息 */}
      <EditTable ref={editRef} onOk={handleQuery} />
    </div>
  )
}
