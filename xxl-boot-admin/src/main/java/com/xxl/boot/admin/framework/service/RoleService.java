package com.xxl.boot.admin.framework.service;

import com.xxl.boot.admin.framework.model.entity.XxlBootRole;
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
    public Response<String> insert(XxlBootRole xxlBootRole);

    /**
    * 删除
    */
    public Response<String> deleteByIds(List<Integer> ids);

    /**
    * 更新
    */
    public Response<String> update(XxlBootRole xxlBootRole);

    /**
    * Load查询
    */
    public Response<XxlBootRole> load(int id);

    /**
    * 分页查询
    */
    public PageModel<XxlBootRole> pageList(int offset, int pagesize, String name);

    /**
     * 角色资源查询
     */
    Response<List<Integer>> loadRoleRes(int roleId);

    /**
     * 角色资源授权
     */
    Response<String> updateRoleRes(int roleId, List<Integer> resourceIds);

}