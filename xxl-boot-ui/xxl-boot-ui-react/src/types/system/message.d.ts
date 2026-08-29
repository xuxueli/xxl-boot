/**
 * 类型定义：消息管理
 * 对应后端消息实体（Message）与消息已读用户（MessageRead）。
 */
declare namespace API {
  /** 消息 */
  type Message = {
    id?: number;
    category?: number;
    title?: string;
    content?: string;
    sender?: string;
    status?: number;
    isRead?: boolean;
    addTime?: string;
    updateTime?: string;
  };

  /** 消息已读用户 */
  type MessageRead = {
    id?: number;
    messageId?: number;
    userId?: number;
    userName?: string;
    realName?: string;
    addTime?: string;
  };
}
