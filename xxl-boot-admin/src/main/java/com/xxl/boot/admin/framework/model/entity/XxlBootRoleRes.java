package com.xxl.boot.admin.framework.model.entity;

import java.io.Serializable;
import java.util.Date;

/**
 * role res
 *
 * Created by xuxueli on '2024-07-21 02:06:59'.
 */
public class XxlBootRoleRes implements Serializable {
    private static final long serialVersionUID = 42L;

    /**
    * ID
    */
    private int id;

    /**
    * 角色ID
    */
    private int roleId;

    /**
    * 资源ID
    */
    private int resId;

    /**
    * 新增时间
    */
    private Date addTime;

    /**
    * 更新时间
    */
    private Date updateTime;

    public XxlBootRoleRes() {
    }
    public XxlBootRoleRes(int roleId, int resId) {
        this.roleId = roleId;
        this.resId = resId;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getRoleId() {
        return roleId;
    }

    public void setRoleId(int roleId) {
        this.roleId = roleId;
    }

    public int getResId() {
        return resId;
    }

    public void setResId(int resId) {
        this.resId = resId;
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