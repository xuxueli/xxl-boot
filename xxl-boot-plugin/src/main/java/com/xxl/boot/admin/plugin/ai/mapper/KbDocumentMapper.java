package com.xxl.boot.admin.plugin.ai.mapper;

import com.xxl.boot.admin.plugin.ai.model.KbDocument;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
* KbDocument Mapper
*
* Created by xuxueli on '2026-03-08 10:57:39'.
*/
@Mapper
public interface KbDocumentMapper {

    /**
    * 新增
    */
    public int insert(@Param("kbDocument") KbDocument kbDocument);

    /**
    * 删除
    */
    public int delete(@Param("ids") List<Integer> ids);

    /**
    * 更新
    */
    public int update(@Param("kbDocument") KbDocument kbDocument);

    /**
    * Load查询
    */
    public KbDocument load(@Param("id") int id);

    /**
    * 分页查询Data
    */
	public List<KbDocument> pageList(@Param("offset") int offset, @Param("pagesize") int pagesize);

    /**
    * 分页查询Count
    */
    public int pageListCount(@Param("offset") int offset, @Param("pagesize") int pagesize);

}
