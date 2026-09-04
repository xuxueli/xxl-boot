package com.xxl.boot.admin.framework.constant.enums;

import com.xxl.tool.core.EnumTool;

/**
 * 配置状态枚举
 *
 * @author xuxueli 2024-11-03
 */
public enum ConfigStatusEnum implements EnumTool.IEnum {

    NORMAL(0, "正常"),
    DISABLED(1, "停用");

    private int code;       /* 状态编码 */
    private String title;   /* 状态描述 */

    ConfigStatusEnum(int code, String title) {
        this.code = code;
        this.title = title;
    }

    @Override
    public int getCode() {
        return code;
    }

    @Override
    public String getTitle() {
        return title;
    }

}
