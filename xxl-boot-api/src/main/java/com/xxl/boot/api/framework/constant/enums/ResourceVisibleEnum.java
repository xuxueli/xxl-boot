package com.xxl.boot.api.framework.constant.enums;

import com.xxl.tool.core.EnumTool;

/**
 * 资源显示状态枚举
 *
 * @author xuxueli 2024-11-03
 */
public enum ResourceVisibleEnum implements EnumTool.IEnum {

    SHOW(0, "显示"),
    HIDE(1, "隐藏");

    private int code;       /* 状态编码 */
    private String title;   /* 状态描述 */

    ResourceVisibleEnum(int code, String title) {
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
