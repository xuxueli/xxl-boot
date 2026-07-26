package com.xxl.boot.api.framework.mapper.tool;

import com.xxl.boot.api.framework.model.entity.Codegen;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 代码生成 - 业务表 Mapper
 * 
 * @author xuxueli 2024-01-01
 */
@Mapper
public interface CodegenMapper {

    /**
     * 新增业务表
     */
    int insert(@Param("xxlBootCodegen") Codegen xxlBootCodegen);
    /**
     * 删除业务表
     */
    int delete(@Param("ids") List<Integer> ids);
    /**
     * 更新业务表
     */
    int update(@Param("xxlBootCodegen") Codegen xxlBootCodegen);
    /**
     * 根据 ID 查询业务表
     */
    Codegen load(@Param("id") int id);
    /**
     * 分页查询业务表列表
     */
    List<Codegen> pageList(@Param("tableName") String tableName,
                           @Param("tableComment") String tableComment,
                           @Param("offset") int offset, @Param("pagesize") int pagesize);
    /**
     * 分页查询业务表总数
     */
    int pageListCount(@Param("tableName") String tableName,
                      @Param("tableComment") String tableComment,
                      @Param("offset") int offset, @Param("pagesize") int pagesize);
}
