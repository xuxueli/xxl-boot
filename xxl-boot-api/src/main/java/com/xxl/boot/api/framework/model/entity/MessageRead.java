package com.xxl.boot.api.framework.model.entity;

import java.io.Serializable;
import java.util.Date;

/**
*  MessageRead Entity
*
*  Created by xuxueli on '2026-07-25'.
*/
public class MessageRead implements Serializable {
    private static final long serialVersionUID = 42L;

    /**
    * ID
    */
    private long id;

    /**
    * 消息ID
    */
    private long messageId;

    /**
    * 用户ID
    */
    private int userId;

    /**
    * 阅读时间
    */
    private Date addTime;

    // plugin

    /**
    * 用户账号（附属字段，关联用户表）
    */
    private String userName;

    /**
    * 用户名称（附属字段，关联用户表）
    */
    private String realName;

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
