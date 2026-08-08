/**
 * 页面：Log（日志管理）
 * 功能：查询、删除日志，查看日志详情
 * @author xuxueli 2026-08-09
 */
import { useEffect, useRef, useState } from 'react'
import { Button, Form, Input, Select, Table, Tag } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { DeleteOutlined, DownloadOutlined, EyeOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons'
import LogDetail, { type LogDetailHandle } from './detail'
import Pagination from '@/components/Pagination'
import RightToolbar from '@/components/RightToolbar'
import Auth from '@/components/Auth'
import { pageList, delOperlog } from '@/api/system/log'
import { loadEnumItem } from '@/api/system/dict/data'
import { parseTime } from '@/utils/common'
import { buildPageParams } from '@/hooks/buildPageParams'
import modal from '@/utils/modal'
import { download } from '@/utils/request'
import type { Log } from '@/types/api'
import type { EnumOption } from '@/types'

// --------------------------------- ref data ---------------------------------

/** 搜索栏：查询参数 */
interface LogQueryState {
  pageNum: number
  pageSize: number
  type: number
  module: number
  title?: string
  [key: string]: unknown
}

/** 表格：UI数据 */
interface TableState {
  list: Log[]
  total: number
  loading: boolean
  showSearch: boolean
  ids: number[]
  multiple: boolean
}

/** 枚举数据状态（下拉选项 + 编码 → 名称映射） */
interface DictState {
  options: EnumOption[]
  map: Record<number | string, string | undefined>
}

export default function Log() {
  const logDetailRef = useRef<LogDetailHandle>(null)

  // 页面初始化：加载日志类型、系统模块枚举 + 日志列表
  useEffect(() => {
    getList()
    loadEnumItem('LogTypeEnum').then((res) => {
      setTypeDict({ options: res.data, map: buildMap(res.data) })
    })
    loadEnumItem('LogModuleEnum').then((res) => {
      setModuleDict({ options: res.data, map: buildMap(res.data) })
    })
     
  }, [])

  // 搜索栏：查询参数
  const [queryParams, setQueryParams] = useState<LogQueryState>({
    pageNum: 1,
    pageSize: 10,
    type: -1,
    module: 0,
    title: undefined
  })

  // 表格：UI数据
  const [table, setTable] = useState<TableState>({
    list: [],
    total: 0,
    loading: true,
    showSearch: true,
    ids: [],
    multiple: true
  })

  // 枚举数据（下拉选项 + 编码 → 名称映射）
  const [typeDict, setTypeDict] = useState<DictState>({ options: [], map: {} })
  const [moduleDict, setModuleDict] = useState<DictState>({ options: [], map: {} })

  // 表单实例
  const [searchForm] = Form.useForm()

  // --------------------------------- fun ---------------------------------

  /** 枚举选项 → 编码名称映射 */
  function buildMap(options: EnumOption[]): Record<number | string, string | undefined> {
    const map: Record<number | string, string | undefined> = {}
    options.forEach((item) => {
      map[item.code] = item.title
    })
    return map
  }

  /** 查询日志列表 */
  function getList() {
    setTable((prev) => ({ ...prev, loading: true }))
    const params = buildPageParams(queryParams)()
    pageList(params).then((response) => {
      setTable((prev) => ({
        ...prev,
        list: response.data.data,
        total: response.data.total,
        loading: false
      }))
    })
  }

  /** 日志类型编码 → 文案 */
  function typeText(type: number) {
    const item = typeDict.options.find((i) => i.code === type)
    return item ? item.title : type
  }

  /** 搜索按钮操作 */
  function handleQuery() {
    setQueryParams((prev) => ({ ...prev, pageNum: 1 }))
    getList()
  }

  /** 重置按钮操作 */
  function resetQuery() {
    searchForm.resetFields()
    setQueryParams((prev) => ({ ...prev, type: -1, module: 0, title: undefined, pageNum: 1 }))
    handleQuery()
  }

  /** 多选框选中数据 */
  function handleSelectionChange(selectedRowKeys: React.Key[]) {
    const ids = selectedRowKeys.map((k) => Number(k))
    setTable((prev) => ({
      ...prev,
      ids,
      multiple: !selectedRowKeys.length
    }))
  }

  /** 查看日志详情 */
  function handleDetail(row: Log) {
    logDetailRef.current?.open(row)
  }

  /** 导出按钮操作 */
  function handleExport() {
    download('system/log/export', { ...buildPageParams(queryParams)() }, `log_${new Date().getTime()}.xlsx`)
  }

  /** 删除按钮操作（顶部按钮点击传入的是事件对象而非行数据，此时取勾选 ids） */
  function handleDelete(row: any) {
    const logIds = row?.id ?? table.ids
    if (logIds == null || (Array.isArray(logIds) && logIds.length === 0)) {
      return
    }
    modal
      .confirm('是否确认删除日志编号为"' + logIds + '"的数据项?')
      .then(function () {
        return delOperlog(logIds)
      })
      .then(() => {
        getList()
        modal.msgSuccess('删除成功')
      })
      .catch(() => {})
  }

  // --------------------------------- 表格列 ---------------------------------

  const columns: ColumnsType<Log> = [
    { title: '日志编号', dataIndex: 'id', key: 'id', width: 80, align: 'center' },
    {
      title: '日志类型',
      key: 'type',
      width: 100,
      align: 'center',
      render: (_v, row) => (
        <Tag color={row.type === 0 ? 'blue' : 'orange'}>{typeText(Number(row.type))}</Tag>
      )
    },
    {
      title: '系统模块',
      key: 'module',
      align: 'center',
      ellipsis: true,
      render: (_v, row) => <span>{moduleDict.map[row.module as number] || row.module}</span>
    },
    { title: '日志标题', dataIndex: 'title', align: 'center', ellipsis: true },
    { title: '操作人', dataIndex: 'operator', align: 'center', width: 110, ellipsis: true },
    {
      title: '操作地址',
      key: 'ipAddress',
      align: 'center',
      width: 160,
      ellipsis: true,
      render: (_v, row) => <span>{String((row.ipAddress || row.ip) ?? '')}</span>
    },
    {
      title: '新增时间',
      dataIndex: 'addTime',
      align: 'center',
      width: 180,
      render: (value: string) => <span>{parseTime(value)}</span>
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      width: 90,
      render: (_v, row) => (
        <a onClick={() => handleDetail(row)}>
          <EyeOutlined /> 详细
        </a>
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
        <Form.Item label="日志类型" name="type">
          <Select
            style={{ width: 200 }}
            placeholder="日志类型"
            allowClear
            value={queryParams.type}
            onChange={(v) => setQueryParams((prev) => ({ ...prev, type: v }))}
          >
            <Select.Option value={-1}>全部</Select.Option>
            {typeDict.options.map((item: EnumOption) => (
              <Select.Option key={item.code} value={item.code}>
                {item.title}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="系统模块" name="module">
          <Select
            style={{ width: 200 }}
            placeholder="系统模块"
            allowClear
            value={queryParams.module}
            onChange={(v) => setQueryParams((prev) => ({ ...prev, module: v }))}
          >
            <Select.Option value={0}>全部</Select.Option>
            {moduleDict.options.map((item: EnumOption) => (
              <Select.Option key={item.code} value={item.code}>
                {item.title}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="日志标题" name="title">
          <Input
            style={{ width: 200 }}
            placeholder="请输入日志标题"
            allowClear
            value={queryParams.title}
            onChange={(e) => setQueryParams((prev) => ({ ...prev, title: e.target.value }))}
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
          <Button danger icon={<DeleteOutlined />} disabled={table.multiple} onClick={handleDelete}>
            删除
          </Button>
          <Button icon={<DownloadOutlined />} onClick={handleExport}>
            导出
          </Button>
        </Auth>
        <div style={{ marginLeft: 'auto' }}>
          <RightToolbar showSearch={table.showSearch} onUpdateShowSearch={(v) => setTable((prev) => ({ ...prev, showSearch: v }))} onQueryTable={getList} />
        </div>
      </div>

      {/* 日志列表 */}
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

      {/* 日志详情弹窗 */}
      <LogDetail ref={logDetailRef} moduleMap={moduleDict.map} />
    </div>
  )
}
