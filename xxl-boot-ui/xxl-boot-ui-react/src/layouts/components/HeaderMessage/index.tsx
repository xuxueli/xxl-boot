/**
 * 布局组件：HeaderMessage（站内消息）
 * 功能：顶部导航栏铃铛图标，hover 弹出未读消息列表，支持标记已读、全部已读、预览详情
 */
import {
  BellOutlined,
  LoadingOutlined,
  NotificationOutlined,
} from '@ant-design/icons';
import { Badge, Tag } from 'antd';
import { createStyles } from 'antd-style';
import { clsx } from 'clsx';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dropdown } from '@/components';
import MessageDetail, {
  type MessageDetailRef,
} from '@/pages/system/message/MessageDetail';
import {
  listMessageTop,
  markMessageRead,
  markMessageReadAll,
} from '@/services/system/message';

/** 消息面板及铃铛触发区样式 */
const useStyles = createStyles(({ token, css }) => ({
  trigger: css`
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 48px;
    margin-right: -4px;
    cursor: pointer;
    /*font-size: 20px;*/
    color: ${token.colorText};

    &:hover {
      background-color: ${token.colorBgTextHover};
    }
  `,
  panel: css`
    width: 320px;
    padding: 0;
    background: ${token.colorBgElevated};
    border-radius: ${token.borderRadiusLG}px;
    box-shadow: ${token.boxShadowSecondary};
    overflow: hidden;
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
  /** 标题 + 时间容器：flex 布局，min-width 0 保证子项可压缩截断 */
  itemMain: css`
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 8px;
  `,
  itemTitle: css`
    flex: 1;
    min-width: 0;
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
    /* 等宽数字：AlibabaSans 不支持 tabular-nums，改用系统字体保证时间列对齐 */
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
      'Helvetica Neue', Arial, sans-serif;
    font-variant-numeric: tabular-nums;
  `,
}));

/**
 * 站内消息组件：铃铛展示未读数，下拉面板展示顶部公告列表
 */
const HeaderMessage = () => {
  const { styles } = useStyles();
  const messageViewRef = useRef<MessageDetailRef>(null); /* 详情抽屉引用 */
  const [messageList, setMessageList] = useState<API.Message[]>(
    [],
  ); /* 顶部公告列表 */
  const [unreadCount, setUnreadCount] = useState(0); /* 未读数量 */
  const [loading, setLoading] = useState(false); /* 列表加载状态 */

  /**
   * 加载顶部公告列表，并统计未读数量
   */
  const loadMessageTop = useCallback(() => {
    setLoading(true);
    listMessageTop()
      .then((res) => {
        setMessageList(res.data || []);
        /* 未读数 = 列表中 isRead 为 false 的条数 */
        setUnreadCount((res.data || []).filter((n) => !n.isRead).length);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []); // 稳定函数（ useCallback 依赖数组是 [] ）：没有依赖，初始化后保持不变，首次挂载时创建一次；

  /* 组件挂载后：加载一次公告列表 */
  useEffect(() => {
    loadMessageTop();
  }, [loadMessageTop]); // 组件挂载后执行一次，依赖 loadMessageTop（稳定函数），不会重复执行。

  /**
   * 点击公告：未读先标记已读并同步本地状态，随后打开详情抽屉
   */
  const previewMessage = (item: API.Message) => {
    /* 未读消息：调用接口标记已读，并更新本地列表与未读数 */
    if (!item.isRead) {
      markMessageRead(item.id as number).catch(() => {});
      setMessageList((list) =>
        list.map((n) => (n.id === item.id ? { ...n, isRead: true } : n)),
      );
      setUnreadCount((count) => Math.max(0, count - 1));
    }
    /* 打开详情抽屉（按消息 ID 拉取完整内容） */
    messageViewRef.current?.open(item.id as number);
  };

  /**
   * 全部已读：批量标记后同步更新本地列表与未读数
   */
  const markAllRead = () => {
    const ids = messageList.map((n) => n.id).join(',');
    /* 无消息时无需处理 */
    if (!ids) return;
    markMessageReadAll(ids).catch(() => {});
    setMessageList((list) => list.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  /*
   * 渲染：顶部铃铛 + 下拉面板 + 详情抽屉
   *   - return ( <> ... </> )：用于返回多个并列的元素
   */
  return (
    <>
      <Dropdown
        placement="bottomRight"
        arrow
        trigger={['hover']}
        popupRender={() => (
          <div className={styles.panel}>
            <div className={styles.header}>
              <span>站内消息</span>
              <span className={styles.markAll} onClick={markAllRead}>
                全部已读
              </span>
            </div>
            {/* 加载中：展示 loading 文案 */}
            {loading ? (
              <div className={styles.loading}>
                <LoadingOutlined spin /> 加载中...
              </div>
            ) : /* 无公告：展示空态 */ messageList.length === 0 ? (
              <div className={styles.empty}>
                <NotificationOutlined
                  style={{ fontSize: 24, display: 'block', marginBottom: 6 }}
                />
                暂无公告
              </div>
            ) : (
              /* 有公告：渲染消息列表 */
              <div>
                {messageList.map((item) => (
                  <div
                    key={item.id}
                    className={styles.item}
                    onClick={() => previewMessage(item)}
                  >
                    {/* 分类标签：0-通知，其他-公告 */}
                    <Tag color={item.category === 0 ? 'success' : 'warning'}>
                      {item.category === 0 ? '通知' : '公告'}
                    </Tag>
                    <span
                      className={clsx(
                        styles.itemMain,
                        item.isRead && styles.itemRead,
                      )}
                    >
                      <span className={styles.itemTitle}>{item.title}</span>
                      <span className={styles.itemDate}>{item.addTime}</span>
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      >
        {/* 铃铛触发器：未读数角标 */}
        <div className={styles.trigger}>
          <Badge count={unreadCount} size="small" overflowCount={99}>
            <BellOutlined style={{ fontSize: 18 }} />
          </Badge>
        </div>
      </Dropdown>
      {/* 消息详情抽屉 */}
      <MessageDetail ref={messageViewRef} />
    </>
  );
};

export default HeaderMessage;
