package com.xxl.boot.admin.framework.constant.enums;

import com.xxl.tool.core.EnumTool;

/**
 * 消息分类枚举
 *
 * @author xuxueli 2024-11-03
 */
public enum MessageCategoryEnum implements EnumTool.IEnum {

    NOTICE(0, "通知"),
    ANNOUNCEMENT(1, "公告");

    private int code;       /* 分类编码 */
    private String title;   /* 分类描述 */

    MessageCategoryEnum(int code, String title) {
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
