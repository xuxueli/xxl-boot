package com.xxl.boot.admin.framework.mapper;

import com.xxl.boot.admin.framework.model.entity.Message;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
* Message Mapper
*
* Created by xuxueli on '2024-11-03 11:03:29'.
*/
@Mapper
public interface MessageMapper {

    /**
    * 新增
    */
    public int insert(@Param("xxlBootMessage") Message xxlBootMessage);

    /**
    * 删除
    */
    public int delete(@Param("ids") List<Integer> ids);

    /**
    * 更新
    */
    public int update(@Param("xxlBootMessage") Message xxlBootMessage);

    /**
    * Load查询
    */
    public Message load(@Param("id") int id);

    /**
    * 分页查询Data
    */
	public List<Message> pageList(@Param("status") int status,
                                         @Param("title") String title,
                                         @Param("offset") int offset,
                                         @Param("pagesize") int pagesize);

    /**
    * 分页查询Count
    */
    public int pageListCount(@Param("status") int status,
                             @Param("title") String title,
                             @Param("offset") int offset,
                             @Param("pagesize") int pagesize);

}
