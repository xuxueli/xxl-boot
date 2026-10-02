package com.xxl.boot.api.framework.model.dto;

/**
 * Captcha DTO
 *
 * @author xuxueli 2015-12-19
 */
public class CaptchaDTO {

    private String uuid;    /* 验证码标识 */

    private String image;   /* 验证码图片 Base64 */

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
}
