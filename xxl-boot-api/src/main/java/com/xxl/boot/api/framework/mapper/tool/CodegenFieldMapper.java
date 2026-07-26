package com.xxl.boot.api.framework.mapper.tool;

import com.xxl.boot.api.framework.model.entity.CodegenField;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 代码生成 - 业务表字段 Mapper
 */
@Mapper
public interface CodegenFieldMapper {

    int insert(@Param("xxlBootCodegenField") CodegenField xxlBootCodegenField);
    int delete(@Param("ids") List<Integer> ids);
    int deleteByCodegenIds(@Param("codegenIds") List<Integer> codegenIds);
    int update(@Param("xxlBootCodegenField") CodegenField xxlBootCodegenField);
    CodegenField load(@Param("id") int id);
    List<CodegenField> pageList(@Param("codegenId") long codegenId,
                                @Param("offset") int offset, @Param("pagesize") int pagesize);
    int pageListCount(@Param("codegenId") long codegenId,
                      @Param("offset") int offset, @Param("pagesize") int pagesize);
    List<CodegenField> findByCodegenId(@Param("codegenId") long codegenId);
}
