package com.xxl.boot.api.framework.model.dto;

/**
 * 登录请求 DTO
 * 
 * @author xuxueli 2024-01-01
 */
public class LoginRequest {

    private String username;        /* 用户名 */
    private String password;        /* 密码 */
    private String captchaUuid;     /* 验证码 UUID */
    private String captchaResult;   /* 验证码结果 */

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
