package com.xxl.boot.api.framework.model.dto.request;

import java.io.Serializable;

/**
 * 代码生成-建表请求
 *
 * @author xuxueli 2026-10-02
 */
public class CreateTableRequest implements Serializable {
    private static final long serialVersionUID = 42L;

    private String tableSql;        /* 建表SQL */
    private String tplWebType;      /* 前端模板类型 */


    public String getTableSql() {
        return tableSql;
    }

    public void setTableSql(String tableSql) {
        this.tableSql = tableSql;
    }

    public String getTplWebType() {
        return tplWebType;
    }

    public void setTplWebType(String tplWebType) {
        this.tplWebType = tplWebType;
    }

}
