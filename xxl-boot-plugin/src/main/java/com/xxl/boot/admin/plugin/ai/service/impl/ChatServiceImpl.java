package com.xxl.boot.admin.plugin.ai.service.impl;

import com.xxl.boot.admin.plugin.ai.mapper.ModelMapper;
import com.xxl.boot.admin.plugin.ai.mapper.ChatMapper;
import com.xxl.boot.admin.plugin.ai.mapper.ChatMessageMapper;
import com.xxl.boot.admin.plugin.ai.model.Chat;
import com.xxl.boot.admin.plugin.ai.service.ChatService;
import com.xxl.tool.core.StringTool;
import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import java.util.List;
import com.xxl.tool.response.Response;
import com.xxl.tool.response.PageModel;

/**
* Chat Service Impl
*
* Created by xuxueli on '2025-12-21 17:41:58'.
*/
@Service
public class ChatServiceImpl implements ChatService {

	@Resource
	private ChatMapper chatMapper;
	@Resource
	private ModelMapper modelMapper;
	@Resource
	private ChatMessageMapper chatMessageMapper;

	/**
    * 新增
    */
	@Override
	public Response<String> insert(Chat chat) {

		// valid
		if (chat == null) {
			return Response.ofFail("必要参数缺失");
        }

		// valid field
		if (StringTool.isBlank(chat.getTitle())) {
			return Response.ofFail("标题不能为空");
		}
		if (chat.getModelId() <= 0 || modelMapper.load(chat.getModelId()) == null) {
			return Response.ofFail("关联的Model非法");
		}

		chatMapper.insert(chat);
		return Response.ofSuccess();
	}

	/**
	* 删除
	*/
	@Override
	public Response<String> delete(List<Integer> ids) {

		// delete chat message
		for (Integer id: ids) {
			chatMessageMapper.deleteByChatId(id);
		}

		// delete chat
		int ret = chatMapper.delete(ids);
		return ret>0? Response.ofSuccess() : Response.ofFail() ;
	}

	@Override
	public Response<String> deleteMessage(int id) {
		int ret = chatMessageMapper.deleteByChatId(id);
		return ret>0? Response.ofSuccess() : Response.ofFail() ;
	}

	/**
	* 更新
	*/
	@Override
	public Response<String> update(Chat chat) {

		// valid
		if (chat == null || chat.getId() <= 0) {
			return Response.ofFail("必要参数缺失");
		}

		// valid field
		if (chat.getModelId() <= 0 || modelMapper.load(chat.getModelId()) == null) {
			return Response.ofFail("关联的Model非法");
		}
		if (StringTool.isBlank(chat.getTitle())) {
			return Response.ofFail("标题不能为空");
		}

		int ret = chatMapper.update(chat);
		return ret>0? Response.ofSuccess() : Response.ofFail() ;
	}

	/**
	* Load查询
	*/
	@Override
	public Response<Chat> load(int id) {
		Chat record = chatMapper.load(id);
		return Response.ofSuccess(record);
	}

	/**
	* 分页查询
	*/
	@Override
	public PageModel<Chat> pageList(int modelId, String title, int offset, int pagesize) {

		List<Chat> pageList = chatMapper.pageList(modelId, title, offset, pagesize);
		int totalCount = chatMapper.pageListCount(modelId, title, offset, pagesize);

		// result
		PageModel<Chat> pageModel = new PageModel<Chat>();
		pageModel.setData(pageList);
		pageModel.setTotal(totalCount);

		return pageModel;
	}

}
