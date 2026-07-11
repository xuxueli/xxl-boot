package com.xxl.boot.admin.framework.mapper;

import com.xxl.boot.admin.framework.model.entity.Role;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
* role dao
*
* Created by xuxueli on '2024-07-21 02:06:59'.
*/
@Mapper
public interface RoleMapper {

    /**
    * 新增
    */
    public int insert(Role xxlBootRole);

    /**
    * 删除
    */
    public int deleteByIds(@Param("ids") List<Integer> ids);

    /**
    * 更新
    */
    public int update(Role xxlBootRole);

    /**
    * Load查询
    */
    public Role load(@Param("id") int id);

    /**
    * 分页查询Data
    */
	public List<Role> pageList(@Param("offset") int offset,
                                      @Param("pagesize") int pagesize,
                                      @Param("name") String name,
                                      @Param("status") int status);

    /**
    * 分页查询Count
    */
    public int pageListCount(@Param("offset") int offset,
                             @Param("pagesize") int pagesize,
                             @Param("name") String name,
                             @Param("status") int status);

    List<Role> queryByRoleIds(@Param("roleIds") List<Integer> roleIds);

    /**
     * 根据用户id查询角色
     */
    List<Role> queryByUserid(@Param("userId") int userId);

}
