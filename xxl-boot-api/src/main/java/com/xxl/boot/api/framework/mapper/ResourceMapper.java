package com.xxl.boot.api.framework.mapper;

import com.xxl.boot.api.framework.model.entity.XxlBootResource;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
* XxlBootResource Mapper
*
* Created by xuxueli on '2024-07-28 12:52:39'.
*/
@Mapper
    public interface ResourceMapper {

    /**
    * 新增
    */
    public int insert(@Param("xxlBootResource") XxlBootResource xxlBootResource);

    /**
    * 删除
    */
    public int delete(@Param("ids") List<Integer> ids);

    /**
    * 更新
    */
    public int update(@Param("xxlBootResource") XxlBootResource xxlBootResource);

    /**
    * Load查询
    */
    public XxlBootResource load(@Param("id") int id);

    /**
    * 分页查询Data
    */
	public List<XxlBootResource> pageList(@Param("offset") int offset, @Param("pagesize") int pagesize);

    /**
    * 分页查询Count
    */
    public int pageListCount(@Param("offset") int offset, @Param("pagesize") int pagesize);

    /**
     * Tree查询
     */
    public List<XxlBootResource> queryResource(@Param("name") String name, @Param("status") int status);

    /**
     * queryByParentIds
     */
    List<XxlBootResource> queryByParentIds(@Param("ids") List<Integer> ids);

    /**
     * Tree查询（By User）
     */
    List<XxlBootResource> queryResourceByUserId(@Param("userId") int userId, @Param("status") int status);

}
