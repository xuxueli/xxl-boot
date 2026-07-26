package com.xxl.boot.api.framework.annotation;


import com.xxl.boot.api.framework.constant.enums.LogModuleEnum;
import com.xxl.boot.api.framework.constant.enums.LogTypeEnum;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 操作日志注解
 * 
 * @author xuxueli 2024-01-01
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface XxlLog {

    LogTypeEnum type();             /* 日志类型 */
    LogModuleEnum module();         /* 系统模块 */
    String title();                 /* 日志标题 */
    String content() default "";    /* 日志内容 */

}