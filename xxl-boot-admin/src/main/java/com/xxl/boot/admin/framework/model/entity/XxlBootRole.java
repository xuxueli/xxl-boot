package com.xxl.boot.admin.framework.model.entity;

import java.io.Serializable;
import java.util.Date;

/**
 * role
 *
 * Created by xuxueli on '2024-07-21 02:06:59'.
 */
public class XxlBootRole implements Serializable {
    private static final long serialVersionUID = 42L;

    private int id;

    private String name;

    private String code;

    private int status;

    private int order;

    private Date addTime;

    private Date updateTime;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public int getOrder() {
        return order;
    }

    public void setOrder(int order) {
        this.order = order;
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
