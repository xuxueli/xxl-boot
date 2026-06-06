package com.xxl.boot.admin.framework.annotation;


import com.xxl.boot.admin.framework.constant.enums.LogModuleEnum;
import com.xxl.boot.admin.framework.constant.enums.LogTypeEnum;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * permission annotation
 *
 * <pre>
 * 		@Log(type=xx)
 * </pre>
 *
 * @author xuxueli 2015-12-12 18:29:02
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface Log {

	LogTypeEnum type();

	LogModuleEnum module();

	String title() ;

	String content() default "";

}