package com.xxl.boot.api.framework.model.entity;

import java.io.Serializable;

/**
 * 数据库列元数据（来自 information_schema）
 */
public class DbTableColumn implements Serializable {
    private static final long serialVersionUID = 42L;

    private String columnName;       /* 列名称 */
    private String columnComment;    /* 列注释 */
    private String columnType;       /* 列类型（如 varchar(50)、int） */
    private String isNullable;       /* 是否可为空（YES/NO） */
    private String columnKey;        /* 键类型（PRI主键、UNI唯一） */
    private String extra;            /* 额外信息（如 auto_increment） */
    private int ordinalPosition;     /* 列顺序 */

    public String getColumnName() { return columnName; }
    public void setColumnName(String columnName) { this.columnName = columnName; }
    public String getColumnComment() { return columnComment; }
    public void setColumnComment(String columnComment) { this.columnComment = columnComment; }
    public String getColumnType() { return columnType; }
    public void setColumnType(String columnType) { this.columnType = columnType; }
    public String getIsNullable() { return isNullable; }
    public void setIsNullable(String isNullable) { this.isNullable = isNullable; }
    public String getColumnKey() { return columnKey; }
    public void setColumnKey(String columnKey) { this.columnKey = columnKey; }
    public String getExtra() { return extra; }
    public void setExtra(String extra) { this.extra = extra; }
    public int getOrdinalPosition() { return ordinalPosition; }
    public void setOrdinalPosition(int ordinalPosition) { this.ordinalPosition = ordinalPosition; }
}
