package com.xxl.boot.api.framework.controller.base;

import com.xxl.boot.api.framework.model.dto.LoginRequest;
import com.xxl.tool.http.HttpTool;
import com.xxl.tool.http.http.HttpResponse;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import static org.junit.jupiter.api.Assertions.assertTrue;

public class LoginControllerTest {
    private static final Logger logger = LoggerFactory.getLogger(LoginControllerTest.class);

    private static final String API_SERVICE_URL = "http://localhost:8090";
    private static final String TEST_USER = "admin";
    private static final String TEST_PASS = "123456";
    private static final String TEST_TOKEN_KEY = "xxl_sso_token";
    private static final String TEST_TOKEN_VALUE = "eyJ1c2VySWQiOiIxIiwiZXhwaXJlVGltZSI6MCwic2lnbmF0dXJlIjoiOWE3ZGNmZjU3MmJiNDE2ZmIyMDNmYzkwZGU5ZmY5MzgifQ";

    @Test
    void login_test() {
        HttpResponse response = HttpTool.createPost(API_SERVICE_URL + "/auth/login")
                .request(new LoginRequest(TEST_USER, TEST_PASS))
                .execute();
        logger.info("Response: {}", response.response());
        assertTrue(response.isSuccess());
    }


    @Test
    void logout_test() {
        HttpResponse response = HttpTool.createPost(API_SERVICE_URL + "/auth/logout")
                .header(TEST_TOKEN_KEY, TEST_TOKEN_VALUE)
                .execute();
        logger.info("Response: {}", response.response());
        assertTrue(response.isSuccess());
    }

    @Test
    void logincheck_test() {
        HttpResponse response = HttpTool.createPost(API_SERVICE_URL + "/auth/logincheck")
                .header(TEST_TOKEN_KEY, TEST_TOKEN_VALUE)
                .execute();
        logger.info("Response: {}", response.response());
        assertTrue(response.isSuccess());
    }

}
