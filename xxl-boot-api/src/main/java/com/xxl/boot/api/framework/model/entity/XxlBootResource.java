package com.xxl.boot.api.framework.model.entity;

import java.io.Serializable;
import java.util.Date;

/**
*  XxlBootResource Entity
*
*  Created by xuxueli on '2024-07-28 12:52:39'.
*/
public class XxlBootResource implements Serializable {
    private static final long serialVersionUID = 42L;

    /**
    * 资源ID
    */
    private int id;

    /**
    * 父节点ID
    */
    private int parentId;

    /**
    * 名称
    */
    private String name;

    /**
    * 类型
    */
    private int type;

    /**
    * 权限标识
    */
    private String permission;

    /**
    * 菜单地址
    */
    private String url;

    /**
     * ICON
     */
    private String icon;

    /**
    * 顺序
    */
    private int order;

    /**
    * 状态：0-正常、1-禁用
    */
    private int status;

    /**
    * 新增时间
    */
    private Date addTime;

    /**
    * 更新时间
    */
    private Date updateTime;

    public XxlBootResource() {
    }
    public XxlBootResource(int parentId, int Id, String name) {
        setId(Id);
        setParentId(parentId);
        setName(name);
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getParentId() {
        return parentId;
    }

    public void setParentId(int parentId) {
        this.parentId = parentId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public String getPermission() {
        return permission;
    }

    public void setPermission(String permission) {
        this.permission = permission;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public int getOrder() {
        return order;
    }

    public void setOrder(int order) {
        this.order = order;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
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