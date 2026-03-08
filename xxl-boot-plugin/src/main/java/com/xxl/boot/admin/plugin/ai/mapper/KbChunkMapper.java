package com.xxl.boot.admin.plugin.ai.mapper;

import com.xxl.boot.admin.plugin.ai.model.KbChunk;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
* KbChunk Mapper
*
* Created by xuxueli on '2026-03-08 13:02:07'.
*/
@Mapper
public interface KbChunkMapper {

    /**
    * 新增
    */
    public int insert(@Param("kbChunk") KbChunk kbChunk);

    /**
    * 删除
    */
    public int delete(@Param("ids") List<Integer> ids);

    /**
    * 更新
    */
    public int update(@Param("kbChunk") KbChunk kbChunk);

    /**
    * Load查询
    */
    public KbChunk load(@Param("id") int id);

    /**
    * 分页查询Data
    */
	public List<KbChunk> pageList(@Param("offset") int offset, @Param("pagesize") int pagesize);

    /**
    * 分页查询Count
    */
    public int pageListCount(@Param("offset") int offset, @Param("pagesize") int pagesize);

}
