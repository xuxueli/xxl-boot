package com.xxl.boot.admin.web.interceptor.xxlsso;

import com.xxl.boot.admin.model.adaptor.XxlBootUserAdaptor;
import com.xxl.boot.admin.model.dto.XxlBootResourceDTO;
import com.xxl.boot.admin.model.entity.XxlBootUser;
import com.xxl.boot.admin.service.ResourceService;
import com.xxl.boot.admin.service.UserService;
import com.xxl.sso.core.model.LoginInfo;
import com.xxl.sso.core.store.LoginStore;
import com.xxl.tool.encrypt.Md5Tool;
import com.xxl.tool.response.Response;
import org.springframework.stereotype.Component;

import jakarta.annotation.Resource;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

/**
 * Query LoginStore (not store, query through db)
 *
 * @author xuxueli 2025-08-03
 */
@Component
public class QueryLoginStore implements LoginStore {

    @Resource
    private ResourceService resourceService;
    @Resource
    private UserService userService;

    @Override
    public Response<String> set(LoginInfo loginInfo) {
        // not store, query through db
        return Response.ofSuccess();
    }

    @Override
    public Response<String> update(LoginInfo loginInfo) {
        // not store, query through db
        return Response.ofSuccess();
    }

    @Override
    public Response<String> remove(String userId) {
        // not store, query through db
        return Response.ofSuccess();
    }

    /**
     * check through DB query
     */
    @Override
    public Response<LoginInfo> get(String userId) {
        // load login user
        Response<XxlBootUser> xxlBootUser = userService.loadByUserId(Integer.valueOf(userId));
        if (!xxlBootUser.isSuccess()) {
            return Response.ofFail("userId invalid.");
        }
        String signature = Md5Tool.md5(xxlBootUser.getData().getPassword() +"_"+ xxlBootUser.getData().getUpdateTime().getTime());

        // find resource
        List<XxlBootResourceDTO> resourceList = resourceService.treeListByUserId(Integer.valueOf(userId));
        Set<String> permissions = XxlBootUserAdaptor.extractPermissions(resourceList);

        // build login info
        LoginInfo loginInfo = new LoginInfo();
        loginInfo.setUserId(userId);
        loginInfo.setUserName(xxlBootUser.getData().getUsername());
        loginInfo.setRealName(xxlBootUser.getData().getRealName());
        loginInfo.setPermissionList(new ArrayList<>(permissions));
        loginInfo.setSignature(signature);

        return Response.ofSuccess(loginInfo);
    }

}
