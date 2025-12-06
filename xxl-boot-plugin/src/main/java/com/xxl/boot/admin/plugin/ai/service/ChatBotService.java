package com.xxl.boot.admin.plugin.ai.service;

import java.util.List;

import com.xxl.boot.admin.plugin.ai.model.ChatBot;
import com.xxl.tool.response.Response;
import com.xxl.tool.response.PageModel;

/**
* Agent Service
*
* Created by xuxueli on '2025-11-30 20:41:37'.
*/
public interface ChatBotService {

    /**
    * 新增
    */
    public Response<String> insert(ChatBot user);

    /**
    * 删除
    */
    public Response<String> delete(List<Integer> ids);

    /**
    * 更新
    */
    public Response<String> update(ChatBot user);

    /**
    * Load查询
    */
    public Response<ChatBot> load(int id);

    /**
    * 分页查询
    */
    public PageModel<ChatBot> pageList(int offset, int pagesize);

}
