package com.xxl.boot.admin.plugin.ai.service.impl;

import com.xxl.boot.admin.plugin.ai.model.Agent;
import com.xxl.boot.admin.plugin.ai.service.AgentService;
import org.springframework.stereotype.Service;

import java.util.*;

import com.xxl.tool.response.Response;
import com.xxl.tool.response.PageModel;

/**
* Agent Service Impl
*
* Created by xuxueli on '2025-11-30 20:41:37'.
*/
@Service
public class AgentServiceImpl implements AgentService {


	/**
    * 新增
    */
	@Override
	public Response<String> insert(Agent user) {

		// valid
		if (user == null) {
			return Response.ofFail("必要参数缺失");
        }

		return Response.ofSuccess();
	}

	/**
	* 删除
	*/
	@Override
	public Response<String> delete(List<Integer> ids) {
		int ret = 1;
			return ret>0? Response.ofSuccess() : Response.ofFail() ;
	}

	/**
	* 更新
	*/
	@Override
	public Response<String> update(Agent user) {
		int ret = 1;
		return ret>0? Response.ofSuccess() : Response.ofFail() ;
	}

	/**
	* Load查询
	*/
	@Override
	public Response<Agent> load(int id) {
		Agent record = new Agent();
        record.setId(id);
        record.setRealName("张三");
        record.setUsername("admin");
		return Response.ofSuccess(record);
	}

	/**
	* 分页查询
	*/
	@Override
	public PageModel<Agent> pageList(int offset, int pagesize) {

        Agent record = new Agent();
        record.setId(1);
        record.setRealName("张三");
        record.setUsername("admin");

		List<Agent> pageList = List.of(record);
		int totalCount = 1;

		// result
		PageModel<Agent> pageModel = new PageModel<Agent>();
		pageModel.setData(pageList);
		pageModel.setTotal(totalCount);

		return pageModel;
	}

}
