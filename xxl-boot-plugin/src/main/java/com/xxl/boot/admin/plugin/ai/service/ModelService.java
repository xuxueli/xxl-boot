package com.xxl.boot.admin.plugin.ai.service;

import java.util.List;

import com.xxl.boot.admin.plugin.ai.model.Model;
import com.xxl.tool.response.Response;
import com.xxl.tool.response.PageModel;

/**
* Model Service
*
* Created by xuxueli on '2025-12-21 16:13:29'.
*/
public interface ModelService {

    /**
    * 新增
    */
    public Response<String> insert(Model model);

    /**
    * 删除
    */
    public Response<String> delete(List<Integer> ids);

    /**
    * 更新
    */
    public Response<String> update(Model model);

    /**
    * Load查询
    */
    public Response<Model> load(int id);

    /**
    * 分页查询
    */
    public PageModel<Model> pageList(int offset, int pagesize, int modelType, String name);

    /**
     * 查询所有
     */
    public List<Model> queryAllModel();

}
