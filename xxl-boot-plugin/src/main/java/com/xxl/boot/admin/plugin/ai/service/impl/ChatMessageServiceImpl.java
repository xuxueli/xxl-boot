package com.xxl.boot.admin.plugin.ai.service.impl;

import com.xxl.boot.admin.plugin.ai.constant.enums.SenderTypeEnum;
import com.xxl.boot.admin.plugin.ai.mapper.ChatMessageMapper;
import com.xxl.boot.admin.plugin.ai.model.ChatMessage;
import com.xxl.boot.admin.plugin.ai.service.ChatMessageService;
import com.xxl.tool.core.StringTool;
import com.xxl.tool.response.PageModel;
import com.xxl.tool.response.Response;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

/**
* ChatMessage Service Impl
*
* Created by xuxueli on '2025-12-21 18:18:12'.
*/
@Service
public class ChatMessageServiceImpl implements ChatMessageService {

	@Resource
	private ChatMessageMapper chatMessageMapper;

	/**
    * 新增
    */
	@Override
	public Response<String> send(int chatId, int senderType, String senderUsername, String content) {

		// valid
		if (StringTool.isBlank(senderUsername) || StringTool.isBlank(content) || chatId<=0) {
			return Response.ofFail("必要参数缺失");
        }

		// build message
		ChatMessage chatMessage = new ChatMessage();
		chatMessage.setChatId(chatId);
		chatMessage.setSenderType(senderType);
		chatMessage.setSenderUsername(senderUsername);
		chatMessage.setContent(content);

		chatMessageMapper.insert(chatMessage);
		return Response.ofSuccess();
	}

	/**
	* 删除
	*/
	@Override
	public Response<String> delete(List<Integer> ids) {
		int ret = chatMessageMapper.delete(ids);
			return ret>0? Response.ofSuccess() : Response.ofFail() ;
	}

	/**
	* 更新
	*/
	@Override
	public Response<String> update(ChatMessage chatMessage) {
		int ret = chatMessageMapper.update(chatMessage);
		return ret>0? Response.ofSuccess() : Response.ofFail() ;
	}

	/**
	* Load查询
	*/
	@Override
	public Response<ChatMessage> load(int id) {
		ChatMessage record = chatMessageMapper.load(id);
		return Response.ofSuccess(record);
	}

	/**
	* 分页查询
	*/
	@Override
	public PageModel<ChatMessage> pageList(int offset, int pagesize) {

		List<ChatMessage> pageList = chatMessageMapper.pageList(offset, pagesize);
		int totalCount = chatMessageMapper.pageListCount(offset, pagesize);

		// result
		PageModel<ChatMessage> pageModel = new PageModel<ChatMessage>();
		pageModel.setData(pageList);
		pageModel.setTotal(totalCount);

		return pageModel;
	}

	@Override
	public Response<List<ChatMessage>> queryByChatId(int chatId) {
		List<ChatMessage> messageList = chatMessageMapper.queryByChatId(chatId);
		return Response.ofSuccess(messageList);
	}

}
