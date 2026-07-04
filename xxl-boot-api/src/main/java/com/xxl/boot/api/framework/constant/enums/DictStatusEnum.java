package com.xxl.boot.api.framework.constant.enums;

public enum DictStatusEnum {

    NORMAL(0, "正常"),
    DISABLED(1, "停用");

    private int value;
    private String desc;

    DictStatusEnum(int value, String desc) {
        this.value = value;
        this.desc = desc;
    }

    public int getValue() {
        return value;
    }

    public void setValue(int value) {
        this.value = value;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

}
