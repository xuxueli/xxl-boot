package com.xxl.boot.admin.plugin.ai.mapper;

import com.xxl.boot.admin.plugin.ai.model.ChatMessage;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
* ChatMessage Mapper
*
* Created by xuxueli on '2025-12-21 18:18:12'.
*/
@Mapper
public interface ChatMessageMapper {

    /**
    * 新增
    */
    public int insert(@Param("chatMessage") ChatMessage chatMessage);

    /**
    * 删除
    */
    public int delete(@Param("ids") List<Integer> ids);

    /**
    * 更新
    */
    public int update(@Param("chatMessage") ChatMessage chatMessage);

    /**
    * Load查询
    */
    public ChatMessage load(@Param("id") int id);

    /**
    * 分页查询Data
    */
	public List<ChatMessage> pageList(@Param("offset") int offset, @Param("pagesize") int pagesize);

    /**
    * 分页查询Count
    */
    public int pageListCount(@Param("offset") int offset, @Param("pagesize") int pagesize);

}
