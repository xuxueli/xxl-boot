package com.xxl.boot.admin.framework.util.codegen;

/**
 * 代码生成-字段信息，封装建表 SQL 解析后得到的字段元数据
 *
 * @author xuxueli 2018-05-02 20:11:05
 */
public class FieldInfo {

    private String columnName;   /* 数据库列名，如 add_time */
    private String fieldName;    /* Java 属性名，如 addTime */
    private String fieldClass;   /* Java 属性类型，如 Date */
    private String fieldComment; /* 字段注释 */

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

    public String getFieldComment() {
        return fieldComment;
    }

    public void setFieldComment(String fieldComment) {
        this.fieldComment = fieldComment;
    }

}
