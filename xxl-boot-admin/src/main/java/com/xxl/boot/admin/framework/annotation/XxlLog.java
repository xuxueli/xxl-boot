package com.xxl.boot.admin.framework.annotation;


import com.xxl.boot.admin.framework.constant.enums.LogModuleEnum;
import com.xxl.boot.admin.framework.constant.enums.LogTypeEnum;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 系统日志注解，标记需要记录操作日志的方法】
 * <pre>
 * 		@Log(type=xx)
 * </pre>
 *
 * @author xuxueli 2015-12-12 18:29:02
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface XxlLog {

    LogTypeEnum type();     /* 日志类型 */

    LogModuleEnum module(); /* 系统模块 */

    String title();         /* 日志标题 */

    String content() default ""; /* 日志内容，为空则自动拼接请求/响应信息 */

}