package com.xxl.boot.admin.framework.model.dto.request;

import java.io.Serializable;

/**
 * 代码生成请求
 *
 * @author xuxueli 2026-10-02
 */
public class GenCodeRequest implements Serializable {
    private static final long serialVersionUID = 42L;

    private String tableSql;        /* 建表SQL */
    private String author;          /* 作者 */
    private String packagePath;     /* Package路径 */
    private String businessName;    /* 业务名称 */


    public String getTableSql() {
        return tableSql;
    }

    public void setTableSql(String tableSql) {
        this.tableSql = tableSql;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getPackagePath() {
        return packagePath;
    }

    public void setPackagePath(String packagePath) {
        this.packagePath = packagePath;
    }

    public String getBusinessName() {
        return businessName;
    }

    public void setBusinessName(String businessName) {
        this.businessName = businessName;
    }

}
