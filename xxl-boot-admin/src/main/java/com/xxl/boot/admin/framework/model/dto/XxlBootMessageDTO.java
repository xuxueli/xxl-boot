package com.xxl.boot.admin.framework.model.dto;

import java.io.Serializable;
import java.util.Date;

/**
*  XxlBootMessage DTO
*
*  Created by xuxueli on '2024-11-03 11:03:29'.
*/
public class XxlBootMessageDTO implements Serializable {
    private static final long serialVersionUID = 42L;

    /**
    * 消息ID
    */
    private long id;

    /**
    * 消息分类（如 通知、新闻 ）
    */
    private int category;

    /**
    * 标题
    */
    private String title;

    /**
    * 内容
    */
    private String content;

    /**
    * 发送人
    */
    private String sender;

    /**
    * 状态：0-正常、1-下线
    */
    private int status;

    /**
    * 新增时间
    */
    private String addTime;

    /**
    * 更新时间
    */
    private String updateTime;


    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public int getCategory() {
        return category;
    }

    public void setCategory(int category) {
        this.category = category;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getAddTime() {
        return addTime;
    }

    public void setAddTime(String addTime) {
        this.addTime = addTime;
    }

    public String getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(String updateTime) {
        this.updateTime = updateTime;
    }
}