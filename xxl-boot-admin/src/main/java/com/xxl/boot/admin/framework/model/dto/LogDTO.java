package com.xxl.boot.admin.framework.model.dto;

import java.io.Serializable;
import java.util.Date;

/**
*  Log Entity
*
*  Created by xuxueli on '2024-10-27 12:19:06'.
*/
public class LogDTO implements Serializable {
    private static final long serialVersionUID = 42L;

    /**
    * 日志ID
    */
    private long id;

    /**
    * 日志类型（如操作日志、登陆日志）
    */
    private int type;

    /**
    * 系统模块（如用户管理）
    */
    private String module;

    /**
    * 日志标题
    */
    private String title;

    /**
    * 日志内容
    */
    private String content;

    /**
    * 操作人
    */
    private String operator;

    /**
    * 操作IP
    */
    private String ip;

    /**
    * 新增时间
    */
    private String addTime;

    /**
     * 操作IP（对应地址）
     */
    private String ipAddress;


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

    public String getModule() {
        return module;
    }

    public void setModule(String module) {
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

    public String getAddTime() {
        return addTime;
    }

    public void setAddTime(String addTime) {
        this.addTime = addTime;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

}