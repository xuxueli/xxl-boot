package com.xxl.boot.admin.framework.constant.enums;

import com.xxl.boot.admin.framework.util.EnumTool;

/**
 * 日志类型枚举，定义日志的分类（操作日志/登录日志）
 *
 * @author xuxueli 2024-01-01
 */
public enum LogTypeEnum implements EnumTool.IEnum {

    OPT_LOG(0, "操作日志"),   /* 操作日志 */
    LOGIN_LOG(1, "登陆日志"); /* 登陆日志 */

    private int code;      /* 枚举编码 */
    private String title;  /* 枚举展示名称 */

    LogTypeEnum(int code, String title) {
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
}
