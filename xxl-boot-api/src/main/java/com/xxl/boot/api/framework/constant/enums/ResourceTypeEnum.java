package com.xxl.boot.api.framework.constant.enums;

import com.xxl.tool.core.EnumTool;

/**
 * 资源类型枚举
 *
 * @author xuxueli 2024-11-03
 */
public enum ResourceTypeEnum implements EnumTool.IEnum {

    CATALOG(0, "目录"),
    MENU(1, "菜单"),
    BUTTOM(2, "按钮");

    private int code;       /* 类型编码 */
    private String title;   /* 类型描述 */

    ResourceTypeEnum(int code, String title) {
        this.code = code;
        this.title = title;
    }

    public int getCode() {
        return code;
    }

    public String getTitle() {
        return title;
    }

}
