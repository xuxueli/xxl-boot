package com.xxl.boot.api.framework.model.dto;

import com.xxl.boot.api.framework.model.entity.XxlBootOrg;

import java.io.Serializable;
import java.util.Date;
import java.util.List;

/**
*  XxlBootOrg DTO
*
*  Created by xuxueli on '2024-09-30 15:38:21'.
*/
public class XxlBootOrgDTO implements Serializable {
    private static final long serialVersionUID = 42L;

    /**
    * 组织ID
    */
    private int id;

    /**
    * 父组织ID
    */
    private int parentId;

    /**
    * 名称
    */
    private String name;

    /**
    * 顺序
    */
    private int order;

    /**
    * 状态：0-正常、1-禁用
    */
    private int status;

    /**
    * 负责人
    */
    private String manager;

    /**
    * 新增时间
    */
    private Date addTime;

    /**
    * 更新时间
    */
    private Date updateTime;

    private List<XxlBootOrgDTO> children;

    public XxlBootOrgDTO() {
    }
    public XxlBootOrgDTO(XxlBootOrg org, List<XxlBootOrgDTO> children) {
        this.setId(org.getId());
        this.setParentId(org.getParentId());
        this.setName(org.getName());
        this.setOrder(org.getOrder());
        this.setStatus(org.getStatus());
        this.setManager(org.getManager());
        this.setAddTime(org.getAddTime());
        this.setUpdateTime(org.getUpdateTime());
        this.setChildren(children);
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

    public String getManager() {
        return manager;
    }

    public void setManager(String manager) {
        this.manager = manager;
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

    public List<XxlBootOrgDTO> getChildren() {
        return children;
    }

    public void setChildren(List<XxlBootOrgDTO> children) {
        this.children = children;
    }

}