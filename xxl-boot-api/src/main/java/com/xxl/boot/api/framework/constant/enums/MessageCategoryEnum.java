package com.xxl.boot.api.framework.constant.enums;

public enum MessageCategoryEnum {

    NOTIFICATION(0, "通知"),
    NEWS(1, "新闻");

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
