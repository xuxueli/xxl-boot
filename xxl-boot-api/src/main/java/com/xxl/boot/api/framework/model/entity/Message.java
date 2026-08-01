package com.xxl.boot.api.framework.model.entity;

import java.io.Serializable;
import java.util.Date;

/**
 * 消息实体
 *
 * @author xuxueli 2024-11-03
 */
public class Message implements Serializable {
    private static final long serialVersionUID = 42L;

    private long id;            /* 消息ID */
    private int category;       /* 分类（0-通知、1-公告） */
    private String title;       /* 标题 */
    private String content;     /* 内容 */
    private String sender;      /* 发送人 */
    private int status;         /* 状态（0-正常、1-下线） */
    private Date addTime;       /* 新增时间 */
    private Date updateTime;    /* 更新时间 */


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

    public Date getAddTime() {
        return addTime;
    }

    public void setAddTime(Date addTime) {
        this.addTime = addTime;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

}