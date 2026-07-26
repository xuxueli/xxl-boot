package com.xxl.boot.admin.framework.util;

import com.xxl.tool.core.CollectionTool;
import com.xxl.tool.core.StringTool;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;

/**
 * 名称：EnumTool
 * 功能：通用枚举工具类，将枚举转换为前端可用格式
 */
public class EnumTool {
    private static final Logger logger = LoggerFactory.getLogger(EnumTool.class);

    /**
     * 根据枚举名查询枚举项列表
     *
     * @param packageList 枚举包名列表
     * @param enumName    枚举类名
     */
    public static List<EnumItemVO> getEnumItemList(List<String> packageList, String enumName) {
        if (CollectionTool.isEmpty(packageList) || StringTool.isBlank(enumName)) {
            return new ArrayList<>();
        }
        for (String packageName : packageList) {
            String enumClass = packageName + "." + enumName;
            List<EnumItemVO> list = getEnumItemList(enumClass);
            if (CollectionTool.isNotEmpty(list)) {
                return list;
            }
        }
        return new ArrayList<>();
    }

    /**
     * 根据枚举 Class 路径查询枚举项列表
     */
    public static List<EnumItemVO> getEnumItemList(String enumClass) {
        if (StringTool.isBlank(enumClass)) {
            return new ArrayList<>();
        }
        try {
            Class<?> clazz = Class.forName(enumClass);
            if (clazz.isEnum() && IEnum.class.isAssignableFrom(clazz)) {
                List<EnumItemVO> list = new ArrayList<>();
                for (IEnum e : ((Class<? extends IEnum>) clazz).getEnumConstants()) {
                    list.add(new EnumItemVO(e.getCode(), e.getTitle()));
                }
                return list;
            }
        } catch (ClassNotFoundException ignored) {
            logger.debug("EnumTool.getEnumItemList error, enumClass invalid:{}", enumClass, ignored);
        }
        return new ArrayList<>();
    }

    /**
     * 通用枚举项
     */
    public static class EnumItemVO {

        private int code;     /* 枚举编码 */
        private String title; /* 枚举展示名称 */
        private String desc;  /* 枚举详细说明（可选） */

        public EnumItemVO() {}

        public EnumItemVO(int code, String title) {
            this.code = code;
            this.title = title;
        }

        public EnumItemVO(int code, String title, String desc) {
            this.code = code;
            this.title = title;
            this.desc = desc;
        }

        public int getCode()               { return code; }
        public void setCode(int code)      { this.code = code; }

        public String getTitle()           { return title; }
        public void setTitle(String title) { this.title = title; }

        public String getDesc()            { return desc; }
        public void setDesc(String desc)   { this.desc = desc; }
    }

    /**
     * 通用枚举接口
     */
    public interface IEnum {

        int getCode();        /* 枚举编码 */
        String getTitle();    /* 枚举展示名称 */

        default String getDesc() { return null; }
    }
}
