package com.xxl.boot.api.framework.model.dto;

/**
 * 系统基础配置 DTO
 *
 * @author xuxueli 2026-10-02
 */
public class BaseConfigDTO {

    private String language;        /* 界面语言：zh/en */
    private boolean captchaEnabled; /* 登录验证码开关 */

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public boolean isCaptchaEnabled() {
        return captchaEnabled;
    }

    public void setCaptchaEnabled(boolean captchaEnabled) {
        this.captchaEnabled = captchaEnabled;
    }

}
