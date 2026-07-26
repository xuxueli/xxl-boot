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


    /**
     * 存储登录信息（写入 token）
     */
    @Override
    public Response<String> set(LoginInfo loginInfo) {

        // 获取 token 签名
        String token_sign = loginInfo.getSignature();

        // 按用户 ID 更新 token
        return userService.updateToken(Integer.valueOf(loginInfo.getUserId()), token_sign);
    }

    /**
     * 更新登录信息（不支持）
     */
    @Override
    public Response<String> update(LoginInfo loginInfo) {
        return Response.ofFail("not support");
    }

    /**
     * 移除登录信息（清除 token）
     */
    @Override
    public Response<String> remove(String userId) {
        return userService.updateToken(Integer.valueOf(userId), "");
    }

    /**
     * 从数据库查询并构建登录信息
     */
    @Override
    public Response<LoginInfo> get(String userId) {

        // 加载用户信息
        int userIdInt = Integer.parseInt(userId);
        Response<User> userResponse = userService.loadByUserId(userIdInt);
        if (!userResponse.isSuccess()) {
            return Response.ofFail("userId invalid.");
        }

        // 查询权限列表
        List<ResourceDTO> resourceList = resourceService.treeListByUserId(userIdInt, -1);
        Set<String> permissions = UserAdaptor.extractPermissions(resourceList);

        // 查询角色列表
        List<Role> roleList = roleService.queryRoleByUserid(userIdInt);
        List<String> roles = CollectionTool.isNotEmpty(roleList) ?
                roleList.stream()
                        .map(Role::getCode)
                        .collect(Collectors.toCollection(ArrayList::new)) :
                new ArrayList<>();

        // 组装 LoginInfo
        LoginInfo loginInfo = new LoginInfo(userId, userResponse.getData().getToken());
        loginInfo.setUserName(userResponse.getData().getUsername());
        loginInfo.setRealName(userResponse.getData().getRealName());
        loginInfo.setPermissionList(new ArrayList<>(permissions));
        loginInfo.setRoleList(roles);

        return Response.ofSuccess(loginInfo);
    }

}
