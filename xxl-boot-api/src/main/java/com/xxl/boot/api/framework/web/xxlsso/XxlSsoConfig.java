package com.xxl.boot.api.framework.web.xxlsso;

import com.xxl.sso.core.auth.filter.XxlSsoNativeFilter;
import com.xxl.sso.core.bootstrap.XxlSsoBootstrap;
import jakarta.annotation.Resource;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * @author xuxueli 2018-11-15
 */
@Configuration
public class XxlSsoConfig implements WebMvcConfigurer {


    @Value("${xxl-sso.token.key}")
    private String tokenKey;

    @Value("${xxl-sso.token.timeout}")
    private long tokenTimeout;

    @Value("${xxl-sso.client.excluded.paths}")
    private String excludedPaths;


    @Resource
    private SimpleLoginStore simpleLoginStore;


    /**
     * 1、配置 XxlSsoBootstrap
     */
    @Bean(initMethod = "start", destroyMethod = "stop")
    public XxlSsoBootstrap xxlSsoBootstrap() {

        XxlSsoBootstrap bootstrap = new XxlSsoBootstrap();
        bootstrap.setLoginStore(simpleLoginStore);
        bootstrap.setTokenKey(tokenKey);
        bootstrap.setTokenTimeout(tokenTimeout);
        return bootstrap;
    }


    /**
     * 2、配置 XxlSso Filter
     *
     * @param bootstrap
     * @return
     */
    @Bean
    public FilterRegistrationBean<XxlSsoNativeFilter> xxlSsoFilterRegistration(XxlSsoBootstrap bootstrap) {

        // 2.1、build xxl-sso filter
        XxlSsoNativeFilter nativeFilter = new XxlSsoNativeFilter(excludedPaths);

        // 2.2、registry filter
        FilterRegistrationBean<XxlSsoNativeFilter> registration = new FilterRegistrationBean<>();
        registration.setName("XxlSsoNativeFilter");
        registration.setOrder(1);
        registration.addUrlPatterns("/*");
        registration.setFilter(nativeFilter);

        return registration;
    }


}
