/**
 * 组件：ReadUsers（已读用户弹窗）
 * 功能：分页展示某条消息的已读用户列表
 */
import { forwardRef, useImperativeHandle, useState } from 'react'
import { Modal, Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { listMessageReadUsers } from '@/api/system/message'
import { parseTime } from '@/utils/common'
import Pagination from '@/components/Pagination'
import type { Message, User } from '@/types/api'

export interface ReadUsersHandle {
  /** 打开弹窗：回显消息信息并加载已读用户列表 */
  open: (row: Message) => void
}

/** 查询参数 */
interface QueryState {
  pageNum: number
  pageSize: number
  messageId?: number
}

/**
 * 已读用户弹窗
 */
const ReadUsers = forwardRef<ReadUsersHandle>(function ReadUsers(_, ref) {
  const [visible, setVisible] = useState(false)
  const [title, setTitle] = useState('')
  const [list, setList] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [queryParams, setQueryParams] = useState<QueryState>({ pageNum: 1, pageSize: 10, messageId: undefined })

  /** 查询已读用户列表 */
  const getList = () => {
    setLoading(true)
    const { pageNum, pageSize, ...rest } = queryParams
    const params = {
      ...rest,
      offset: (pageNum - 1) * pageSize,
      pagesize: pageSize
    }
    listMessageReadUsers(params)
      .then((res) => {
        setList(res.data.data)
        setTotal(res.data.total)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  /** 打开弹窗 */
  const open = (row: Message) => {
    setQueryParams({ pageNum: 1, pageSize: 10, messageId: row.id })
    setTitle(String(row.title || ''))
    setVisible(true)
    getList()
  }

  /** 关闭弹窗：清空列表与计数 */
  const handleClose = () => {
    setList([])
    setTotal(0)
  }

  useImperativeHandle(ref, () => ({ open }))

  const columns: ColumnsType<User> = [
    { title: '序号', key: 'index', width: 70, align: 'center', render: (_v, _r, index) => index + 1 },
    { title: '登录名称', dataIndex: 'userName', align: 'center', ellipsis: true },
    { title: '用户名称', dataIndex: 'realName', align: 'center', ellipsis: true },
    {
      title: '阅读时间',
      dataIndex: 'addTime',
      align: 'center',
      width: 180,
      render: (value: string) => <span>{parseTime(value)}</span>
    }
  ]

  return (
    <Modal
      title={`「${title}」已读用户`}
      open={visible}
      width={680}
      footer={null}
      onCancel={() => setVisible(false)}
      afterClose={handleClose}
      style={{ top: '6vh' }}
    >
      <Table
        rowKey={(record) => String(record.userId)}
        size="small"
        loading={loading}
        columns={columns}
        dataSource={list}
        pagination={false}
        scroll={{ y: 340 }}
      />
      <div style={{ display: total > 0 ? 'block' : 'none' }}>
        <Pagination
          total={total}
          page={queryParams.pageNum}
          limit={queryParams.pageSize}
          onPageChange={(v) => setQueryParams((prev) => ({ ...prev, pageNum: v }))}
          onLimitChange={(v) => setQueryParams((prev) => ({ ...prev, pageSize: v }))}
          onPagination={getList}
        />
      </div>
    </Modal>
  )
})

ReadUsers.displayName = 'ReadUsers'
export default ReadUsers
