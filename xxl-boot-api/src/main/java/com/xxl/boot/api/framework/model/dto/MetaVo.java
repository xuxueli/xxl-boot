package com.xxl.boot.api.framework.model.dto;

/**
*  路由显示信息
*
*  Created by xuxueli on '2026-07-25'.
*/
public class MetaVo {

    /**
    * 设置该路由在侧边栏和面包屑中展示的名字
    */
    private String title;

    /**
    * 设置该路由的图标
    */
    private String icon;

    public MetaVo() {
    }

    public MetaVo(String title, String icon) {
        this.title = title;
        this.icon = icon;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

}
