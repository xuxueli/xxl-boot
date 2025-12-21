package com.xxl.boot.admin.plugin.ai.constant.enums;

public enum SupplierTypeEnum {

    OLLAMA(1, "OLLAMA");

    private int value;
    private String desc;

    SupplierTypeEnum(int value, String desc) {
        this.value = value;
        this.desc = desc;
    }

    public int getValue() {
        return value;
    }

    public String getDesc() {
        return desc;
    }

    public static SupplierTypeEnum getByValue(int value, SupplierTypeEnum defaultValue) {
        for (SupplierTypeEnum item : values()) {
            if (item.value == value) {
                return item;
            }
        }
        return defaultValue;
    }

}
