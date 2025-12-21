package com.xxl.boot.admin.plugin.ai.mapper;

import com.xxl.boot.admin.plugin.ai.model.Agent;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

/**
* Agent Mapper
*
* Created by xuxueli on '2025-12-21 16:13:29'.
*/
@Mapper
public interface AgentMapper {

    /**
    * 新增
    */
    public int insert(@Param("agent") Agent agent);

    /**
    * 删除
    */
    public int delete(@Param("ids") List<Integer> ids);

    /**
    * 更新
    */
    public int update(@Param("agent") Agent agent);

    /**
    * Load查询
    */
    public Agent load(@Param("id") int id);

    /**
    * 分页查询Data
    */
	public List<Agent> pageList(@Param("offset") int offset,
                                @Param("pagesize") int pagesize,
                                @Param("agentType") int agentType,
                                @Param("name") String name);

    /**
    * 分页查询Count
    */
    public int pageListCount(@Param("offset") int offset,
                             @Param("pagesize") int pagesize,
                             @Param("agentType") int agentType,
                             @Param("name") String name);

}
