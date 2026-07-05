package com.xxl.boot.admin.framework.service;

import com.xxl.boot.admin.framework.model.dto.ResourceDTO;
import com.xxl.boot.admin.framework.model.entity.Resource;
import com.xxl.tool.response.Response;
import com.xxl.tool.response.PageModel;

import java.util.List;

/**
* Resource Service
*
* Created by xuxueli on '2024-07-28 12:52:39'.
*/
public interface ResourceService {

    /**
    * 新增
    */
    public Response<String> insert(Resource xxlBootResource);

    /**
    * 删除
    */
    public Response<String> delete(List<Integer> ids);

    /**
    * 更新
    */
    public Response<String> update(Resource xxlBootResource);

    /**
    * Load查询
    */
    public Response<Resource> load(int id);

    /**
    * 分页查询
    */
    public PageModel<Resource> pageList(int offset, int pagesize);

    /**
     * Tree查询
     */
    public List<ResourceDTO> treeList(String name, int status);

    /**
     * 简单Tree查询
     */
    public List<ResourceDTO> simpleTreeList(String name, int status);

    /**
     * Tree查询（已授权）
     */
    public List<ResourceDTO> treeListByUserId(int userId);

}
