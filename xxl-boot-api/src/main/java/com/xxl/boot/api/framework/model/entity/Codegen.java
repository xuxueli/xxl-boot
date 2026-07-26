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
    private String tplWebType;      /* 前端模板类型 */
    private Date addTime;           /* 创建时间 */
    private Date updateTime;        /* 更新时间 */

    public long getId() { return id; }
    public void setId(long id) { this.id = id; }
    public String getTableName() { return tableName; }
    public void setTableName(String v) { this.tableName = v; }
    public String getTableComment() { return tableComment; }
    public void setTableComment(String v) { this.tableComment = v; }
    public String getRemark() { return remark; }
    public void setRemark(String v) { this.remark = v; }
    public String getPackageName() { return packageName; }
    public void setPackageName(String v) { this.packageName = v; }
    public String getModuleName() { return moduleName; }
    public void setModuleName(String v) { this.moduleName = v; }
    public String getBusinessName() { return businessName; }
    public void setBusinessName(String v) { this.businessName = v; }
    public String getFunctionName() { return functionName; }
    public void setFunctionName(String v) { this.functionName = v; }
    public String getFunctionAuthor() { return functionAuthor; }
    public void setFunctionAuthor(String v) { this.functionAuthor = v; }
    public int getFormColNum() { return formColNum; }
    public void setFormColNum(int v) { this.formColNum = v; }
    public String getTplCategory() { return tplCategory; }
    public void setTplCategory(String v) { this.tplCategory = v; }
    public String getTplWebType() { return tplWebType; }
    public void setTplWebType(String v) { this.tplWebType = v; }
    public Date getAddTime() { return addTime; }
    public void setAddTime(Date v) { this.addTime = v; }
    public Date getUpdateTime() { return updateTime; }
    public void setUpdateTime(Date v) { this.updateTime = v; }
}
