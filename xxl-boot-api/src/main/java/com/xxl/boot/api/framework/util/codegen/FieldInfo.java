package com.xxl.boot.api.framework.util.codegen;

/**
 * 字段信息 - 用于代码生成模板渲染
 * 
 * @author xuxueli 2024-01-01
 */
public class FieldInfo {

    private String columnName;     /* 列名，如 add_time */
    private String fieldName;      /* 属性名，如 addTime */
    private String fieldClass;     /* Java类型，如 Date */
    private String columnType;     /* 数据库类型，如 datetime */
    private String fieldComment;   /* 注释 */

    public String getColumnName() {
        return columnName;
    }

    public void setColumnName(String columnName) {
        this.columnName = columnName;
    }

    public String getFieldName() {
        return fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }

    public String getFieldClass() {
        return fieldClass;
    }

    public void setFieldClass(String fieldClass) {
        this.fieldClass = fieldClass;
    }

    public String getColumnType() {
        return columnType;
    }

    public void setColumnType(String columnType) {
        this.columnType = columnType;
    }

    public String getFieldComment() {
        return fieldComment;
    }

    public void setFieldComment(String fieldComment) {
        this.fieldComment = fieldComment;
    }

}
