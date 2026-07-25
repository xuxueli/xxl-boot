package com.xxl.boot.api.framework.mapper;

import com.xxl.boot.api.framework.model.entity.Codegen;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 代码生成 - 业务表 Mapper
 */
@Mapper
public interface CodegenMapper {

    int insert(@Param("xxlBootCodegen") Codegen xxlBootCodegen);
    int delete(@Param("ids") List<Integer> ids);
    int update(@Param("xxlBootCodegen") Codegen xxlBootCodegen);
    Codegen load(@Param("id") int id);
    List<Codegen> pageList(@Param("tableName") String tableName,
                           @Param("tableComment") String tableComment,
                           @Param("offset") int offset, @Param("pagesize") int pagesize);
    int pageListCount(@Param("tableName") String tableName,
                      @Param("tableComment") String tableComment,
                      @Param("offset") int offset, @Param("pagesize") int pagesize);
}
