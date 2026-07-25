package com.xxl.boot.api.framework.model.dto;

/**
 * Captcha DTO
 *
 * @author xuxueli 2015-12-19
 */
public class CaptchaDTO {

    private String uuid;

    private String image;

    private boolean enable;

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public boolean isEnable() {
        return enable;
    }

    public void setEnable(boolean enable) {
        this.enable = enable;
    }
}
