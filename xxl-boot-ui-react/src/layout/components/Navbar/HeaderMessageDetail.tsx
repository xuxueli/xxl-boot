/**
 * 组件：HeaderMessageDetail（站内消息详情抽屉）
 * 功能：从右侧滑出抽屉展示消息完整详情内容
 */
import { forwardRef, useImperativeHandle, useState } from 'react'
import { Drawer, Spin, Tag } from 'antd'
import { BellOutlined, MessageOutlined, FileTextOutlined, UserOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { getMessage } from '@/api/system/message'
import './navbar.scss'

/** 消息详情：覆盖 Message 常用字段，status 支持字符串/数字两种形态 */
interface MessageDetail {
  id?: number
  category?: number
  title?: string
  content?: string
  sender?: string
  status?: number | string
  addTime?: string
  updateTime?: string
  messageId?: number
  messageContent?: string
  [key: string]: unknown
}

export interface HeaderMessageDetailHandle {
  /** 打开详情：支持传入完整公告对象（直接展示）或 messageId（请求接口加载） */
  open: (payload: MessageDetail | number | string | null) => void
}

/**
 * 站内消息详情抽屉
 */
const HeaderMessageDetail = forwardRef<HeaderMessageDetailHandle>((_, ref) => {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [detail, setDetail] = useState<MessageDetail | null>(null)

  // 公告状态：'0' 为正常
  const isStatusNormal = () => {
    const status = detail && detail.status
    return status === '0' || status === 0
  }

  // 是否有正文内容（非空字符串）
  const hasContent = () => {
    const content = detail && detail.content
    return content != null && String(content).trim() !== ''
  }

  /**
   * 打开详情
   */
  const open = (payload: MessageDetail | number | string | null) => {
    let id: number | string | null = null
    let preset: MessageDetail | null = null
    if (payload != null && typeof payload === 'object') {
      id = (payload.messageId as number | string) ?? null
      if (payload.messageContent != null) preset = payload
    } else {
      id = payload
    }
    setVisible(true)

    // 传入 object，直接展示模式：已有完整数据，跳过请求
    if (preset) {
      setDetail(preset)
      return
    }

    // 无有效 id 时置空返回
    if (id == null || id === '') {
      setDetail(null)
      return
    }

    // 传入 messageId：调接口获取详情
    setLoading(true)
    setDetail(null)
    getMessage(id as number)
      .then((res) => {
        setDetail(res.data as MessageDetail)
      })
      .catch(() => {
        setDetail(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  // 暴露命令式方法
  useImperativeHandle(ref, () => ({
    open
  }))

  // 关闭抽屉：清空详情数据
  const handleClose = () => {
    setVisible(false)
    setDetail(null)
    setLoading(false)
  }

  return (
    <Drawer title="站内消息详情" open={visible} width="50%" onClose={handleClose} className="message-detail-drawer">
      <Spin spinning={loading} tip="加载中...">
        {/* 无数据状态 */}
        {!detail ? (
          <div className="message-empty">
            <FileTextOutlined className="message-empty-icon" />
            <span>暂无数据</span>
          </div>
        ) : (
          <div className="message-page">
            {/* 类型标签：通知 / 公告 / 消息 */}
            <div className="message-type-wrap">
              {detail.category === 1 ? (
                <span className="message-type-tag type-notify">
                  <BellOutlined /> 通知
                </span>
              ) : detail.category === 2 ? (
                <span className="message-type-tag type-announce">
                  <MessageOutlined /> 公告
                </span>
              ) : (
                <span className="message-type-tag type-notify">
                  <FileTextOutlined /> 消息
                </span>
              )}
            </div>

            {/* 公告标题 */}
            <h1 className="message-title">{detail.title}</h1>

            {/* 公告元数据：发布人 / 发布时间 / 状态 */}
            <div className="message-meta">
              <span className="meta-item">
                <UserOutlined />
                <span>{detail.sender || '—'}</span>
              </span>
              <span className="meta-item">
                <ClockCircleOutlined />
                <span>{detail.addTime || '—'}</span>
              </span>
              <span className="meta-item">
                <span className={`status-dot ${isStatusNormal() ? 'status-ok' : 'status-off'}`} />
                <span>{isStatusNormal() ? '正常' : '已关闭'}</span>
              </span>
            </div>

            {/* 装饰分隔线 */}
            <div className="message-divider">
              <span className="message-divider-dot"></span>
              <span className="message-divider-dot"></span>
              <span className="message-divider-dot"></span>
            </div>

            {/* 公告正文 */}
            <div className="message-body">
              {hasContent() ? (
                <div className="message-content" dangerouslySetInnerHTML={{ __html: detail.content || '' }} />
              ) : (
                <div className="message-empty message-empty--inner">
                  <FileTextOutlined /> 暂无内容
                </div>
              )}
            </div>
          </div>
        )}
      </Spin>
    </Drawer>
  )
})

HeaderMessageDetail.displayName = 'HeaderMessageDetail'
export default HeaderMessageDetail
