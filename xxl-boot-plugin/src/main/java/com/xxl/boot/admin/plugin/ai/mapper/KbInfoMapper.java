package com.xxl.boot.admin.plugin.ai.mapper;

import com.xxl.boot.admin.plugin.ai.model.KbInfo;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
* KbInfo Mapper
*
* Created by xuxueli on '2026-03-08 09:39:11'.
*/
@Mapper
public interface KbInfoMapper {

    /**
    * 新增
    */
    public int insert(@Param("kbInfo") KbInfo kbInfo);

    /**
    * 删除
    */
    public int delete(@Param("ids") List<Integer> ids);

    /**
    * 更新
    */
    public int update(@Param("kbInfo") KbInfo kbInfo);

    /**
    * Load查询
    */
    public KbInfo load(@Param("id") int id);

    /**
    * 分页查询Data
    */
	public List<KbInfo> pageList(@Param("offset") int offset, @Param("pagesize") int pagesize);

    /**
    * 分页查询Count
    */
    public int pageListCount(@Param("offset") int offset, @Param("pagesize") int pagesize);

}
