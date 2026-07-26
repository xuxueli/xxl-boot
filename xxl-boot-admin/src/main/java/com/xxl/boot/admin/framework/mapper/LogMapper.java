package com.xxl.boot.admin.framework.mapper;

import com.xxl.boot.admin.framework.model.entity.Log;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
* Log Mapper
*
* Created by xuxueli on '2024-10-27 12:19:06'.
*/
@Mapper
public interface LogMapper {

    /**
    * 新增
    */
    public int insert(@Param("xxlBootLog") Log xxlBootLog);

    /**
    * 删除
    */
    public int delete(@Param("ids") List<Integer> ids);

    /**
    * 更新
    */
    public int update(@Param("xxlBootLog") Log xxlBootLog);

    /**
    * Load查询
    */
    public Log load(@Param("id") int id);

    /**
     * 分页查询Data
     */
    List<Log> pageList(@Param("type") int type,                     /* 分页查询 */
                       @Param("module") int module,
                       @Param("title") String title,
                       @Param("offset") int offset,
                       @Param("pagesize") int pagesize);

    /**
     * 分页查询Count
     */
    int pageListCount(@Param("type") int type,                      /* 分页查询-总数 */
                      @Param("module") int module,
                      @Param("title") String title,
                      @Param("offset") int offset,
                      @Param("pagesize") int pagesize);
}
