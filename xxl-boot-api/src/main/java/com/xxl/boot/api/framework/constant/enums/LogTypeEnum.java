package com.xxl.boot.api.framework.constant.enums;

import com.xxl.boot.api.framework.util.EnumTool;

public enum LogTypeEnum implements EnumTool.IEnum {

    OPT_LOG(0, "操作日志"),
    LOGIN_LOG(1, "登陆日志");

    /**
     * 枚举编码
     */
    private final int code;

    /**
     * 枚举展示名称
     */
    private final String title;

    LogTypeEnum(int code, String title) {
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
