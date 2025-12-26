package com.xxl.boot.admin.plugin.ai.constant.enums;

public enum SenderTypeEnum {

    MODEL(1, "Model"),
    USER(2, "用户");

    private int value;
    private String desc;

    SenderTypeEnum(int value, String desc) {
        this.value = value;
        this.desc = desc;
    }

    public int getValue() {
        return value;
    }

    public String getDesc() {
        return desc;
    }

    public static SenderTypeEnum getByValue(int value, SenderTypeEnum defaultValue) {
        for (SenderTypeEnum item : values()) {
            if (item.value == value) {
                return item;
            }
        }
        return defaultValue;
    }

}
