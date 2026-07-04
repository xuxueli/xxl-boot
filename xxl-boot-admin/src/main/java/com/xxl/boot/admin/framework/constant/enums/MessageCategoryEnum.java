package com.xxl.boot.admin.framework.constant.enums;

public enum MessageCategoryEnum {

    NOTICE(0, "通知"),
    ANNOUNCEMENT(1, "公告");

    private int value;
    private String desc;

    MessageCategoryEnum(int value, String desc) {
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
