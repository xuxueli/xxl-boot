package com.xxl.boot.api.framework.mapper.system;

import com.xxl.boot.api.framework.model.entity.Dict;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 字典 Mapper
 *
 * @author xuxueli 2024-11-03
 */
@Mapper
public interface DictMapper {

    /**
     * 新增字典
     */
    int insert(@Param("xxlBootDict") Dict xxlBootDict);

    /**
     * 批量删除字典
     */
    int delete(@Param("ids") List<Integer> ids);

    /**
     * 更新字典
     */
    int update(@Param("xxlBootDict") Dict xxlBootDict);

    /**
     * Load查询（按ID查询单条字典）
     */
    Dict load(@Param("id") int id);

    /**
     * 按字典标识查询
     */
    Dict loadByCode(@Param("code") String code);

    /**
     * 分页查询字典列表（名称/标识模糊匹配，状态过滤）
     */
    List<Dict> pageList(@Param("name") String name,
                        @Param("code") String code,
                        @Param("status") int status,
                        @Param("offset") int offset,
                        @Param("pagesize") int pagesize);

    /**
     * 分页查询字典总数
     */
    int pageListCount(@Param("name") String name,
                      @Param("code") String code,
                      @Param("status") int status,
                      @Param("offset") int offset,
                      @Param("pagesize") int pagesize);

    /**
     * 查询全部字典（按ID升序，供下拉选项使用）
     */
    List<Dict> findAll();

}
