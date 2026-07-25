package com.xxl.boot.api.framework.model.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.List;

/**
*  路由配置信息
*
*  前端 routes.js 直接消费。
*
*  Created by xuxueli on '2026-07-25'.
*/
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class RouterVo {

    /**
    * 路由名字
    */
    private String name;

    /**
    * 路由地址
    */
    private String path;

    /**
    * 是否隐藏路由
    */
    private boolean hidden;

    /**
    * 组件地址
    */
    private String component;

    /**
    * 其他元素
    */
    private MetaVo meta;

    /**
    * 子路由
    */
    private List<RouterVo> children;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public boolean getHidden() {
        return hidden;
    }

    public void setHidden(boolean hidden) {
        this.hidden = hidden;
    }

    public String getComponent() {
        return component;
    }

    public void setComponent(String component) {
        this.component = component;
    }

    public MetaVo getMeta() {
        return meta;
    }

    public void setMeta(MetaVo meta) {
        this.meta = meta;
    }

    public List<RouterVo> getChildren() {
        return children;
    }

    public void setChildren(List<RouterVo> children) {
        this.children = children;
    }

}
