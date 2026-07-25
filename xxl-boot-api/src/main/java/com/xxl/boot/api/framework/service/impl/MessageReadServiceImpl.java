package com.xxl.boot.api.framework.service.impl;

import com.xxl.boot.api.framework.mapper.MessageReadMapper;
import com.xxl.boot.api.framework.model.entity.MessageRead;
import com.xxl.boot.api.framework.service.MessageReadService;
import com.xxl.tool.core.CollectionTool;
import com.xxl.tool.response.PageModel;
import com.xxl.tool.response.Response;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

/**
* MessageRead Service Impl
*
* Created by xuxueli on '2026-07-25'.
*/
@Service
public class MessageReadServiceImpl implements MessageReadService {

    @Resource
    private MessageReadMapper messageReadMapper;

    @Override
    public Response<String> markRead(long messageId, int userId) {
        MessageRead record = messageReadMapper.selectByMessageAndUser(messageId, userId);
        if (record != null) {
            return Response.ofSuccess();
        }
        MessageRead xxlBootMessageRead = new MessageRead();
        xxlBootMessageRead.setMessageId(messageId);
        xxlBootMessageRead.setUserId(userId);
        messageReadMapper.insert(xxlBootMessageRead);
        return Response.ofSuccess();
    }

    @Override
    public Response<String> markReadAll(List<Long> messageIds, int userId) {
        if (CollectionTool.isEmpty(messageIds)) {
            return Response.ofFail("参数为空");
        }
        for (Long messageId : messageIds) {
            MessageRead record = messageReadMapper.selectByMessageAndUser(messageId, userId);
            if (record == null) {
                MessageRead xxlBootMessageRead = new MessageRead();
                xxlBootMessageRead.setMessageId(messageId);
                xxlBootMessageRead.setUserId(userId);
                messageReadMapper.insert(xxlBootMessageRead);
            }
        }
        return Response.ofSuccess();
    }

    @Override
    public boolean isRead(long messageId, int userId) {
        MessageRead record = messageReadMapper.selectByMessageAndUser(messageId, userId);
        return record != null;
    }

    @Override
    public PageModel<MessageRead> readUsers(long messageId, int offset, int pagesize) {
        List<MessageRead> pageList = messageReadMapper.selectByMessageId(messageId);
        int totalCount = messageReadMapper.countByMessageId(messageId);
        PageModel<MessageRead> pageModel = new PageModel<>();
        pageModel.setData(pageList);
        pageModel.setTotal(totalCount);
        return pageModel;
    }

}
