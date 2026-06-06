package com.xxl.boot.admin.framework.constant.enums;

/**
 * user type
 * @author xuxueli
 */
public enum ResourceTypeEnum {

    CATALOG(0, "目录"),
    MENU(1, "菜单"),
    BUTTOM(2, "按钮");

    private int value;
    private String desc;

    ResourceTypeEnum(int value, String desc) {
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
