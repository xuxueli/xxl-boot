package com.xxl.boot.api.framework.constant.enums;

public enum LogModuleEnum {

    // 组织
    USER_MANAGE("用户管理"),
    ROLE_MANAGE("角色管理"),
    RES_MANAGE("资源日志"),
    ORG_MANAGE("组织管理"),
    CODE_GEN("代码生成"),

    // 系统工具
    SYS_LOGIN("系统登陆"),

    // 登陆
    LOGIN("登陆注销");

    private String code;
    private String desc;

    LogModuleEnum(String desc) {
        this.desc = desc;
    }

    public String getDesc() {
        return desc;
    }
    
}
