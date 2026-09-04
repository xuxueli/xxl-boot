package com.xxl.boot.api.framework.constant.enums;

import com.xxl.tool.core.EnumTool;

/**
 * 角色状态枚举
 *
 * @author xuxueli 2024-11-03
 */
public enum RoleStatusEnum implements EnumTool.IEnum {

    NORMAL(0, "正常"),
    INACTIVE(1, "停用");

    private int code;       /* 状态编码 */
    private String title;   /* 状态描述 */

    RoleStatusEnum(int code, String title) {
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
