package com.xxl.boot.api.framework.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * 通用配置：文件上传路径与静态资源映射
 *
 * 配置项：spring.servlet.file.profile 上传存储根路径，spring.servlet.file.resource-prefix 上传文件访问前缀。
 */
@Configuration
public class ResourcesConfig implements WebMvcConfigurer {

    private static String profile;          /* 上传文件存储根路径（相对应用运行目录，上传文件落盘目录） */
    private static String resourcePrefix;   /* 上传文件访问前缀（URL 访问前缀，上传文件通过该前缀对外访问；需同步加入 xxl-sso 放行路径） */

    public static String getProfile() {
        return profile;
    }

    @Value("${spring.servlet.file.profile}")
    public void setProfile(String profile) {
        ResourcesConfig.profile = profile;
    }

    /**
     * 获取访问前缀
     */
    public static String getResourcePrefix() {
        return resourcePrefix;
    }

    @Value("${spring.servlet.file.resource-prefix}")
    public void setResourcePrefix(String resourcePrefix) {
        ResourcesConfig.resourcePrefix = resourcePrefix;
    }

    /**
     * 获取上传路径
     */
    public static String getUploadPath() {
        return getProfile();
    }

    /**
     * 本地文件上传路径映射：{resourcePrefix}/** -> file:{profile}/
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler(getResourcePrefix() + "/**")
                .addResourceLocations("file:" + getProfile() + "/");
    }

}
