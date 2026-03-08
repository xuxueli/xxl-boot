package com.xxl.boot.admin.plugin.ai.constant.enums;

public enum KbDucumentStatusEnum {

    INIT_UNPROCESSED(0, "初始化/待处理"),
    CHANGED_UNPROCESSED(1, "有变化/待处理"),
    PROCESSING(2, "处理中"),
    SUCCESS(3, "已向量化"),
    FAIL(4, "失败");

    public static final int PROCESSING_VALUE = 1;

    private final int value;
    private final String desc;

    KbDucumentStatusEnum(int value, String desc) {
        this.value = value;
        this.desc = desc;
    }

    public int getValue() {
        return value;
    }

    public String getDesc() {
        return desc;
    }

    public static KbDucumentStatusEnum getByValue(int value, KbDucumentStatusEnum defaultValue) {
        for (KbDucumentStatusEnum item : values()) {
            if (item.value == value) {
                return item;
            }
        }
        return defaultValue;
    }

}
