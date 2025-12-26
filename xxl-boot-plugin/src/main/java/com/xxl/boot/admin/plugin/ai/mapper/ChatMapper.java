package com.xxl.boot.admin.plugin.ai.mapper;

import com.xxl.boot.admin.plugin.ai.model.Chat;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
* Chat Mapper
*
* Created by xuxueli on '2025-12-21 17:41:58'.
*/
@Mapper
public interface ChatMapper {

    /**
    * 新增
    */
    public int insert(@Param("chat") Chat chat);

    /**
    * 删除
    */
    public int delete(@Param("ids") List<Integer> ids);

    /**
    * 更新
    */
    public int update(@Param("chat") Chat chat);

    /**
    * Load查询
    */
    public Chat load(@Param("id") int id);

    /**
    * 分页查询Data
    */
	public List<Chat> pageList(@Param("modelId") int modelId,
                               @Param("title") String title,
                               @Param("offset") int offset,
                               @Param("pagesize") int pagesize);

    /**
    * 分页查询Count
    */
    public int pageListCount(@Param("modelId") int modelId,
                             @Param("title") String title,
                             @Param("offset") int offset,
                             @Param("pagesize") int pagesize);

}
