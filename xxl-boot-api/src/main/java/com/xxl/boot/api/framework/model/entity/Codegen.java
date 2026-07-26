package com.xxl.boot.api.framework.model.entity;

import java.io.Serializable;
import java.util.Date;

/**
 * 代码生成 - 业务表
 */
public class Codegen implements Serializable {
    private static final long serialVersionUID = 42L;

    private long id;                /* 编号 */
    private String tableName;       /* 表名称 */
    private String tableComment;    /* 表描述 */
    private String remark;          /* 备注 */
    private String packageName;     /* 生成包路径 */
    private String moduleName;      /* 生成模块名 */
    private String businessName;    /* 生成业务名 */
    private String functionName;    /* 生成功能名 */
    private String functionAuthor;  /* 生成功能作者 */
    private int formColNum;         /* 表单布局（1单列 2双列 3三列） */
    private String tplCategory;     /* 使用的模板（crud单表操作 tree树表操作） */
    private String tplWebType;      /* 前端模板类型（element-plus、element-plus-typescript） */
    private Date addTime;           /* 创建时间 */
    private Date updateTime;        /* 更新时间 */

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getTableName() {
        return tableName;
    }

    public void setTableName(String tableName) {
        this.tableName = tableName;
    }

    public String getTableComment() {
        return tableComment;
    }

    public void setTableComment(String tableComment) {
        this.tableComment = tableComment;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public String getPackageName() {
        return packageName;
    }

    public void setPackageName(String packageName) {
        this.packageName = packageName;
    }

    public String getModuleName() {
        return moduleName;
    }

    public void setModuleName(String moduleName) {
        this.moduleName = moduleName;
    }

    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }

    public String getFunctionName() {
        return functionName;
    }

    public void setFunctionName(String functionName) {
        this.functionName = functionName;
    }

    public String getFunctionAuthor() {
        return functionAuthor;
    }

    public void setFunctionAuthor(String functionAuthor) {
        this.functionAuthor = functionAuthor;
    }

    public int getFormColNum() {
        return formColNum;
    }

    public void setFormColNum(int formColNum) {
        this.formColNum = formColNum;
    }

    public String getTplCategory() {
        return tplCategory;
    }

    public void setTplCategory(String tplCategory) {
        this.tplCategory = tplCategory;
    }

    public String getTplWebType() {
        return tplWebType;
    }

    public void setTplWebType(String tplWebType) {
        this.tplWebType = tplWebType;
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
