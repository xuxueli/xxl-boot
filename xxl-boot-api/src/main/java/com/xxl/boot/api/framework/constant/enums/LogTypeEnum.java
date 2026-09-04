package com.xxl.boot.api.framework.constant.enums;

import com.xxl.tool.core.EnumTool;

/**
 * 日志类型枚举
 * 
 * @author xuxueli 2024-01-01
 */
public enum LogTypeEnum implements EnumTool.IEnum {

    OPT_LOG(0, "操作日志"),
    LOGIN_LOG(1, "登陆日志");

    private final int code;     /* 枚举编码 */
    private final String title; /* 枚举展示名称 */

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


    /**
     * 根据编码匹配枚举
     *
     * @param code 编码
     * @return 匹配的枚举，未匹配返回 null
     */
    public static LogTypeEnum match(int code) {
        for (LogTypeEnum logTypeEnum : LogTypeEnum.values()) {
            if (logTypeEnum.getCode() == code) {
                return logTypeEnum;
            }
        }
        return null;
    }

}
