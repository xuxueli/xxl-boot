/**
 * @fileoverview Message 类型定义
 * @description 站内消息与已读用户实体，对应后端 Message.java、MessageRead.java
 * @author xuxueli 2026-11-21
 */
declare namespace API {
  /** 站内消息 */
  type Message = {
    /** 主键 */
    id?: number;
    /** 消息分类 */
    category?: number;
    /** 消息标题 */
    title?: string;
    /** 消息内容（富文本） */
    content?: string;
    /** 发送人 */
    sender?: string;
    /** 状态：0-正常、1-停用 */
    status?: number;
    /** 当前登录人是否已读 */
    isRead?: boolean;
    /** 添加时间 */
    addTime?: string;
    /** 更新时间 */
    updateTime?: string;
  };

  /** 消息已读用户 */
  type MessageRead = {
    /** 主键 */
    id?: number;
    /** 消息主键 */
    messageId?: number;
    /** 用户主键 */
    userId?: number;
    /** 登录账号 */
    userName?: string;
    /** 真实姓名 */
    realName?: string;
    /** 阅读时间 */
    addTime?: string;
  };
}
