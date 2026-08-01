package com.xxl.boot.api.framework.model.dto;

import java.io.Serializable;

/**
 * 配置 DTO（用于列表展示）
 *
 * @author xuxueli 2024-11-03
 */
public class ConfigDTO implements Serializable {
    private static final long serialVersionUID = 42L;

    private long id;            /* 配置ID */
    private String name;        /* 配置名称 */
    private String key;         /* 配置Key */
    private String value;       /* 配置Value */
    private int status;         /* 状态（0-正常、1-停用） */
    private String remark;      /* 备注 */
    private String addTime;     /* 新增时间（格式化字符串） */
    private String updateTime;  /* 更新时间（格式化字符串） */


    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
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
