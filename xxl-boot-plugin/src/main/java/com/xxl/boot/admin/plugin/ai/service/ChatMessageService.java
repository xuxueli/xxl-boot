package com.xxl.boot.admin.plugin.ai.service;

import com.xxl.boot.admin.plugin.ai.model.ChatMessage;
import com.xxl.tool.response.PageModel;
import com.xxl.tool.response.Response;

import java.util.List;

/**
* ChatMessage Service
*
* Created by xuxueli on '2025-12-21 18:18:12'.
*/
public interface ChatMessageService {

    /**
    * 新增
    */
    public Response<String> send(int chatId, int senderType, String senderUsername, String content);

    /**
    * 删除
    */
    public Response<String> delete(List<Integer> ids);

    /**
    * 更新
    */
    public Response<String> update(ChatMessage chatMessage);

    /**
    * Load查询
    */
    public Response<ChatMessage> load(int id);

    /**
    * 分页查询
    */
    public PageModel<ChatMessage> pageList(int offset, int pagesize);

    /**
    * 查询
    */
    public Response<List<ChatMessage>> queryByChatId(int chatId);

}
