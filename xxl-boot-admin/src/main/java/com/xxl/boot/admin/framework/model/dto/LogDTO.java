package com.xxl.boot.admin.framework.model.dto;

import java.io.Serializable;

/**
 * 日志数据传输对象，对外展示使用
 *
 * @author xuxueli 2024-01-01
 */
public class LogDTO implements Serializable {
    private static final long serialVersionUID = 42L;

    private long   id;                            /* 日志ID */
    private int    type;                          /* 日志类型（0-操作日志、1-登陆日志） */
    private int    module;                        /* 系统模块编码 */
    private String title;                         /* 日志标题 */
    private String content;                       /* 日志内容 */
    private String operator;                      /* 操作人 */
    private String ip;                            /* 操作IP */
    private String addTime;                       /* 新增时间（格式化后 yyyy-MM-dd HH:mm:ss） */
    private String ipAddress;                     /* 操作地址（IP 对应地理位置） */

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
