/**
 * 组件：HeaderMessage（站内消息）
 * 功能：顶部导航栏铃铛图标，hover 弹出未读消息列表，支持标记已读、全部已读、预览详情
 */
import {
  BellOutlined,
  LoadingOutlined,
  NotificationOutlined,
} from '@ant-design/icons';
import { Badge, Popover, Tag } from 'antd';
import { createStyles } from 'antd-style';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  listMessageTop,
  markMessageRead,
  markMessageReadAll,
} from '@/services/xxl-boot/system/message';
import MessageDetail, { type MessageDetailRef } from '../MessageDetail';

const useStyles = createStyles(({ token, css }) => ({
  trigger: css`
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    cursor: pointer;
    font-size: 18px;
    color: ${token.colorText};

    &:hover {
      background-color: ${token.colorBgTextHover};
    }
  `,
  panel: css`
    width: 320px;
    padding: 0;
  `,
  header: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 14px;
    background: ${token.colorFillTertiary};
    border-bottom: 1px solid ${token.colorSplit};
    font-size: 13px;
    font-weight: 600;
  `,
  markAll: css`
    font-size: 12px;
    color: ${token.colorPrimary};
    font-weight: normal;
    cursor: pointer;

    &:hover {
      opacity: 0.8;
    }
  `,
  empty: css`
    padding: 24px;
    text-align: center;
    color: ${token.colorTextQuaternary};
    font-size: 12px;
    line-height: 1.8;
  `,
  loading: css`
    padding: 24px;
    text-align: center;
    color: ${token.colorTextQuaternary};
    font-size: 12px;
  `,
  item: css`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    border-bottom: 1px solid ${token.colorBorderSecondary};
    cursor: pointer;
    transition: background 0.15s;

    &:last-child {
      border-bottom: none;
    }

    &:hover {
      background: ${token.colorFillTertiary};
    }
  `,
  itemRead: css`
    opacity: 0.45;
    filter: grayscale(1);
  `,
  itemTitle: css`
    flex: 1;
    font-size: 12px;
    color: ${token.colorText};
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  `,
  itemDate: css`
    flex-shrink: 0;
    font-size: 11px;
    color: ${token.colorTextQuaternary};
  `,
}));

const HeaderMessage: React.FC = () => {
  const { styles } = useStyles();
  const messageViewRef = useRef<MessageDetailRef>(null);
  const [messageList, setMessageList] = useState<API.Message[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * 加载顶部公告列表，统计未读数
   */
  const loadMessageTop = useCallback(() => {
    setLoading(true);
    listMessageTop()
      .then((res) => {
        setMessageList(res.data || []);
        setUnreadCount((res.data || []).filter((n) => !n.isRead).length);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadMessageTop();
  }, [loadMessageTop]);

  /** 鼠标移出铃铛：延迟关闭，给移入 popover 留出时间 */
  const handleLeave = () => {
    leaveTimer.current = setTimeout(() => {
      setPopoverOpen(false);
    }, 1000);
  };

  /** 点击公告：未读则标记已读，预览详情 */
  const previewMessage = (item: API.Message) => {
    if (!item.isRead) {
      markMessageRead(item.id as number).catch(() => {});
      setMessageList((list) =>
        list.map((n) => (n.id === item.id ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((count) => Math.max(0, count - 1));
    }
    messageViewRef.current?.open(item.id as number);
  };

  /** 全部已读：批量标记并更新本地状态 */
  const markAllRead = () => {
    const ids = messageList.map((n) => n.id).join(',');
    if (!ids) return;
    markMessageReadAll(ids).catch(() => {});
    setMessageList((list) => list.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  return (
    <>
      <Popover
        open={popoverOpen}
        placement="bottomRight"
        arrow
        trigger="click"
        content={
          <div className={styles.panel}>
            <div className={styles.header}>
              <span>站内消息</span>
              <span className={styles.markAll} onClick={markAllRead}>
                全部已读
              </span>
            </div>
            {loading ? (
              <div className={styles.loading}>
                <LoadingOutlined spin /> 加载中...
              </div>
            ) : messageList.length === 0 ? (
              <div className={styles.empty}>
                <NotificationOutlined
                  style={{ fontSize: 24, display: 'block', marginBottom: 6 }}
                />
                暂无公告
              </div>
            ) : (
              <div>
                {messageList.map((item) => (
                  <div
                    key={item.id}
                    className={styles.item}
                    onClick={() => previewMessage(item)}
                  >
                    <Tag color={item.category === 1 ? 'warning' : 'success'}>
                      {item.category === 1 ? '通知' : '公告'}
                    </Tag>
                    <span className={item.isRead ? styles.itemRead : undefined}>
                      <span className={styles.itemTitle}>{item.title}</span>
                      <span className={styles.itemDate}>{item.addTime}</span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        }
      >
        <div
          className={styles.trigger}
          onMouseEnter={() => {
            if (leaveTimer.current) clearTimeout(leaveTimer.current);
            setPopoverOpen(true);
          }}
          onMouseLeave={handleLeave}
          onClick={() => {
            if (leaveTimer.current) clearTimeout(leaveTimer.current);
            setPopoverOpen((open) => !open);
          }}
        >
          <Badge count={unreadCount} size="small" overflowCount={99}>
            <BellOutlined />
          </Badge>
        </div>
      </Popover>
      <MessageDetail ref={messageViewRef} />
    </>
  );
};

export default HeaderMessage;
