package com.xxl.boot.admin.plugin.ai.service;

import java.util.List;

import com.xxl.boot.admin.plugin.ai.model.Chat;
import com.xxl.tool.response.Response;
import com.xxl.tool.response.PageModel;

/**
* Chat Service
*
* Created by xuxueli on '2025-12-21 17:41:58'.
*/
public interface ChatService {

    /**
    * 新增
    */
    public Response<String> insert(Chat chat);

    /**
    * 删除
    */
    public Response<String> delete(List<Integer> ids);

    /**
    * 更新
    */
    public Response<String> update(Chat chat);

    /**
    * Load查询
    */
    public Response<Chat> load(int id);

    /**
    * 分页查询
    */
    public PageModel<Chat> pageList(int offset, int pagesize);

}
