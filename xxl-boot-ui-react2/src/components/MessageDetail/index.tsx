/**
 * 组件：MessageDetail（消息详情抽屉）
 * 功能：展示消息标题、分类、发送人、时间、状态与富文本内容；
 *       供顶部铃铛、首页、消息管理页复用，通过 ref.open(payload) 打开。
 */
import { BellOutlined, MessageOutlined } from '@ant-design/icons';
import { Drawer, Spin, Tag } from 'antd';
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import { getMessage } from '@/services/xxl-boot/system/message';

export type MessageDetailRef = {
  open: (payload: number | API.Message) => void;
};

/** 分类标签映射：0-通知 1-公告 */
const categoryTag = (category?: number) => {
  if (category === 0) {
    return { icon: <BellOutlined />, text: '通知', color: 'success' };
  }
  if (category === 1) {
    return { icon: <MessageOutlined />, text: '公告', color: 'warning' };
  }
  return { icon: <MessageOutlined />, text: '消息', color: 'default' };
};

const MessageDetail = forwardRef<MessageDetailRef>((_, ref) => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<API.Message | null>(null);

  /**
   * 打开抽屉：支持直接传消息对象或消息 ID
   */
  const open = useCallback((payload: number | API.Message) => {
    setVisible(true);
    if (typeof payload === 'object') {
      setMessage(payload);
      setLoading(false);
      return;
    }
    setLoading(true);
    setMessage(null);
    getMessage(payload)
      .then((res) => {
        setMessage(res.data || null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useImperativeHandle(ref, () => ({ open }));

  /** 关闭抽屉 */
  const handleClose = () => {
    setVisible(false);
    setMessage(null);
  };

  const tag = categoryTag(message?.category);

  return (
    <Drawer
      title="消息详情"
      size="50%"
      open={visible}
      onClose={handleClose}
      destroyOnClose
    >
      {loading ? (
        <Spin style={{ width: '100%', marginTop: 48 }} />
      ) : (
        message && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Tag color={tag.color}>{tag.text}</Tag>
              <span style={{ fontSize: 18, fontWeight: 600 }}>
                {message.title}
              </span>
            </div>
            <div style={{ marginBottom: 24, color: 'rgba(0,0,0,0.45)' }}>
              <span style={{ marginRight: 16 }}>发送人：{message.sender}</span>
              <span style={{ marginRight: 16 }}>{message.addTime}</span>
              <Tag
                color={message.status === 0 ? 'success' : 'default'}
                style={{ marginRight: 0 }}
              >
                {message.status === 0 ? '正常' : '已关闭'}
              </Tag>
            </div>
            <div
              style={{ minHeight: 120 }}
              // 富文本消息内容渲染，与 Vue 版 v-html 保持一致
              // biome-ignore lint/security/noDangerouslySetInnerHtml: 富文本内容为后端管理，信任渲染
              dangerouslySetInnerHTML={{
                __html: message.content || '（无内容）',
              }}
            />
          </div>
        )
      )}
    </Drawer>
  );
});

export default MessageDetail;
