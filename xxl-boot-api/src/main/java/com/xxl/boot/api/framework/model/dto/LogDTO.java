package com.xxl.boot.api.framework.model.dto;

import com.xxl.tool.excel.annotation.ExcelField;
import com.xxl.tool.excel.annotation.ExcelSheet;

import java.io.Serializable;

/**
 *  Log Entity
 *
 *  Created by xuxueli on '2024-10-27 12:19:06'.
 */
@ExcelSheet(name = "审计日志列表")
public class LogDTO implements Serializable {
    private static final long serialVersionUID = 42L;

    @ExcelField(name = "日志编号")
    private long   id;                            /* 日志ID */

    @ExcelField(name = "日志类型")
    private int    type;                          /* 日志类型（0-操作日志、1-登陆日志） */

    @ExcelField(name = "系统模块")
    private int    module;                        /* 系统模块编码 */

    @ExcelField(name = "日志标题")
    private String title;                         /* 日志标题 */

    @ExcelField(name = "日志内容")
    private String content;                       /* 日志内容 */

    @ExcelField(name = "操作人")
    private String operator;                      /* 操作人 */

    @ExcelField(name = "操作IP")
    private String ip;                            /* 操作IP */

    @ExcelField(name = "操作时间")
    private String addTime;                       /* 新增时间（格式化后 yyyy-MM-dd HH:mm:ss） */

    @ExcelField(name = "操作地址")
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
