package com.xxl.boot.admin.framework.service.impl;

import com.xxl.boot.admin.framework.mapper.MessageMapper;
import com.xxl.boot.admin.framework.model.adaptor.MesssageAdaptor;
import com.xxl.boot.admin.framework.model.dto.MessageDTO;
import com.xxl.boot.admin.framework.model.entity.Message;
import com.xxl.boot.admin.framework.service.MessageService;
import com.xxl.tool.core.StringTool;
import com.xxl.tool.response.PageModel;
import com.xxl.tool.response.Response;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

/**
* Message Service Impl
*
* Created by xuxueli on '2024-11-03 11:03:29'.
*/
@Service
public class MessageServiceImpl implements MessageService {

	@Resource
	private MessageMapper messageMapper;

	/**
    * 新增
    */
	@Override
	public Response<String> insert(Message xxlBootMessage, String optUserName) {

		// valid
		if (xxlBootMessage == null) {
			return Response.ofFail("必要参数缺失");
        }
		if (StringTool.isBlank(xxlBootMessage.getContent())){
			return Response.ofFail("请输入正文内容");
		}
		xxlBootMessage.setSender(optUserName);

		messageMapper.insert(xxlBootMessage);
		return Response.ofSuccess();
	}

	/**
	* 删除
	*/
	@Override
	public Response<String> delete(List<Integer> ids) {
		int ret = messageMapper.delete(ids);
		return ret>0? Response.ofSuccess() : Response.ofFail();
	}

	/**
	* 更新
	*/
	@Override
	public Response<String> update(Message xxlBootMessage) {
		int ret = messageMapper.update(xxlBootMessage);
		return ret>0? Response.ofSuccess() : Response.ofFail();
	}

	/**
	* Load查询
	*/
	@Override
	public Response<Message> load(int id) {
		Message record = messageMapper.load(id);
		return Response.ofSuccess(record);
	}

	/**
	* 分页查询
	*/
	@Override
	public PageModel<MessageDTO> pageList(int status, String title, int offset, int pagesize) {

		List<Message> pageList = messageMapper.pageList(status, title, offset, pagesize);
		int totalCount = messageMapper.pageListCount(status, title, offset, pagesize);

		// adaptor
		List<MessageDTO> dtoList = MesssageAdaptor.adaptor(pageList);

		// result
		PageModel<MessageDTO> pageModel = new PageModel<MessageDTO>();
		pageModel.setData(dtoList);
		pageModel.setTotal(totalCount);

		return pageModel;
	}

}
