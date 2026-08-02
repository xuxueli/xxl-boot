package com.xxl.boot.admin.framework.constant.enums;

import com.xxl.boot.admin.framework.util.EnumTool;

/**
 * 消息状态枚举
 *
 * @author xuxueli 2024-11-03
 */
public enum MessageStatusEnum implements EnumTool.IEnum {

    NORMAL(0, "正常"),
    INACTIVE(1, "下线");

    private int code;       /* 状态编码 */
    private String title;   /* 状态描述 */

    MessageStatusEnum(int code, String title) {
        this.code = code;
        this.title = title;
    }

    public int getCode() {
        return code;
    }

    public String getTitle() {
        return title;
    }

}
