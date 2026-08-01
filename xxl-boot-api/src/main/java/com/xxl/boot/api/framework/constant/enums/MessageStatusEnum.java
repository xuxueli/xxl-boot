package com.xxl.boot.api.framework.constant.enums;

/**
 * 消息状态枚举
 *
 * @author xuxueli 2024-11-03
 */
public enum MessageStatusEnum {

    NORMAL(0, "正常"),
    INACTIVE(1, "下线");

    private int value;      /* 状态编码 */
    private String desc;    /* 状态描述 */

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
