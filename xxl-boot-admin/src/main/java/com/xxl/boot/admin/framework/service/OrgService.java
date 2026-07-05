package com.xxl.boot.admin.framework.service;

import java.util.List;

import com.xxl.boot.admin.framework.model.entity.Org;
import com.xxl.tool.response.Response;
import com.xxl.tool.response.PageModel;

/**
* Org Service
*
* Created by xuxueli on '2024-09-30 15:38:21'.
*/
public interface OrgService {

    /**
    * 新增
    */
    public Response<String> insert(Org xxlBootOrg);

    /**
    * 删除
    */
    public Response<String> delete(List<Integer> ids);

    /**
    * 更新
    */
    public Response<String> update(Org xxlBootOrg);

    /**
    * Load查询
    */
    public Response<Org> load(int id);

    /**
    * 分页查询
    */
    public PageModel<Org> pageList(int offset, int pagesize);

    /**
     * treeList
     */
    List<Org> treeList(String name, int status);

}
