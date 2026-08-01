package com.xxl.boot.api.framework.model.entity;

import java.io.Serializable;
import java.util.Date;

/**
 * 消息已读记录实体
 *
 * @author xuxueli 2026-07-25
 */
public class MessageRead implements Serializable {
    private static final long serialVersionUID = 42L;

    private long id;            /* ID */
    private long messageId;     /* 消息ID */
    private int userId;         /* 用户ID */
    private Date addTime;       /* 阅读时间 */

    // plugin（附属字段，关联用户表查询）

    private String userName;    /* 用户账号 */
    private String realName;    /* 用户名称 */

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getMessageId() {
        return messageId;
    }

    public void setMessageId(long messageId) {
        this.messageId = messageId;
    }

    public int getUserId() {
        return userId;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public Date getAddTime() {
        return addTime;
    }

    public void setAddTime(Date addTime) {
        this.addTime = addTime;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getRealName() {
        return realName;
    }

    public void setRealName(String realName) {
        this.realName = realName;
    }

}
