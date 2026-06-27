package com.xxl.boot.api.framework.mapper;

import com.xxl.boot.api.framework.model.entity.XxlBootMessage;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
* XxlBootMessage Mapper
*
* Created by xuxueli on '2024-11-03 11:03:29'.
*/
@Mapper
public interface MessageMapper {

    /**
    * 新增
    */
    public int insert(@Param("xxlBootMessage") XxlBootMessage xxlBootMessage);

    /**
    * 删除
    */
    public int delete(@Param("ids") List<Integer> ids);

    /**
    * 更新
    */
    public int update(@Param("xxlBootMessage") XxlBootMessage xxlBootMessage);

    /**
    * Load查询
    */
    public XxlBootMessage load(@Param("id") int id);

    /**
    * 分页查询Data
    */
	public List<XxlBootMessage> pageList(@Param("status") int status,
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
