package com.xxl.boot.admin.framework.web.xxlsso;

import com.xxl.boot.admin.framework.model.adaptor.UserAdaptor;
import com.xxl.boot.admin.framework.model.dto.ResourceDTO;
import com.xxl.boot.admin.framework.model.entity.Role;
import com.xxl.boot.admin.framework.model.entity.User;
import com.xxl.boot.admin.framework.service.ResourceService;
import com.xxl.boot.admin.framework.service.RoleService;
import com.xxl.boot.admin.framework.service.UserService;
import com.xxl.sso.core.model.LoginInfo;
import com.xxl.sso.core.store.LoginStore;
import com.xxl.tool.core.CollectionTool;
import com.xxl.tool.response.Response;
import org.springframework.stereotype.Component;

import jakarta.annotation.Resource;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Simple LoginStore
 *
 * 1、store by database；
 * 2、If you have higher performance requirements, it is recommended to use RedisLoginStore；
 *
 * @author xuxueli 2025-08-03
 */
@Component
public class DBLoginStore implements LoginStore {


    @Resource
    private ResourceService resourceService;
    @Resource
    private UserService userService;
    @Resource
    private RoleService roleService;


    @Override
    public Response<String> set(LoginInfo loginInfo) {

        // parse token-signature
        String token_sign = loginInfo.getSignature();

        // write token by UserId
        return userService.updateToken(Integer.valueOf(loginInfo.getUserId()), token_sign);
    }

    @Override
    public Response<String> update(LoginInfo loginInfo) {
        return Response.ofFail("not support");
    }

    @Override
    public Response<String> remove(String userId) {
        // delete token-signature
        return userService.updateToken(Integer.valueOf(userId), "");
    }

    /**
     * check through DB query
     */
    @Override
    public Response<LoginInfo> get(String userId) {

        // load login-user
        int userIdInt = Integer.parseInt(userId);
        Response<User> userResponse = userService.loadByUserId(userIdInt);
        if (!userResponse.isSuccess()) {
            return Response.ofFail("userId invalid.");
        }

        // find permission
        List<ResourceDTO> resourceList = resourceService.treeListByUserId(userIdInt, -1);
        Set<String> permissions = UserAdaptor.extractPermissions(resourceList);

        List<Role> roleList = roleService.queryRoleByUserid(userIdInt);
        List<String> roles = CollectionTool.isNotEmpty(roleList) ?
                roleList.stream()
                        .map(Role::getCode)
                        .collect(Collectors.toCollection(ArrayList::new)) :
                new ArrayList<>();

        // build LoginInfo
        LoginInfo loginInfo = new LoginInfo(userId, userResponse.getData().getToken());
        loginInfo.setUserName(userResponse.getData().getUsername());
        loginInfo.setRealName(userResponse.getData().getRealName());
        loginInfo.setPermissionList(new ArrayList<>(permissions));
        loginInfo.setRoleList(roles);

        return Response.ofSuccess(loginInfo);
    }

}
