package com.xxl.boot.api.framework.model.dto;

import com.xxl.boot.api.framework.constant.enums.LogModuleEnum;
import com.xxl.boot.api.framework.constant.enums.LogTypeEnum;
import com.xxl.tool.excel.annotation.ExcelField;
import com.xxl.tool.excel.annotation.ExcelSheet;

import java.io.Serializable;

/**
 *  Log Entity
 *
 *  Created by xuxueli on '2024-10-27 12:19:06'.
 */
@ExcelSheet(name = "审计日志列表")
public class LogExcelDTO implements Serializable {
    private static final long serialVersionUID = 42L;

    @ExcelField(name = "日志编号")
    private long   id;                            /* 日志ID */

    @ExcelField(name = "日志类型")
    private String    typeTitle;                          /* 日志类型（0-操作日志、1-登陆日志） */

    @ExcelField(name = "系统模块")
    private String    moduleTitle;                        /* 系统模块编码 */

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

    public LogExcelDTO() {
    }
    public LogExcelDTO(LogDTO logDTO) {

        LogTypeEnum logTypeEnum = LogTypeEnum.match(logDTO.getType());
        LogModuleEnum logModuleEnum = LogModuleEnum.match(logDTO.getModule());

        this.id = logDTO.getId();
        this.typeTitle = logTypeEnum!=null ? logTypeEnum.getTitle() : null;
        this.moduleTitle = logModuleEnum!=null ? logModuleEnum.getTitle() : null;
        this.title = logDTO.getTitle();
        this.content = logDTO.getContent();
        this.operator = logDTO.getOperator();
        this.ip = logDTO.getIp();
        this.addTime = logDTO.getAddTime();
        this.ipAddress = logDTO.getIpAddress();
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getTypeTitle() {
        return typeTitle;
    }

    public void setTypeTitle(String typeTitle) {
        this.typeTitle = typeTitle;
    }

    public String getModuleTitle() {
        return moduleTitle;
    }

    public void setModuleTitle(String moduleTitle) {
        this.moduleTitle = moduleTitle;
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
