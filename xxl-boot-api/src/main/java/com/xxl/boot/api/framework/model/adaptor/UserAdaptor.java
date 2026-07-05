package com.xxl.boot.api.framework.model.adaptor;

import com.xxl.boot.api.framework.model.dto.ResourceDTO;
import com.xxl.boot.api.framework.model.dto.RoleDTO;
import com.xxl.boot.api.framework.model.dto.UserDTO;
import com.xxl.boot.api.framework.model.entity.Role;
import com.xxl.boot.api.framework.model.entity.User;
import com.xxl.tool.core.CollectionTool;
import com.xxl.tool.core.MapTool;
import com.xxl.tool.core.StringTool;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

public class UserAdaptor {

    public static User adapt(UserDTO xxlJobUser) {
        if (xxlJobUser == null) {
            return null;
        }

        User xxlUser = new User();
        xxlUser.setId(xxlJobUser.getId());
        xxlUser.setOrgId(xxlJobUser.getOrgId());
        xxlUser.setUsername(xxlJobUser.getUsername());
        xxlUser.setPassword(xxlJobUser.getPassword());
        xxlUser.setToken(xxlJobUser.getToken());
        xxlUser.setStatus(xxlJobUser.getStatus());
        xxlUser.setRealName(xxlJobUser.getRealName());
        xxlUser.setAddTime(xxlJobUser.getAddTime());
        xxlUser.setUpdateTime(xxlJobUser.getUpdateTime());
        return xxlUser;
    }

    public static UserDTO adapt2dto(User xxlJobUser, boolean withPwd, Map<Integer, List<Integer>> userIdToRoleIdsMap) {
        if (xxlJobUser == null) {
            return null;
        }

        UserDTO xxlUser = new UserDTO();
        xxlUser.setId(xxlJobUser.getId());
        xxlUser.setOrgId(xxlJobUser.getOrgId());
        xxlUser.setUsername(xxlJobUser.getUsername());
        if (withPwd) {
            xxlUser.setPassword(xxlJobUser.getPassword());
        }
        xxlUser.setToken(xxlJobUser.getToken());
        xxlUser.setStatus(xxlJobUser.getStatus());
        xxlUser.setRealName(xxlJobUser.getRealName());
        xxlUser.setAddTime(xxlJobUser.getAddTime());
        xxlUser.setUpdateTime(xxlJobUser.getUpdateTime());
        if (MapTool.isNotEmpty(userIdToRoleIdsMap)) {
            xxlUser.setRoleIds(userIdToRoleIdsMap.get(xxlJobUser.getId()));
        }

        return xxlUser;
    }

    public static List<Role> adaptRoleList(List<RoleDTO> roleDTOList) {
        if (CollectionTool.isEmpty(roleDTOList)) {
            return null;
        }
        return roleDTOList
                .stream()
                .map(UserAdaptor::adaptRole)
                .collect(Collectors.toList());
    }

    public static Role adaptRole(RoleDTO roleDTO) {
        Role xxlRole = new Role();
        xxlRole.setId(roleDTO.getId());
        xxlRole.setName(roleDTO.getName());
        xxlRole.setOrder(roleDTO.getOrder());
        xxlRole.setAddTime(roleDTO.getAddTime());
        xxlRole.setUpdateTime(roleDTO.getUpdateTime());

        return xxlRole;
    }

    /**
     * extract resource permissions with children
     *
     * @param resources
     * @return
     */
    public static Set<String> extractPermissions(List<ResourceDTO> resources) {
        Set<String> permissions = new HashSet<>();
        if (CollectionTool.isEmpty(resources)) {
            return permissions;
        }

        for (ResourceDTO resource : resources) {
            if (StringTool.isNotBlank(resource.getPermission())) {
                permissions.add(resource.getPermission().trim());
            }
            if (CollectionTool.isNotEmpty(resource.getChildren())) {
                permissions.addAll(extractPermissions(resource.getChildren()));
            }
        }
        return permissions;
    }

}
