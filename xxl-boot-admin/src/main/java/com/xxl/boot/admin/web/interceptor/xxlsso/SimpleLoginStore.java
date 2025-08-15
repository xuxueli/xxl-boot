package com.xxl.boot.admin.web.interceptor.xxlsso;

import com.xxl.boot.admin.model.adaptor.XxlBootUserAdaptor;
import com.xxl.boot.admin.model.dto.XxlBootResourceDTO;
import com.xxl.boot.admin.model.entity.XxlBootUser;
import com.xxl.boot.admin.service.ResourceService;
import com.xxl.boot.admin.service.UserService;
import com.xxl.sso.core.model.LoginInfo;
import com.xxl.sso.core.store.LoginStore;
import com.xxl.sso.core.token.TokenHelper;
import com.xxl.tool.encrypt.Md5Tool;
import com.xxl.tool.response.Response;
import org.springframework.stereotype.Component;

import jakarta.annotation.Resource;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

/**
 * Simple LoginStore
 *
 * 1、store by database；
 * 2、If you have higher performance requirements, it is recommended to use RedisLoginStore；
 *
 * @author xuxueli 2025-08-03
 */
@Component
public class SimpleLoginStore implements LoginStore {


    @Resource
    private ResourceService resourceService;
    @Resource
    private UserService userService;


    @Override
    public Response<String> set(LoginInfo loginInfo) {

        // build token
        Response<String> tokenResponse = TokenHelper.generateToken(loginInfo);
        if (!tokenResponse.isSuccess()) {
            return Response.ofFail("generate token fail");
        }
        String token = tokenResponse.getData();

        // write token by UserId
        return userService.updateToken(Integer.valueOf(loginInfo.getUserId()), token);
    }

    @Override
    public Response<String> update(LoginInfo loginInfo) {
        return Response.ofFail("not support");
    }

    @Override
    public Response<String> remove(String userId) {
        // delete token by UserId
        return userService.updateToken(Integer.valueOf(userId), "");
    }

    /**
     * check through DB query
     */
    @Override
    public Response<LoginInfo> get(String userId) {

        // load user by UserId
        Response<XxlBootUser> xxlBootUser = userService.loadByUserId(Integer.valueOf(userId));
        if (!xxlBootUser.isSuccess()) {
            return Response.ofFail("userId invalid.");
        }

        // parse token of UserId
        LoginInfo loginInfo = TokenHelper.parseToken(xxlBootUser.getData().getToken());
        if (loginInfo==null) {
            return Response.ofFail("token invalid.");
        }

        // find permission
        List<XxlBootResourceDTO> resourceList = resourceService.treeListByUserId(Integer.valueOf(userId));
        Set<String> permissions = XxlBootUserAdaptor.extractPermissions(resourceList);

        // fill data of loginInfo
        loginInfo.setUserName(xxlBootUser.getData().getUsername());
        loginInfo.setRealName(xxlBootUser.getData().getRealName());
        loginInfo.setPermissionList(new ArrayList<>(permissions));

        return Response.ofSuccess(loginInfo);
    }

}
