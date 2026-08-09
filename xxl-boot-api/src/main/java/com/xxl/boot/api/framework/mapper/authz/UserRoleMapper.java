package com.xxl.boot.api.framework.mapper.authz;

import com.xxl.boot.api.framework.model.entity.UserRole;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
* UserRole Mapper
*
* Created by xuxueli on '2024-09-30 12:53:32'.
*/
@Mapper
public interface UserRoleMapper {

    /**
    * 新增
    */
    public int batchInsert(@Param("userRoleList") List<UserRole> userRoleList);

    /**
    * 删除
    */
    public int deleteByUserId(@Param("userId") int userId);

    /**
    * Load查询
    */
    public List<UserRole> queryByUserId(@Param("userId") int userId);

    public List<UserRole> queryByUserIds(@Param("userIds") List<Integer> userIds);

    /**
     * 根据角色ID集合查询关联列表（删除前校验）
     */
    public List<UserRole> queryByRoleIds(@Param("roleIds") List<Integer> roleIds);

}