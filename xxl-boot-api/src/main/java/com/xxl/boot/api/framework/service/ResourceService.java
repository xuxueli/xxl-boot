package com.xxl.boot.api.framework.service;

import com.xxl.boot.api.framework.model.dto.XxlBootResourceDTO;
import com.xxl.boot.api.framework.model.entity.XxlBootResource;
import com.xxl.tool.response.PageModel;
import com.xxl.tool.response.Response;

import java.util.List;

/**
* XxlBootResource Service
*
* Created by xuxueli on '2024-07-28 12:52:39'.
*/
public interface ResourceService {

    /**
    * 新增
    */
    public Response<String> insert(XxlBootResource xxlBootResource);

    /**
    * 删除
    */
    public Response<String> delete(List<Integer> ids);

    /**
    * 更新
    */
    public Response<String> update(XxlBootResource xxlBootResource);

    /**
    * Load查询
    */
    public Response<XxlBootResource> load(int id);

    /**
    * 分页查询
    */
    public PageModel<XxlBootResource> pageList(int offset, int pagesize);

    /**
     * Tree查询
     */
    public List<XxlBootResourceDTO> treeList(String name, int status);

    /**
     * 简单Tree查询
     */
    public List<XxlBootResourceDTO> simpleTreeList(String name, int status);

    /**
     * 根据 用户ID 查询 资源Tree列表（已授权）
     */
    /*public List<XxlBootResourceDTO> treeListByUserId(int userId);*/

    /**
     * 根据 用户ID 获取 资源列表（已授权）
     */
    List<XxlBootResource> queryResourceByUserid(int userId);

}
