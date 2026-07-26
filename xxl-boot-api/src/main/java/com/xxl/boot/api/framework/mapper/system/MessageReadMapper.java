package com.xxl.boot.api.framework.mapper.system;

import com.xxl.boot.api.framework.model.entity.MessageRead;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
* MessageRead Mapper
*
* Created by xuxueli on '2026-07-25'.
*/
@Mapper
public interface MessageReadMapper {

    /**
    * 新增
    */
    public int insert(@Param("xxlBootMessageRead") MessageRead xxlBootMessageRead);

    /**
    * 根据消息ID查询已读记录
    */
    public List<MessageRead> selectByMessageId(@Param("messageId") long messageId);

    /**
    * 根据消息ID和用户ID查询已读记录
    */
    public MessageRead selectByMessageAndUser(@Param("messageId") long messageId,
                                              @Param("userId") int userId);

    /**
    * 统计消息的已读人数
    */
    public int countByMessageId(@Param("messageId") long messageId);

    /**
    * 根据消息ID列表删除
    */
    public int deleteByMessageIds(@Param("messageIds") List<Long> messageIds);

}
