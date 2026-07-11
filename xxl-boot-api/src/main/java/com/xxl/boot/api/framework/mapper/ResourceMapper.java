package com.xxl.boot.api.framework.mapper;

import com.xxl.boot.api.framework.model.entity.Resource;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
* Resource Mapper
*
* Created by xuxueli on '2024-07-28 12:52:39'.
*/
@Mapper
    public interface ResourceMapper {

    /**
    * 新增
    */
    public int insert(@Param("xxlBootResource") Resource xxlBootResource);

    /**
    * 删除
    */
    public int delete(@Param("ids") List<Integer> ids);

    /**
    * 更新
    */
    public int update(@Param("xxlBootResource") Resource xxlBootResource);

    /**
    * Load查询
    */
    public Resource load(@Param("id") int id);

    /**
    * 分页查询Data
    */
	public List<Resource> pageList(@Param("offset") int offset, @Param("pagesize") int pagesize);

    /**
    * 分页查询Count
    */
    public int pageListCount(@Param("offset") int offset, @Param("pagesize") int pagesize);

    /**
     * Tree查询
     */
    public List<Resource> queryResource(@Param("name") String name, @Param("status") int status);

    /**
     * queryByParentIds
     */
    List<Resource> queryByParentIds(@Param("ids") List<Integer> ids);

    /**
     * Tree查询（By User）
     */
    List<Resource> queryResourceByUserId(@Param("userId") int userId, @Param("status") int status, @Param("visible") int visible);

}
