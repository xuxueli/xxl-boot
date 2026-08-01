package com.xxl.boot.api.framework.model.entity;

import java.io.Serializable;
import java.util.Date;

/**
 * 配置实体
 *
 * @author xuxueli 2024-11-03
 */
public class Config implements Serializable {
    private static final long serialVersionUID = 42L;

    private long id;            /* 配置ID */
    private String name;        /* 配置名称 */
    private String key;         /* 配置Key */
    private String value;       /* 配置Value */
    private int status;         /* 状态（0-正常、1-停用） */
    private String remark;      /* 备注 */
    private Date addTime;       /* 新增时间 */
    private Date updateTime;    /* 更新时间 */


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
