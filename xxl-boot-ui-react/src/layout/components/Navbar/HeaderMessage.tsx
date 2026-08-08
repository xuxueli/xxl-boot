/**
 * 组件：HeaderMessage（站内消息）
 * 功能：顶部导航栏铃铛图标，hover 弹出未读消息列表，支持标记已读、全部已读、预览详情
 */
import { useEffect, useRef, useState } from 'react'
import { Badge, Popover, Spin, Tag } from 'antd'
import SvgIcon from '@/components/SvgIcon'
import HeaderMessageDetail, { type HeaderMessageDetailHandle } from './HeaderMessageDetail'
import { listMessageTop, markMessageRead, markMessageReadAll } from '@/api/system/message'
import type { Message } from '@/types/api'
import './navbar.scss'

/** 站内消息项：Message + 本地已读标记 */
type MessageItem = Message & { isRead?: boolean }

/**
 * 站内消息铃铛
 */
export default function HeaderMessage() {
  const [messageList, setMessageList] = useState<MessageItem[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [messageLoading, setMessageLoading] = useState(false)
  const [messageVisible, setMessageVisible] = useState(false)
  const messageLeaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const messageViewRef = useRef<HeaderMessageDetailHandle>(null)

  /*
   * 加载顶部公告列表，统计未读数
   */
  const loadMessageTop = () => {
    setMessageLoading(true)
    listMessageTop()
      .then((res) => {
        const list = res.data || []
        setMessageList(list)
        setUnreadCount(list.filter((n) => !n.isRead).length)
      })
      .finally(() => {
        setMessageLoading(false)
      })
  }

  useEffect(() => {
    loadMessageTop()
  }, [])

  /*
   * 鼠标移入铃铛：显示 popover
   */
  const onMessageEnter = () => {
    clearTimeout(messageLeaveTimer.current || undefined)
    setMessageVisible(true)
  }

  /*
   * 鼠标移出铃铛：延迟关闭，给移入 popover 留出时间
   */
  const onMessageLeave = () => {
    messageLeaveTimer.current = setTimeout(() => {
      setMessageVisible(false)
    }, 1000)
  }

  /*
   * 点击公告：未读则标记已读，预览详情
   */
  const previewMessage = (item: MessageItem) => {
    if (!item.isRead) {
      // 已读标记
      markMessageRead(item.id as number).catch(() => {})
      // 更新已读列表
      setMessageList((prev) => prev.map((n) => (n.id === item.id ? { ...n, isRead: true } : n)))
      // 未读数更新
      setUnreadCount((prev) => Math.max(0, prev - 1))
    }
    // 预览公告
    messageViewRef.current?.open(item.id as number)
  }

  /*
   * 全部已读：批量标记并更新本地状态
   */
  const markAllRead = () => {
    const ids = messageList.map((n) => n.id).join(',')
    if (!ids) return
    markMessageReadAll(ids).catch(() => {})
    // 本地处理：数据 + 计数
    setMessageList((prev) => prev.map((n) => ({ ...n, isRead: true })))
    setUnreadCount(0)
  }

  const popoverContent = (
    <div className="message-popover-content">
      {/* 面板头部：标题 + 全部已读按钮 */}
      <div className="message-header">
        <span className="message-title">站内消息</span>
        <span className="message-mark-all" onClick={markAllRead}>
          全部已读
        </span>
      </div>

      {/* 加载中 */}
      {messageLoading ? (
        <div className="message-loading">
          <Spin size="small" />
          加载中...
        </div>
      ) : messageList.length === 0 ? (
        <div className="message-empty">
          <SvgIcon iconClass="message" style={{ fontSize: 24 }} />
          暂无公告
        </div>
      ) : (
        /* 公告列表 */
        <div>
          {messageList.map((item) => (
            <div
              key={item.id}
              className={`message-item ${item.isRead ? 'is-read' : ''}`}
              onClick={() => previewMessage(item)}
            >
              <Tag color={item.category === 1 ? 'warning' : 'success'} className="message-tag" style={{ flexShrink: 0 }}>
                {item.category === 1 ? '通知' : '公告'}
              </Tag>
              <span className="message-item-title">{item.title}</span>
              <span className="message-item-date">{item.addTime}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div>
      <Popover
        content={popoverContent}
        open={messageVisible}
        trigger="click"
        placement="bottomRight"
        overlayClassName="message-popover"
        arrow={false}
      >
        <div className="message-trigger" onMouseEnter={onMessageEnter} onMouseLeave={onMessageLeave}>
          <Badge count={unreadCount} size="small" overflowCount={99}>
            <SvgIcon iconClass="bell" />
          </Badge>
        </div>
      </Popover>

      {/* 公告详情抽屉 */}
      <HeaderMessageDetail ref={messageViewRef} />
    </div>
  )
}
