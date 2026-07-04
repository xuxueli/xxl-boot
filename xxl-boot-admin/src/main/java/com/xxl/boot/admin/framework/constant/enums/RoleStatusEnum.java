package com.xxl.boot.admin.framework.constant.enums;

public enum RoleStatusEnum {

    NORMAL(0, "正常"),
    INACTIVE(1, "停用");

    private int status;
    private String desc;

    RoleStatusEnum(int status, String desc) {
        this.status = status;
        this.desc = desc;
    }
    public int getStatus() {
        return status;
    }
    public void setStatus(int status) {
        this.status = status;
    }
    public String getDesc() {
        return desc;
    }
    public void setDesc(String desc) {
        this.desc = desc;
    }

}
