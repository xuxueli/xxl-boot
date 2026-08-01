package com.xxl.boot.api.framework.mapper.system;

import com.xxl.boot.api.framework.model.entity.Config;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 配置管理 Mapper
 *
 * @author xuxueli 2024-11-03
 */
@Mapper
public interface ConfigMapper {

    /**
     * 新增配置
     */
    int insert(@Param("xxlBootConfig") Config xxlBootConfig);

    /**
     * 批量删除配置
     */
    int delete(@Param("ids") List<Integer> ids);

    /**
     * 更新配置
     */
    int update(@Param("xxlBootConfig") Config xxlBootConfig);

    /**
     * Load查询（按ID查询单条配置）
     */
    Config load(@Param("id") int id);

    /**
     * 按配置Key查询
     */
    Config loadByKey(@Param("key") String key);

    /**
     * 分页查询配置列表（名称/Key模糊匹配，状态过滤）
     */
    List<Config> pageList(@Param("status") int status,
                          @Param("name") String name,
                          @Param("key") String key,
                          @Param("offset") int offset,
                          @Param("pagesize") int pagesize);

    /**
     * 分页查询配置总数
     */
    int pageListCount(@Param("status") int status,
                      @Param("name") String name,
                      @Param("key") String key,
                      @Param("offset") int offset,
                      @Param("pagesize") int pagesize);

}
