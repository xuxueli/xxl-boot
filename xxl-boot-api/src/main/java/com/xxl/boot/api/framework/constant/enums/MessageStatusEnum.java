package com.xxl.boot.api.framework.constant.enums;

/**
 * message status
 * @author xuxueli
 */
public enum MessageStatusEnum {

    NORMAL(0, "正常"),
    INACTIVE(1, "下线");

    private int value;
    private String desc;

    MessageStatusEnum(int value, String desc) {
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
