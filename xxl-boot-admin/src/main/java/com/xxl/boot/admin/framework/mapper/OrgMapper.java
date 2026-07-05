package com.xxl.boot.admin.framework.mapper;

import com.xxl.boot.admin.framework.model.entity.Org;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
* Org Mapper
*
* Created by xuxueli on '2024-09-30 15:38:21'.
*/
@Mapper
public interface OrgMapper {

    /**
    * 新增
    */
    public int insert(@Param("xxlBootOrg") Org xxlBootOrg);

    /**
    * 删除
    */
    public int delete(@Param("ids") List<Integer> ids);

    /**
    * 更新
    */
    public int update(@Param("xxlBootOrg")  Org xxlBootOrg);

    /**
    * Load查询
    */
    public Org load(@Param("id") int id);

    /**
    * 分页查询Data
    */
	public List<Org> pageList(@Param("offset") int offset, @Param("pagesize") int pagesize);

    /**
    * 分页查询Count
    */
    public int pageListCount(@Param("offset") int offset, @Param("pagesize") int pagesize);

    /**
     * queryOrg
     */
    List<Org> queryOrg(@Param("name") String name, @Param("status") int status);

    /**
     * 查询子节点
     */
    List<Org> queryByParentIds(@Param("ids") List<Integer> ids);

}