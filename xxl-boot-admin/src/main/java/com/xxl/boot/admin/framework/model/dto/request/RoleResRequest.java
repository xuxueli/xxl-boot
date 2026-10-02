package com.xxl.boot.admin.framework.model.dto.request;

import java.io.Serializable;
import java.util.List;

/**
 * 角色资源授权请求
 *
 * @author xuxueli 2026-10-02
 */
public class RoleResRequest implements Serializable {
    private static final long serialVersionUID = 42L;

    private int roleId;                     /* 角色ID */
    private List<Integer> resourceIds;      /* 资源ID列表 */


    public int getRoleId() {
        return roleId;
    }

    public void setRoleId(int roleId) {
        this.roleId = roleId;
    }

    public List<Integer> getResourceIds() {
        return resourceIds;
    }

    public void setResourceIds(List<Integer> resourceIds) {
        this.resourceIds = resourceIds;
    }

}
