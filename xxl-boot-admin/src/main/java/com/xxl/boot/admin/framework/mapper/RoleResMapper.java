package com.xxl.boot.admin.framework.mapper;

import com.xxl.boot.admin.framework.model.entity.RoleRes;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
* role res dao
*
* Created by xuxueli on 2024-09-28
*/
@Mapper
public interface RoleResMapper {

    /**
     * 新增
     */
    public int batchInsert(@Param("roleResList") List<RoleRes> roleResList);

    /**
     * 删除
     */
    public int deleteByRoleId(@Param("roleId") int roleId);

    /**
     * 查询
     */
    public List<RoleRes> loadRoleRes(@Param("roleId") int roleId);

    /**
     * 查询
     */
    public List<RoleRes> queryRoleRes(@Param("roleIds") List<Integer> roleIds);

}