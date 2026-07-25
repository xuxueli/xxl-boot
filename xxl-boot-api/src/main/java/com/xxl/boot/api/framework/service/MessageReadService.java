package com.xxl.boot.api.framework.service;

import com.xxl.boot.api.framework.model.entity.MessageRead;
import com.xxl.tool.response.PageModel;
import com.xxl.tool.response.Response;

import java.util.List;

/**
* MessageRead Service
*
* Created by xuxueli on '2026-07-25'.
*/
public interface MessageReadService {

    /**
    * 标记已读
    */
    public Response<String> markRead(long messageId, int userId);

    /**
    * 批量标记已读
    */
    public Response<String> markReadAll(List<Long> messageIds, int userId);

    /**
    * 查询用户是否已读某消息
    */
    public boolean isRead(long messageId, int userId);

    /**
    * 查询消息的已读用户列表
    */
    public PageModel<MessageRead> readUsers(long messageId, int offset, int pagesize);

}
