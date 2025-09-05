package com.xxl.boot.admin.mapper;

import com.xxl.boot.admin.model.entity.XxlBootOrg;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
* XxlBootOrg Mapper
*
* Created by xuxueli on '2024-09-30 15:38:21'.
*/
@Mapper
public interface OrgMapper {

    /**
    * 新增
    */
    public int insert(@Param("xxlBootOrg") XxlBootOrg xxlBootOrg);

    /**
    * 删除
    */
    public int delete(@Param("ids") List<Integer> ids);

    /**
    * 更新
    */
    public int update(@Param("xxlBootOrg")  XxlBootOrg xxlBootOrg);

    /**
    * Load查询
    */
    public XxlBootOrg load(@Param("id") int id);

    /**
    * 分页查询Data
    */
	public List<XxlBootOrg> pageList(@Param("offset") int offset, @Param("pagesize") int pagesize);

    /**
    * 分页查询Count
    */
    public int pageListCount(@Param("offset") int offset, @Param("pagesize") int pagesize);

    /**
     * queryOrg
     */
    List<XxlBootOrg> queryOrg(@Param("name") String name, @Param("status") int status);

    /**
     * 查询子节点
     */
    List<XxlBootOrg> queryByParentIds(@Param("ids") List<Integer> ids);

}