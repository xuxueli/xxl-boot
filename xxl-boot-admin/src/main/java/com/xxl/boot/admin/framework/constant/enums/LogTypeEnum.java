package com.xxl.boot.admin.framework.constant.enums;

public enum LogTypeEnum {

    OPT_LOG(0, "操作日志"),
    LOGIN_LOG(1, "登陆日志");

    private int code;
    private String desc;

    LogTypeEnum(int code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    public int getCode() {
        return code;
    }

    public String getDesc() {
        return desc;
    }

}
