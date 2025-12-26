package com.xxl.boot.admin.plugin.ai.constant.enums;

public enum ModelTypeEnum {

    // Model类型：1-基础模型，1-文本模型，2-视觉模型
    CHAT(1, "基础模型");

    private final int value;
    private final String desc;

    ModelTypeEnum(int value, String desc) {
        this.value = value;
        this.desc = desc;
    }

    public int getValue() {
        return value;
    }

    public String getDesc() {
        return desc;
    }

    public static ModelTypeEnum getByValue(int value, ModelTypeEnum defaultValue) {
        for (ModelTypeEnum item : values()) {
            if (item.value == value) {
                return item;
            }
        }
        return defaultValue;
    }

}
