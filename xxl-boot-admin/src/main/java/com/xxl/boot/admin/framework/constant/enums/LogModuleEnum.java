package com.xxl.boot.admin.framework.constant.enums;

public enum LogModuleEnum {

    // ---------------------- OPT_LOG ----------------------

    // 组织
    USER("用户管理"),
    ROLE("角色管理"),
    RESOURCE("资源管理"),
    ORGANIZATION("组织管理"),

    // 系统
    MESSAGE("消息管理"),
    DICT("字典管理"),
    CONFIG("参数管理"),

    // 工具
    CODE_GEN("代码生成"),
    PAGE_GEN("表单构建"),


    // ---------------------- LOGIN_LOG ----------------------

    LOGIN("系统登录"),
    LOGOUT("注销登录"),;

    private String code;
    private String desc;

    LogModuleEnum(String desc) {
        this.desc = desc;
    }

    public String getDesc() {
        return desc;
    }
    
}
