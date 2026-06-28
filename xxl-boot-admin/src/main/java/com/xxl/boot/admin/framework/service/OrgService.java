package com.xxl.boot.admin.framework.service;

import java.util.List;

import com.xxl.boot.admin.framework.model.entity.XxlBootOrg;
import com.xxl.tool.response.Response;
import com.xxl.tool.response.PageModel;

/**
* XxlBootOrg Service
*
* Created by xuxueli on '2024-09-30 15:38:21'.
*/
public interface OrgService {

    /**
    * 新增
    */
    public Response<String> insert(XxlBootOrg xxlBootOrg);

    /**
    * 删除
    */
    public Response<String> delete(List<Integer> ids);

    /**
    * 更新
    */
    public Response<String> update(XxlBootOrg xxlBootOrg);

    /**
    * Load查询
    */
    public Response<XxlBootOrg> load(int id);

    /**
    * 分页查询
    */
    public PageModel<XxlBootOrg> pageList(int offset, int pagesize);

    /**
     * treeList
     */
    List<XxlBootOrg> treeList(String name, int status);

}
