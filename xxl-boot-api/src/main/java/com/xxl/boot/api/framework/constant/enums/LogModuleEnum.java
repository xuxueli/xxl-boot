package com.xxl.boot.api.framework.constant.enums;

import com.xxl.tool.core.EnumTool;

/**
 * 系统模块枚举
 * 
 * @author xuxueli 2024-01-01
 */
public enum LogModuleEnum implements EnumTool.IEnum {

    // ---------------------- OPT_LOG ----------------------

    // 组织
    USER(1001,"用户管理"),
    ROLE(1002,"角色管理"),
    RESOURCE(1003,"资源管理"),
    ORGANIZATION(1004,"组织管理"),

    // 系统
    MESSAGE(1101,"消息管理"),
    DICT(1102,"字典管理"),
    CONFIG(1103,"配置管理"),

    // 工具
    CODE_GEN(1201,"代码生成"),
    PAGE_GEN(1202,"表单构建"),


    // ---------------------- LOGIN_LOG ----------------------

    LOGIN(1301,"系统登录"),
    LOGOUT(1302,"注销登录");

    private int code;       /* 枚举编码 */
    private String title;   /* 枚举展示名称 */

    LogModuleEnum(int code, String title) {
        this.code = code;
        this.title = title;
    }

    @Override
    public int getCode() {
        return code;
    }

    @Override
    public String getTitle() {
        return title;
    }


    /**
     * 根据编码匹配枚举
     *
     * @param code 编码
     * @return 匹配的枚举，未匹配返回 null
     */
    public static LogModuleEnum match(int code) {
        for (LogModuleEnum logModuleEnum : LogModuleEnum.values()) {
            if (logModuleEnum.getCode() == code) {
                return logModuleEnum;
            }
        }
        return null;
    }

}
