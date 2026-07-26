package com.xxl.boot.admin.framework.model.entity;

import java.io.Serializable;
import java.util.Date;

/**
 * 名称：Log
 * 功能：日志实体，对应 xxl_boot_log 表
 */
public class Log implements Serializable {
    private static final long serialVersionUID = 42L;

    private long   id;                            /* 日志ID */
    private int    type;                          /* 日志类型（0-操作日志、1-登陆日志） */
    private int    module;                        /* 系统模块编码（对应 LogModuleEnum） */
    private String title;                         /* 日志标题 */
    private String content;                       /* 日志内容 */
    private String operator;                      /* 操作人 */
    private String ip;                            /* 操作IP */
    private Date   addTime;                       /* 新增时间 */
    private Date   updateTime;                    /* 更新时间 */

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public int getModule() {
        return module;
    }

    public void setModule(int module) {
        this.module = module;
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

    public String getOperator() {
        return operator;
    }

    public void setOperator(String operator) {
        this.operator = operator;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
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
