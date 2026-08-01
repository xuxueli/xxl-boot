package com.xxl.boot.api.framework.service;

import com.xxl.boot.api.framework.model.entity.MessageRead;
import com.xxl.tool.response.PageModel;
import com.xxl.tool.response.Response;

import java.util.List;

/**
 * 消息已读记录 Service
 *
 * @author xuxueli 2026-07-25
 */
public interface MessageReadService {

    /**
     * 标记单条消息已读
     *
     * @param messageId 消息ID
     * @param userId    用户ID
     */
    public Response<String> markRead(long messageId, int userId);

    /**
     * 批量标记消息已读
     *
     * @param messageIds 消息ID列表
     * @param userId     用户ID
     */
    public Response<String> markReadAll(List<Long> messageIds, int userId);

    /**
     * 查询用户是否已读某消息
     *
     * @param messageId 消息ID
     * @param userId    用户ID
     */
    public boolean isRead(long messageId, int userId);

    /**
     * 查询消息的已读用户列表（附带用户名等附属字段）
     *
     * @param messageId 消息ID
     * @param offset    分页偏移量
     * @param pagesize  每页条数
     */
    public PageModel<MessageRead> readUsers(long messageId, int offset, int pagesize);

}
