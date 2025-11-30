package com.xxl.boot.admin.plugin.ai.service;

import java.util.List;

import com.xxl.boot.admin.plugin.ai.model.Agent;
import com.xxl.tool.response.Response;
import com.xxl.tool.response.PageModel;

/**
* Agent Service
*
* Created by xuxueli on '2025-11-30 20:41:37'.
*/
public interface AgentService {

    /**
    * 新增
    */
    public Response<String> insert(Agent user);

    /**
    * 删除
    */
    public Response<String> delete(List<Integer> ids);

    /**
    * 更新
    */
    public Response<String> update(Agent user);

    /**
    * Load查询
    */
    public Response<Agent> load(int id);

    /**
    * 分页查询
    */
    public PageModel<Agent> pageList(int offset, int pagesize);

}
