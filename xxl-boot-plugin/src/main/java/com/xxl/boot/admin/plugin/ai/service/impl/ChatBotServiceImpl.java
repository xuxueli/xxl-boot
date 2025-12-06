package com.xxl.boot.admin.plugin.ai.service.impl;

import com.xxl.boot.admin.plugin.ai.model.ChatBot;
import com.xxl.boot.admin.plugin.ai.service.ChatBotService;
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
public class ChatBotServiceImpl implements ChatBotService {


	/**
    * 新增
    */
	@Override
	public Response<String> insert(ChatBot user) {

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
	public Response<String> update(ChatBot user) {
		int ret = 1;
		return ret>0? Response.ofSuccess() : Response.ofFail() ;
	}

	/**
	* Load查询
	*/
	@Override
	public Response<ChatBot> load(int id) {

		ChatBot record = new ChatBot();
        record.setId(id);
        record.setName("助手小李");
        record.setCueWord("你是一个资深研发工程师，严谨、专业；");
        record.setModel("qwen3:0.6b");
        record.setOllamaUrl("http://127.0.0.1:11434");

		return Response.ofSuccess(record);
	}

	/**
	* 分页查询
	*/
	@Override
	public PageModel<ChatBot> pageList(int offset, int pagesize) {

        ChatBot record = new ChatBot();
        record.setId(1);
        record.setName("助手小李");
        record.setCueWord("你是一个资深研发工程师，严谨、专业；");
        record.setModel("qwen3:0.6b");
        record.setOllamaUrl("http://127.0.0.1:11434");


		List<ChatBot> pageList = List.of(record);
		int totalCount = 1;

		// result
		PageModel<ChatBot> pageModel = new PageModel<>();
		pageModel.setData(pageList);
		pageModel.setTotal(totalCount);

		return pageModel;
	}

}
