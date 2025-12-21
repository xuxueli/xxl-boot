package com.xxl.boot.admin.plugin.ai.constant.enums;

public enum AgentTypeEnum {

    CHAT(1, "ChatAgent");

    private int value;
    private String desc;

    AgentTypeEnum(int value, String desc) {
        this.value = value;
        this.desc = desc;
    }

    public int getValue() {
        return value;
    }

    public String getDesc() {
        return desc;
    }

    public static AgentTypeEnum getByValue(int value, AgentTypeEnum defaultValue) {
        for (AgentTypeEnum item : values()) {
            if (item.value == value) {
                return item;
            }
        }
        return defaultValue;
    }

}
