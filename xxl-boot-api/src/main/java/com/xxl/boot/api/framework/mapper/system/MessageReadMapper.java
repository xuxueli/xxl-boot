package com.xxl.boot.api.framework.mapper.system;

import com.xxl.boot.api.framework.model.entity.MessageRead;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 消息已读记录 Mapper
 *
 * @author xuxueli 2026-07-25
 */
@Mapper
public interface MessageReadMapper {

    /**
     * 新增已读记录
     */
    public int insert(@Param("xxlBootMessageRead") MessageRead xxlBootMessageRead);

    /**
     * 查询某消息的全部已读记录
     */
    public List<MessageRead> selectByMessageId(@Param("messageId") long messageId);

    /**
     * 查询某用户对某消息的已读记录
     */
    public MessageRead selectByMessageAndUser(@Param("messageId") long messageId,
                                              @Param("userId") int userId);

    /**
     * 统计某消息的已读人数
     */
    public int countByMessageId(@Param("messageId") long messageId);

    /**
     * 按消息ID列表批量删除已读记录
     */
    public int deleteByMessageIds(@Param("messageIds") List<Long> messageIds);

}
