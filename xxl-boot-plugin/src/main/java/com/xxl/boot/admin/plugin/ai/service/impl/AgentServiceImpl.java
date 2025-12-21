package com.xxl.boot.admin.plugin.ai.service.impl;

import com.xxl.boot.admin.plugin.ai.mapper.AgentMapper;
import com.xxl.boot.admin.plugin.ai.model.Agent;
import com.xxl.boot.admin.plugin.ai.service.AgentService;
import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import com.xxl.tool.response.Response;
import com.xxl.tool.response.PageModel;

/**
* Agent Service Impl
*
* Created by xuxueli on '2025-12-21 16:13:29'.
*/
@Service
public class AgentServiceImpl implements AgentService {

	@Resource
	private AgentMapper agentMapper;

	/**
    * 新增
    */
	@Override
	public Response<String> insert(Agent agent) {

		// valid
		if (agent == null) {
			return Response.ofFail("必要参数缺失");
        }

		agentMapper.insert(agent);
		return Response.ofSuccess();
	}

	/**
	* 删除
	*/
	@Override
	public Response<String> delete(List<Integer> ids) {
		int ret = agentMapper.delete(ids);
			return ret>0? Response.ofSuccess() : Response.ofFail() ;
	}

	/**
	* 更新
	*/
	@Override
	public Response<String> update(Agent agent) {
		int ret = agentMapper.update(agent);
		return ret>0? Response.ofSuccess() : Response.ofFail() ;
	}

	/**
	* Load查询
	*/
	@Override
	public Response<Agent> load(int id) {
		Agent record = agentMapper.load(id);
		return Response.ofSuccess(record);
	}

	/**
	* 分页查询
	*/
	@Override
	public PageModel<Agent> pageList(int offset, int pagesize) {

		List<Agent> pageList = agentMapper.pageList(offset, pagesize);
		int totalCount = agentMapper.pageListCount(offset, pagesize);

		// result
		PageModel<Agent> pageModel = new PageModel<Agent>();
		pageModel.setData(pageList);
		pageModel.setTotal(totalCount);

		return pageModel;
	}

}
