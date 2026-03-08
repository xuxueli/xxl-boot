package com.xxl.boot.admin.plugin.ai.constant.enums;

public enum KbChunkStatusEnum {

    UNPROCESSED(0, "未向量化"),
    PROCESSED(1, "已向量化");

    private final int value;
    private final String desc;

    KbChunkStatusEnum(int value, String desc) {
        this.value = value;
        this.desc = desc;
    }

    public int getValue() {
        return value;
    }

    public String getDesc() {
        return desc;
    }

    public static KbChunkStatusEnum getByValue(int value, KbChunkStatusEnum defaultValue) {
        for (KbChunkStatusEnum item : values()) {
            if (item.value == value) {
                return item;
            }
        }
        return defaultValue;
    }

}
