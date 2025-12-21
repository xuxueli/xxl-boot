package com.xxl.boot.admin.plugin.ai.service.impl;

import com.xxl.boot.admin.plugin.ai.constant.enums.AgentTypeEnum;
import com.xxl.boot.admin.plugin.ai.constant.enums.SupplierTypeEnum;
import com.xxl.boot.admin.plugin.ai.mapper.AgentMapper;
import com.xxl.boot.admin.plugin.ai.model.Agent;
import com.xxl.boot.admin.plugin.ai.service.AgentService;
import com.xxl.tool.core.StringTool;
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

		// valid base
		if (agent == null) {
			return Response.ofFail("必要参数缺失");
        }
		if (StringTool.isBlank(agent.getName())) {
			return Response.ofFail("Agent名称 不能为空");
		}
		AgentTypeEnum agentTypeEnum = AgentTypeEnum.getByValue(agent.getAgentType(), null);
		if (agentTypeEnum == null) {
			return Response.ofFail("Agent类型 非法");
		}
		SupplierTypeEnum supplierTypeEnum = SupplierTypeEnum.getByValue(agent.getSupplierType(), null);
		if (supplierTypeEnum == null) {
			return Response.ofFail("供应商类型 非法");
		}

		// valid: Chat + Ollama
		if (AgentTypeEnum.CHAT == agentTypeEnum && SupplierTypeEnum.OLLAMA == supplierTypeEnum) {
			if (StringTool.isBlank(agent.getModel())) {
				return Response.ofFail("模型 不能为空");
			}
			if (StringTool.isBlank(agent.getOllamaUrl())) {
				return Response.ofFail("Ollama URL 不能为空");
			}
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

		// valid base
		if (agent == null) {
			return Response.ofFail("必要参数缺失");
		}
		if (StringTool.isBlank(agent.getName())) {
			return Response.ofFail("Agent名称 不能为空");
		}
		AgentTypeEnum agentTypeEnum = AgentTypeEnum.getByValue(agent.getAgentType(), null);
		if (agentTypeEnum == null) {
			return Response.ofFail("Agent类型 非法");
		}
		SupplierTypeEnum supplierTypeEnum = SupplierTypeEnum.getByValue(agent.getSupplierType(), null);
		if (supplierTypeEnum == null) {
			return Response.ofFail("供应商类型 非法");
		}

		// valid: Chat + Ollama
		if (AgentTypeEnum.CHAT == agentTypeEnum && SupplierTypeEnum.OLLAMA == supplierTypeEnum) {
			if (StringTool.isBlank(agent.getModel())) {
				return Response.ofFail("模型 不能为空");
			}
			if (StringTool.isBlank(agent.getOllamaUrl())) {
				return Response.ofFail("Ollama URL 不能为空");
			}
		}

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
	public PageModel<Agent> pageList(int offset, int pagesize, int agentType, String name) {

		List<Agent> pageList = agentMapper.pageList(offset, pagesize, agentType, name);
		int totalCount = agentMapper.pageListCount(offset, pagesize, agentType, name);

		// result
		PageModel<Agent> pageModel = new PageModel<Agent>();
		pageModel.setData(pageList);
		pageModel.setTotal(totalCount);

		return pageModel;
	}

}
