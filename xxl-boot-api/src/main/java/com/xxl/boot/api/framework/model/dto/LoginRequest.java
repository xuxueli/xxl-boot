package com.xxl.boot.api.framework.model.dto;

/**
 * @author xuxueli 2018-03-22 23:51:51
 */
public class LoginRequest {

    /**
     * username
     */
    private String username;

    /**
     * password
     */
    private String password;

    /**
     * captcha uuid
     */
    private String captchaUuid;

    /**
     * captcha result
     */
    private String captchaResult;

    public LoginRequest() {
    }
    public LoginRequest(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getCaptchaUuid() {
        return captchaUuid;
    }

    public void setCaptchaUuid(String captchaUuid) {
        this.captchaUuid = captchaUuid;
    }

    public String getCaptchaResult() {
        return captchaResult;
    }

    public void setCaptchaResult(String captchaResult) {
        this.captchaResult = captchaResult;
    }

}
