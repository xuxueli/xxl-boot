package com.xxl.boot.api.framework.constant.enums;

/**
 * resource visible status
 * @author xuxueli
 */
public enum ResourceVisibleEnum {

    SHOW(0, "显示"),
    HIDE(1, "隐藏");

    private int value;
    private String desc;

    ResourceVisibleEnum(int value, String desc) {
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
