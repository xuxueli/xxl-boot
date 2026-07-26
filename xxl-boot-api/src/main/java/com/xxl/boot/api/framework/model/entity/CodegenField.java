package com.xxl.boot.api.framework.model.entity;

import java.io.Serializable;
import java.util.Date;

/**
 * 代码生成 - 业务表字段
 */
public class CodegenField implements Serializable {
    private static final long serialVersionUID = 42L;

    private long id;              /* 编号 */
    private long codegenId;       /* 归属表编号 */
    private String columnName;    /* 列名称 */
    private String columnComment; /* 列描述 */
    private String javaType;      /* JAVA类型 */
    private String javaField;     /* JAVA字段名 */
    private String isInsert;      /* 是否为插入字段（1是） */
    private String isEdit;        /* 是否编辑字段（1是） */
    private String isList;        /* 是否列表字段（1是） */
    private String isQuery;       /* 是否查询字段（1是） */
    private String queryType;     /* 查询方式 */
    private String isRequired;    /* 是否必填（1是） */
    private String htmlType;      /* 显示类型 */
    private String dictType;      /* 字典类型 */
    private int sort;             /* 排序 */
    private Date addTime;         /* 创建时间 */
    private Date updateTime;      /* 更新时间 */

    public long getId() { return id; }
    public void setId(long v) { this.id = v; }
    public long getCodegenId() { return codegenId; }
    public void setCodegenId(long v) { this.codegenId = v; }
    public String getColumnName() { return columnName; }
    public void setColumnName(String v) { this.columnName = v; }
    public String getColumnComment() { return columnComment; }
    public void setColumnComment(String v) { this.columnComment = v; }
    public String getJavaType() { return javaType; }
    public void setJavaType(String v) { this.javaType = v; }
    public String getJavaField() { return javaField; }
    public void setJavaField(String v) { this.javaField = v; }
    public String getIsInsert() { return isInsert; }
    public void setIsInsert(String v) { this.isInsert = v; }
    public String getIsEdit() { return isEdit; }
    public void setIsEdit(String v) { this.isEdit = v; }
    public String getIsList() { return isList; }
    public void setIsList(String v) { this.isList = v; }
    public String getIsQuery() { return isQuery; }
    public void setIsQuery(String v) { this.isQuery = v; }
    public String getQueryType() { return queryType; }
    public void setQueryType(String v) { this.queryType = v; }
    public String getIsRequired() { return isRequired; }
    public void setIsRequired(String v) { this.isRequired = v; }
    public String getHtmlType() { return htmlType; }
    public void setHtmlType(String v) { this.htmlType = v; }
    public String getDictType() { return dictType; }
    public void setDictType(String v) { this.dictType = v; }
    public int getSort() { return sort; }
    public void setSort(int v) { this.sort = v; }
    public Date getAddTime() { return addTime; }
    public void setAddTime(Date v) { this.addTime = v; }
    public Date getUpdateTime() { return updateTime; }
    public void setUpdateTime(Date v) { this.updateTime = v; }
}
