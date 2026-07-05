package com.xxl.boot.api.framework.service;

import com.xxl.boot.api.framework.model.dto.ResourceDTO;
import com.xxl.boot.api.framework.model.entity.Resource;
import com.xxl.tool.response.PageModel;
import com.xxl.tool.response.Response;

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
    /*public List<XxlBootResourceDTO> treeListByUserId(int userId);*/

    /**
     * 根据 用户ID 获取 资源列表（已授权）
     */
    List<Resource> queryResourceByUserid(int userId);

}
