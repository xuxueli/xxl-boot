package com.xxl.boot.admin.plugin.ai.model;

import java.io.Serializable;
import java.util.Date;

/**
*  Agent Entity
*
*  Created by xuxueli on '2025-11-30 20:41:37'.
*/
public class Agent implements Serializable {
    private static final long serialVersionUID = 42L;

    /**
    * 用户ID
    */
    private int id;

    /**
    * 账号
    */
    private String username;

    /**
    * 密码
    */
    private String password;

    /**
    * 登录token
    */
    private String userToken;

    /**
    * 状态：0-正常、1-禁用
    */
    private int status;

    /**
    * 真实姓名
    */
    private String realName;

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

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUserToken() {
        return userToken;
    }

    public void setUserToken(String userToken) {
        this.userToken = userToken;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getRealName() {
        return realName;
    }

    public void setRealName(String realName) {
        this.realName = realName;
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