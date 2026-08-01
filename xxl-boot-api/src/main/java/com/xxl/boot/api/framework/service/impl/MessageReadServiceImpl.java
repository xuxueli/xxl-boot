package com.xxl.boot.api.framework.service.impl;

import com.xxl.boot.api.framework.mapper.org.UserMapper;
import com.xxl.boot.api.framework.mapper.system.MessageReadMapper;
import com.xxl.boot.api.framework.model.entity.MessageRead;
import com.xxl.boot.api.framework.model.entity.User;
import com.xxl.boot.api.framework.service.MessageReadService;
import com.xxl.tool.core.CollectionTool;
import com.xxl.tool.response.PageModel;
import com.xxl.tool.response.Response;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * 消息已读记录 Service Impl
 *
 * @author xuxueli 2026-07-25
 */
@Service
public class MessageReadServiceImpl implements MessageReadService {

    @Resource
    private MessageReadMapper messageReadMapper;
    @Resource
    private UserMapper userMapper;

    /**
     * 标记单条消息已读（已读记录存在则直接返回成功）
     */
    @Override
    public Response<String> markRead(long messageId, int userId) {
        // 已读记录已存在，无需重复标记
        MessageRead record = messageReadMapper.selectByMessageAndUser(messageId, userId);
        if (record != null) {
            return Response.ofSuccess();
        }
        // 首次阅读，写入已读记录
        MessageRead xxlBootMessageRead = new MessageRead();
        xxlBootMessageRead.setMessageId(messageId);
        xxlBootMessageRead.setUserId(userId);
        messageReadMapper.insert(xxlBootMessageRead);
        return Response.ofSuccess();
    }

    /**
     * 批量标记消息已读（逐条幂等标记）
     */
    @Override
    public Response<String> markReadAll(List<Long> messageIds, int userId) {
        // 参数校验
        if (CollectionTool.isEmpty(messageIds)) {
            return Response.ofFail("参数为空");
        }
        // 逐条判断并写入已读记录
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

    /**
     * 查询用户是否已读某消息
     */
    @Override
    public boolean isRead(long messageId, int userId) {
        MessageRead record = messageReadMapper.selectByMessageAndUser(messageId, userId);
        return record != null;
    }

    /**
     * 查询消息的已读用户列表（附带用户名、用户名称附属字段）
     */
    @Override
    public PageModel<MessageRead> readUsers(long messageId, int offset, int pagesize) {
        List<MessageRead> pageList = messageReadMapper.selectByMessageId(messageId);
        int totalCount = messageReadMapper.countByMessageId(messageId);

        // 附属字段：额外查询用户表，按用户ID构建映射
        if (CollectionTool.isNotEmpty(pageList)) {
            List<Integer> userIds = pageList.stream().map(MessageRead::getUserId).collect(Collectors.toList());
            List<User> userList = userMapper.loadByIds(userIds);
            Map<Integer, User> userMap = CollectionTool.isEmpty(userList) ? Collections.emptyMap()
                    : userList.stream().collect(Collectors.toMap(User::getId, user -> user, (u1, u2) -> u1));
            // 逐条赋值用户名、用户名称
            for (MessageRead record : pageList) {
                User user = userMap.get(record.getUserId());
                if (user != null) {
                    record.setUserName(user.getUsername());
                    record.setRealName(user.getRealName());
                }
            }
        }

        // 组装分页结果
        PageModel<MessageRead> pageModel = new PageModel<>();
        pageModel.setData(pageList);
        pageModel.setTotal(totalCount);
        return pageModel;
    }

}
