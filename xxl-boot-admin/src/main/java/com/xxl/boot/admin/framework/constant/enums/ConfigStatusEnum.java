package com.xxl.boot.admin.framework.constant.enums;

public enum ConfigStatusEnum {

    NORMAL(0, "正常"),
    DISABLED(1, "停用");

    private int value;
    private String desc;

    ConfigStatusEnum(int value, String desc) {
        this.value = value;
        this.desc = desc;
    }

    public int getValue() {
        return value;
    }

    public String getDesc() {
        return desc;
    }

}
