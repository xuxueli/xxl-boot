package com.xxl.boot.api.framework.model.dto;

import java.io.Serializable;

/**
 * 代码生成 - 业务表字段 DTO
 */
public class CodegenFieldDTO implements Serializable {
    private static final long serialVersionUID = 42L;

    private long id;              private long codegenId;
    private String columnName;    private String columnComment;
    private String columnType;    private String javaType;
    private String javaField;     private String isPk;
    private String isIncrement;   private String isRequired;
    private String isInsert;      private String isEdit;
    private String isList;        private String isQuery;
    private String queryType;     private String htmlType;
    private String dictType;      private int sort;
    private String addTime;       private String updateTime;

    public long getId() { return id; } public void setId(long v) { this.id = v; }
    public long getCodegenId() { return codegenId; } public void setCodegenId(long v) { this.codegenId = v; }
    public String getColumnName() { return columnName; } public void setColumnName(String v) { this.columnName = v; }
    public String getColumnComment() { return columnComment; } public void setColumnComment(String v) { this.columnComment = v; }
    public String getColumnType() { return columnType; } public void setColumnType(String v) { this.columnType = v; }
    public String getJavaType() { return javaType; } public void setJavaType(String v) { this.javaType = v; }
    public String getJavaField() { return javaField; } public void setJavaField(String v) { this.javaField = v; }
    public String getIsPk() { return isPk; } public void setIsPk(String v) { this.isPk = v; }
    public String getIsIncrement() { return isIncrement; } public void setIsIncrement(String v) { this.isIncrement = v; }
    public String getIsRequired() { return isRequired; } public void setIsRequired(String v) { this.isRequired = v; }
    public String getIsInsert() { return isInsert; } public void setIsInsert(String v) { this.isInsert = v; }
    public String getIsEdit() { return isEdit; } public void setIsEdit(String v) { this.isEdit = v; }
    public String getIsList() { return isList; } public void setIsList(String v) { this.isList = v; }
    public String getIsQuery() { return isQuery; } public void setIsQuery(String v) { this.isQuery = v; }
    public String getQueryType() { return queryType; } public void setQueryType(String v) { this.queryType = v; }
    public String getHtmlType() { return htmlType; } public void setHtmlType(String v) { this.htmlType = v; }
    public String getDictType() { return dictType; } public void setDictType(String v) { this.dictType = v; }
    public int getSort() { return sort; } public void setSort(int v) { this.sort = v; }
    public String getAddTime() { return addTime; } public void setAddTime(String v) { this.addTime = v; }
    public String getUpdateTime() { return updateTime; } public void setUpdateTime(String v) { this.updateTime = v; }
}
