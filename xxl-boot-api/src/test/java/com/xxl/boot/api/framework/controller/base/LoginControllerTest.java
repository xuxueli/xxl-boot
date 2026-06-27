package com.xxl.boot.api.framework.controller.base;

import com.xxl.boot.api.framework.model.dto.LoginRequest;
import com.xxl.boot.api.framework.model.dto.LogoutRequest;
import com.xxl.boot.api.framework.model.dto.XxlBootUserDTO;
import com.xxl.boot.api.framework.model.entity.XxlBootUser;
import com.xxl.boot.api.framework.service.UserService;
import com.xxl.tool.response.Response;
import jakarta.annotation.Resource;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class LoginControllerTest {

    @LocalServerPort
    private int port;

    private RestTemplate restTemplate;

    @Resource
    private UserService userService;

    private static final String TEST_USER = "ut_login";
    private static final String TEST_PASS = "test1234";

    @BeforeEach
    void setUp() {
        restTemplate = new RestTemplate();
    }

    @BeforeEach
    @AfterEach
    void cleanupTestUser() {
        Response<XxlBootUser> userResp = userService.loadByUserName(TEST_USER);
        if (userResp.isSuccess()) {
            userService.delete(userResp.getData().getId());
        }
    }

    private String url(String path) {
        return "http://localhost:" + port + "/auth" + path;
    }

    private void createTestUser() {
        XxlBootUserDTO dto = new XxlBootUserDTO();
        dto.setUsername(TEST_USER);
        dto.setPassword(TEST_PASS);
        dto.setStatus(0);
        dto.setRealName("Test User");
        userService.insert(dto);
    }

    // ---- /auth/login ----

    @Test
    void login_nullBody_shouldReturnFail() {
        ResponseEntity<Map> resp = restTemplate.postForEntity(url("/login"), null, Map.class);
        assertEquals(500, resp.getBody().get("code"));
        assertEquals("username or password is invalid.", resp.getBody().get("msg"));
    }

    @Test
    void login_invalidUser_shouldReturnFail() {
        LoginRequest req = new LoginRequest("nonexistent_user_xyz", TEST_PASS);
        ResponseEntity<Map> resp = restTemplate.postForEntity(url("/login"), req, Map.class);
        assertEquals(500, resp.getBody().get("code"));
    }

    @Test
    void login_disabledUser_shouldReturnFail() {
        XxlBootUserDTO dto = new XxlBootUserDTO();
        dto.setUsername(TEST_USER);
        dto.setPassword(TEST_PASS);
        dto.setStatus(1);
        dto.setRealName("Disabled User");
        userService.insert(dto);

        LoginRequest req = new LoginRequest(TEST_USER, TEST_PASS);
        ResponseEntity<Map> resp = restTemplate.postForEntity(url("/login"), req, Map.class);
        assertEquals(500, resp.getBody().get("code"));
    }

    @Test
    void login_wrongPassword_shouldReturnFail() {
        createTestUser();

        LoginRequest req = new LoginRequest(TEST_USER, "wrongpass");
        ResponseEntity<Map> resp = restTemplate.postForEntity(url("/login"), req, Map.class);
        assertEquals(500, resp.getBody().get("code"));
    }

    @Test
    void login_validCredentials_shouldReturnToken() {
        createTestUser();

        LoginRequest req = new LoginRequest(TEST_USER, TEST_PASS);
        ResponseEntity<Map> resp = restTemplate.postForEntity(url("/login"), req, Map.class);
        assertEquals(200, resp.getBody().get("code"));
        assertNotNull(resp.getBody().get("data"));
        assertTrue(((String) resp.getBody().get("data")).length() > 0);
    }

    // ---- /auth/logout ----

    @Test
    void logout_nullBody_shouldReturnFail() {
        ResponseEntity<Map> resp = restTemplate.postForEntity(url("/logout"), null, Map.class);
        assertEquals(500, resp.getBody().get("code"));
        assertEquals("token is invalid.", resp.getBody().get("msg"));
    }

    @Test
    void logout_invalidToken_shouldReturnSuccess() {
        LogoutRequest req = new LogoutRequest("some_invalid_token");
        ResponseEntity<Map> resp = restTemplate.postForEntity(url("/logout"), req, Map.class);
        assertEquals(200, resp.getBody().get("code"));
    }

    @Test
    void logout_afterLogin_shouldSucceed() {
        createTestUser();

        // login
        LoginRequest loginReq = new LoginRequest(TEST_USER, TEST_PASS);
        ResponseEntity<Map> loginResp = restTemplate.postForEntity(url("/login"), loginReq, Map.class);
        assertEquals(200, loginResp.getBody().get("code"));
        String token = (String) loginResp.getBody().get("data");

        // logout with real token
        LogoutRequest logoutReq = new LogoutRequest(token);
        ResponseEntity<Map> logoutResp = restTemplate.postForEntity(url("/logout"), logoutReq, Map.class);
        assertEquals(200, logoutResp.getBody().get("code"));
    }

}
