package com.xxl.boot.api.framework.constant.enums;

/**
 * 配置状态枚举
 *
 * @author xuxueli 2024-11-03
 */
public enum ConfigStatusEnum {

    NORMAL(0, "正常"),
    DISABLED(1, "停用");

    private int value;      /* 状态编码 */
    private String desc;    /* 状态描述 */

    ConfigStatusEnum(int value, String desc) {
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
