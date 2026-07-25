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
    private String columnType;    /* 列类型 */
    private String javaType;      /* JAVA类型 */
    private String javaField;     /* JAVA字段名 */
    private String isPk;          /* 是否主键（1是） */
    private String isIncrement;   /* 是否自增（1是） */
    private String isRequired;    /* 是否必填（1是） */
    private String isInsert;      /* 是否为插入字段（1是） */
    private String isEdit;        /* 是否编辑字段（1是） */
    private String isList;        /* 是否列表字段（1是） */
    private String isQuery;       /* 是否查询字段（1是） */
    private String queryType;     /* 查询方式（等于、不等于、大于、小于、范围） */
    private String htmlType;      /* 显示类型（文本框、文本域、下拉框、复选框、单选框、日期控件） */
    private String dictType;      /* 字典类型 */
    private int sort;             /* 排序 */
    private Date addTime;         /* 创建时间 */
    private Date updateTime;      /* 更新时间 */

    public long getId() { return id; }
    public void setId(long id) { this.id = id; }
    public long getCodegenId() { return codegenId; }
    public void setCodegenId(long codegenId) { this.codegenId = codegenId; }
    public String getColumnName() { return columnName; }
    public void setColumnName(String columnName) { this.columnName = columnName; }
    public String getColumnComment() { return columnComment; }
    public void setColumnComment(String columnComment) { this.columnComment = columnComment; }
    public String getColumnType() { return columnType; }
    public void setColumnType(String columnType) { this.columnType = columnType; }
    public String getJavaType() { return javaType; }
    public void setJavaType(String javaType) { this.javaType = javaType; }
    public String getJavaField() { return javaField; }
    public void setJavaField(String javaField) { this.javaField = javaField; }
    public String getIsPk() { return isPk; }
    public void setIsPk(String isPk) { this.isPk = isPk; }
    public String getIsIncrement() { return isIncrement; }
    public void setIsIncrement(String isIncrement) { this.isIncrement = isIncrement; }
    public String getIsRequired() { return isRequired; }
    public void setIsRequired(String isRequired) { this.isRequired = isRequired; }
    public String getIsInsert() { return isInsert; }
    public void setIsInsert(String isInsert) { this.isInsert = isInsert; }
    public String getIsEdit() { return isEdit; }
    public void setIsEdit(String isEdit) { this.isEdit = isEdit; }
    public String getIsList() { return isList; }
    public void setIsList(String isList) { this.isList = isList; }
    public String getIsQuery() { return isQuery; }
    public void setIsQuery(String isQuery) { this.isQuery = isQuery; }
    public String getQueryType() { return queryType; }
    public void setQueryType(String queryType) { this.queryType = queryType; }
    public String getHtmlType() { return htmlType; }
    public void setHtmlType(String htmlType) { this.htmlType = htmlType; }
    public String getDictType() { return dictType; }
    public void setDictType(String dictType) { this.dictType = dictType; }
    public int getSort() { return sort; }
    public void setSort(int sort) { this.sort = sort; }
    public Date getAddTime() { return addTime; }
    public void setAddTime(Date addTime) { this.addTime = addTime; }
    public Date getUpdateTime() { return updateTime; }
    public void setUpdateTime(Date updateTime) { this.updateTime = updateTime; }
}
