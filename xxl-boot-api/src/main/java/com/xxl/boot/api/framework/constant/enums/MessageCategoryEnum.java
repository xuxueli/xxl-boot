package com.xxl.boot.api.framework.constant.enums;

import com.xxl.boot.api.framework.util.EnumTool;

/**
 * 消息分类枚举
 *
 * @author xuxueli 2024-11-03
 */
public enum MessageCategoryEnum implements EnumTool.IEnum {

    NOTICE(0, "通知"),
    ANNOUNCEMENT(1, "公告");

    private int value;      /* 分类编码 */
    private String desc;    /* 分类描述 */

    MessageCategoryEnum(int value, String desc) {
        this.value = value;
        this.desc = desc;
    }

    public int getValue() {
        return value;
    }

    public String getDesc() {
        return desc;
    }

    @Override
    public int getCode() {
        return value;
    }

    @Override
    public String getTitle() {
        return desc;
    }

}
