package com.xxl.boot.admin.framework.mapper;

import com.xxl.boot.admin.framework.model.entity.Log;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

/**
 * 日志 Mapper
 *
 * @author xuxueli 2024-10-27
 */
@Mapper
public interface LogMapper {

    /**
     * 新增日志
     */
    public int insert(@Param("xxlBootLog") Log xxlBootLog);

    /**
     * 批量删除日志
     */
    public int delete(@Param("ids") List<Integer> ids);

    /**
     * 更新日志
     */
    public int update(@Param("xxlBootLog") Log xxlBootLog);

    /**
     * 根据 ID 查询日志
     */
    public Log load(@Param("id") int id);

    /**
     * 分页查询日志列表
     */
    List<Log> pageList(@Param("type") int type,
                       @Param("module") int module,
                       @Param("title") String title,
                       @Param("offset") int offset,
                       @Param("pagesize") int pagesize);

    /**
     * 分页查询日志总数
     */
    int pageListCount(@Param("type") int type,
                      @Param("module") int module,
                      @Param("title") String title,
                      @Param("offset") int offset,
                      @Param("pagesize") int pagesize);

    /**
     * 按日期统计日志趋势
     */
    List<Map<String, Object>> trendList(@Param("days") int days);
}
