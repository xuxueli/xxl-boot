package com.xxl.boot.api.framework.model.entity;

import java.io.Serializable;
import java.util.Date;

/**
 * 数据库表元数据（来自 information_schema）
 */
public class DbTable implements Serializable {
    private static final long serialVersionUID = 42L;

    private String tableName;    /* 表名称 */
    private String tableComment; /* 表注释 */
    private Date createTime;     /* 创建时间 */

    public String getTableName() { return tableName; }
    public void setTableName(String tableName) { this.tableName = tableName; }
    public String getTableComment() { return tableComment; }
    public void setTableComment(String tableComment) { this.tableComment = tableComment; }
    public Date getCreateTime() { return createTime; }
    public void setCreateTime(Date createTime) { this.createTime = createTime; }
}
