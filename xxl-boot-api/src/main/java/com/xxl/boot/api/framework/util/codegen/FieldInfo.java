package com.xxl.boot.api.framework.util.codegen;

public class FieldInfo {

    private String columnName;     /* 列名，如 add_time */
    private String fieldName;      /* 属性名，如 addTime */
    private String fieldClass;     /* Java类型，如 Date */
    private String columnType;     /* 数据库类型，如 datetime */
    private String fieldComment;   /* 注释 */

    public String getColumnName() { return columnName; }
    public void setColumnName(String v) { this.columnName = v; }
    public String getFieldName() { return fieldName; }
    public void setFieldName(String v) { this.fieldName = v; }
    public String getFieldClass() { return fieldClass; }
    public void setFieldClass(String v) { this.fieldClass = v; }
    public String getColumnType() { return columnType; }
    public void setColumnType(String v) { this.columnType = v; }
    public String getFieldComment() { return fieldComment; }
    public void setFieldComment(String v) { this.fieldComment = v; }
}
