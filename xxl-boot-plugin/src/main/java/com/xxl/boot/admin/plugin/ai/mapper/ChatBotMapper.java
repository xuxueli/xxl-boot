package com.xxl.boot.admin.plugin.ai.mapper;

import com.xxl.boot.admin.plugin.ai.model.ChatBot;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
* ChatBot Mapper
*
* Created by xuxueli on '2025-12-07 02:23:23'.
*/
@Mapper
public interface ChatBotMapper {

    /**
    * 新增
    */
    public int insert(@Param("chatBot") ChatBot chatBot);

    /**
    * 删除
    */
    public int delete(@Param("ids") List<Integer> ids);

    /**
    * 更新
    */
    public int update(@Param("chatBot") ChatBot chatBot);

    /**
    * Load查询
    */
    public ChatBot load(@Param("id") int id);

    /**
    * 分页查询Data
    */
	public List<ChatBot> pageList(@Param("offset") int offset, @Param("pagesize") int pagesize);

    /**
    * 分页查询Count
    */
    public int pageListCount(@Param("offset") int offset, @Param("pagesize") int pagesize);

}
