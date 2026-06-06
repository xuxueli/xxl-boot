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

    /**
    * 角色ID
    */
    private int id;

    /**
    * 角色名称
    */
    private String name;

    /**
    * 排序
    */
    private int order;

    /**
    * 新增时间
    */
    private Date addTime;

    /**
    * 更新时间
    */
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