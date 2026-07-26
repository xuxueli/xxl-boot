package com.xxl.boot.api.framework.mapper.tool;

import com.xxl.boot.api.framework.model.entity.CodegenField;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 代码生成 - 业务表字段 Mapper
 * 
 * @author xuxueli 2024-01-01
 */
@Mapper
public interface CodegenFieldMapper {

    /**
     * 新增字段
     */
    int insert(@Param("xxlBootCodegenField") CodegenField xxlBootCodegenField);
    /**
     * 删除字段
     */
    int delete(@Param("ids") List<Integer> ids);
    /**
     * 根据归属表 ID 删除字段
     */
    int deleteByCodegenIds(@Param("codegenIds") List<Integer> codegenIds);
    /**
     * 更新字段
     */
    int update(@Param("xxlBootCodegenField") CodegenField xxlBootCodegenField);
    /**
     * 根据 ID 查询字段
     */
    CodegenField load(@Param("id") int id);
    /**
     * 分页查询字段列表
     */
    List<CodegenField> pageList(@Param("codegenId") long codegenId,
                                @Param("offset") int offset, @Param("pagesize") int pagesize);
    /**
     * 分页查询字段总数
     */
    int pageListCount(@Param("codegenId") long codegenId,
                      @Param("offset") int offset, @Param("pagesize") int pagesize);
    /**
     * 根据归属表 ID 查询字段列表
     */
    List<CodegenField> findByCodegenId(@Param("codegenId") long codegenId);
}
