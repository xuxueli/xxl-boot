package com.xxl.boot.admin.framework.service;

import com.xxl.boot.admin.framework.model.entity.Role;
import com.xxl.tool.response.PageModel;
import com.xxl.tool.response.Response;

import java.util.List;

/**
* role service
*
* Created by xuxueli on '2024-07-21 02:06:59'.
*/
public interface RoleService {

    /**
    * 新增
    */
    public Response<String> insert(Role xxlBootRole);

    /**
    * 删除
    */
    public Response<String> deleteByIds(List<Integer> ids);

    /**
    * 更新
    */
    public Response<String> update(Role xxlBootRole);

    /**
    * Load查询
    */
    public Response<Role> load(int id);

    /**
    * 分页查询
    */
    public PageModel<Role> pageList(int offset, int pagesize, String name, int status);

    /**
     * 角色资源查询
     */
    Response<List<Integer>> loadRoleRes(int roleId);

    /**
     * 角色资源授权
     */
    Response<String> updateRoleRes(int roleId, List<Integer> resourceIds);

    /**
     * 根据 用户ID 查询 角色列表（已授权）
     */
    List<Role> queryRoleByUserid(int userId);

}