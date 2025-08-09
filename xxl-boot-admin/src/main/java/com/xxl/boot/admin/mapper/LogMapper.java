package com.xxl.boot.admin.mapper;

import com.xxl.boot.admin.model.entity.XxlBootLog;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
* XxlBootLog Mapper
*
* Created by xuxueli on '2024-10-27 12:19:06'.
*/
@Mapper
public interface LogMapper {

    /**
    * 新增
    */
    public int insert(@Param("xxlBootLog") XxlBootLog xxlBootLog);

    /**
    * 删除
    */
    public int delete(@Param("ids") List<Integer> ids);

    /**
    * 更新
    */
    public int update(@Param("xxlBootLog") XxlBootLog xxlBootLog);

    /**
    * Load查询
    */
    public XxlBootLog load(@Param("id") int id);

    /**
    * 分页查询Data
    */
	public List<XxlBootLog> pageList(@Param("type") int type,
                                     @Param("module") String module,
                                     @Param("title") String title,
                                     @Param("offset") int offset,
                                     @Param("pagesize") int pagesize);

    /**
    * 分页查询Count
    */
    public int pageListCount(@Param("type") int type,
                             @Param("module") String module,
                             @Param("title") String title,
                             @Param("offset") int offset,
                             @Param("pagesize") int pagesize);

}
