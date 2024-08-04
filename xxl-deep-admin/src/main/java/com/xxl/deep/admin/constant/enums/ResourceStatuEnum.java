package com.xxl.deep.admin.constant.enums;

/**
 * user status
 * @author xuxueli
 */
public enum ResourceStatuEnum {

    NORMAL(0, "正常"),
    INACTIVE(1, "停用");

    private int value;
    private String desc;

    ResourceStatuEnum(int value, String desc) {
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
