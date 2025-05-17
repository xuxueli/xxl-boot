package com.xxl.boot.admin.service.impl;

import com.xxl.boot.admin.constant.enums.UserStatuEnum;
import com.xxl.boot.admin.mapper.UserMapper;
import com.xxl.boot.admin.model.adaptor.XxlBootUserAdaptor;
import com.xxl.boot.admin.model.dto.LoginUserDTO;
import com.xxl.boot.admin.model.dto.XxlBootResourceDTO;
import com.xxl.boot.admin.model.entity.XxlBootUser;
import com.xxl.boot.admin.service.ResourceService;
import com.xxl.boot.admin.util.I18nUtil;
import com.xxl.tool.core.StringTool;
import com.xxl.tool.gson.GsonTool;
import com.xxl.tool.http.CookieTool;
import com.xxl.tool.response.Response;
import org.springframework.context.annotation.Configuration;
import org.springframework.util.DigestUtils;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.math.BigInteger;
import java.util.List;

/**
 * @author xuxueli 2019-05-04 22:13:264
 */
@Configuration
public class LoginService {

    public static final String LOGIN_IDENTITY_KEY = "XXL_BOOT_LOGIN_IDENTITY";

    @Resource
    private UserMapper xxlJobUserMapper;
    @Resource
    private ResourceService resourceService;

    // ********************** for token **********************

    /**
     * make token from user
     */
    private String makeToken(LoginUserDTO loginUserDTO){
        String tokenJson = GsonTool.toJson(loginUserDTO);
        String tokenHex = new BigInteger(tokenJson.getBytes()).toString(16);
        return tokenHex;
    }

    /**
     * parse token to user
     */
    private LoginUserDTO parseToken(String tokenHex){
        LoginUserDTO loginUser = null;
        if (tokenHex != null) {
            String tokenJson = new String(new BigInteger(tokenHex, 16).toByteArray());      // username_password(md5)
            loginUser = GsonTool.fromJson(tokenJson, LoginUserDTO.class);
        }
        return loginUser;
    }

    // ********************** for login **********************

    /**
     * login (write cookie)
     *
     * @param response
     * @param username
     * @param password
     * @param ifRemember
     * @return
     */
    public Response<String> login(HttpServletResponse response, String username, String password, boolean ifRemember){

        // param
        if (StringTool.isBlank(username) || StringTool.isBlank(password)){
            return Response.ofFail( I18nUtil.getString("login_param_empty") );
        }

        // valid user, empty、status、passowrd
        XxlBootUser xxlBootUser = xxlJobUserMapper.loadByUserName(username);
        if (xxlBootUser == null) {
            return Response.ofFail( I18nUtil.getString("login_param_unvalid") );
        }
        if (xxlBootUser.getStatus() != UserStatuEnum.NORMAL.getStatus()) {
            return Response.ofFail( I18nUtil.getString("login_status_invalid") );
        }
        String passwordMd5 = DigestUtils.md5DigestAsHex(password.getBytes());
        if (!passwordMd5.equals(xxlBootUser.getPassword())) {
            return Response.ofFail( I18nUtil.getString("login_param_unvalid") );
        }

        // find resource
        List<XxlBootResourceDTO> resourceList = this.queryAuthentication(xxlBootUser.getId());

        // make token
        LoginUserDTO loginUserDTO = XxlBootUserAdaptor.adapt2LoginUser(xxlBootUser, resourceList);
        String loginToken = makeToken(loginUserDTO);

        // do login
        CookieTool.set(response, LOGIN_IDENTITY_KEY, loginToken, ifRemember);
        return Response.ofSuccess();
    }

    /**
     * logout (remove cookie)
     *
     * @param request
     * @param response
     */
    public Response<String> logout(HttpServletRequest request, HttpServletResponse response){
        CookieTool.remove(request, response, LOGIN_IDENTITY_KEY);
        return Response.ofSuccess();
    }

    /**
     * check iflogin (match cookie and db, del cookie if invalid)
     *
     * @param request
     * @return
     */
    public LoginUserDTO checkLogin(HttpServletRequest request, HttpServletResponse response){
        String cookieToken = CookieTool.getValue(request, LOGIN_IDENTITY_KEY);
        if (cookieToken != null) {
            LoginUserDTO loginUser = null;
            try {
                loginUser = parseToken(cookieToken);
            } catch (Exception e) {
                logout(request, response);
            }
            if (loginUser != null) {
                XxlBootUser dbUser = xxlJobUserMapper.loadByUserName(loginUser.getUsername());
                if (dbUser != null) {
                    if (loginUser.getPassword().equals(dbUser.getPassword())) {
                        return loginUser;
                    }
                }
            }
        }
        return null;
    }


    // ********************** for LoginUser with request **********************

    /**
     * set login user
     *
     * @param request
     * @param loginUser
     */
    public static void setLoginUser(HttpServletRequest request, LoginUserDTO loginUser){
        request.setAttribute("_loginUser", loginUser);
    }

    /**
     * get login user (from request, copy from cookie)
     *
     * @param request
     * @return
     */
    public static LoginUserDTO getLoginUser(HttpServletRequest request){
        LoginUserDTO loginUser = (LoginUserDTO) request.getAttribute("_loginUser");
        return loginUser;
    }

    /**
     * query Authentication resource
     *
     * @param userId
     * @return
     */
    public List<XxlBootResourceDTO> queryAuthentication(int userId){
        // all resource
        //List<XxlBootResourceDTO> resourceList = resourceService.treeList(null, ResourceStatuEnum.NORMAL.getValue());
        // auth resource
        List<XxlBootResourceDTO> resourceList = resourceService.treeListByUserId(userId);
        return resourceList;
    }


}
