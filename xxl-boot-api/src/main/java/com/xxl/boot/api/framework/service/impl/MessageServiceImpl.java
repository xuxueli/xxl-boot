package com.xxl.boot.api.framework.service.impl;

import com.xxl.boot.api.framework.mapper.system.MessageMapper;
import com.xxl.boot.api.framework.model.adaptor.MesssageAdaptor;
import com.xxl.boot.api.framework.model.dto.MessageDTO;
import com.xxl.boot.api.framework.model.entity.Message;
import com.xxl.boot.api.framework.service.MessageService;
import com.xxl.tool.core.StringTool;
import com.xxl.tool.response.PageModel;
import com.xxl.tool.response.Response;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 消息 Service Impl
 *
 * @author xuxueli 2024-11-03
 */
@Service
public class MessageServiceImpl implements MessageService {

	@Resource
	private MessageMapper messageMapper;

	/**
	 * 新增消息
	 */
	@Override
	public Response<String> insert(Message xxlBootMessage, String optUserName) {

		// 参数校验
		if (xxlBootMessage == null) {
			return Response.ofFail("必要参数缺失");
        }
		if (StringTool.isBlank(xxlBootMessage.getContent())){
			return Response.ofFail("请输入正文内容");
		}
		// 发送人由当前登录用户兜底
		xxlBootMessage.setSender(optUserName);

		messageMapper.insert(xxlBootMessage);
		return Response.ofSuccess();
	}

	/**
	 * 批量删除消息
	 */
	@Override
	public Response<String> delete(List<Integer> ids) {
		int ret = messageMapper.delete(ids);
		return ret>0? Response.ofSuccess() : Response.ofFail();
	}

	/**
	 * 更新消息
	 */
	@Override
	public Response<String> update(Message xxlBootMessage) {
		int ret = messageMapper.update(xxlBootMessage);
		return ret>0? Response.ofSuccess() : Response.ofFail();
	}

	/**
	 * Load查询（按ID查询单条消息）
	 */
	@Override
	public Response<Message> load(int id) {
		Message record = messageMapper.load(id);
		return Response.ofSuccess(record);
	}

	/**
	 * 分页查询消息
	 */
	@Override
	public PageModel<MessageDTO> pageList(int category, int status, String title, int offset, int pagesize) {

		List<Message> pageList = messageMapper.pageList(category, status, title, offset, pagesize);
		int totalCount = messageMapper.pageListCount(category, status, title, offset, pagesize);

		// entity 转 DTO
		List<MessageDTO> dtoList = MesssageAdaptor.adaptor(pageList);

		// 组装分页结果
		PageModel<MessageDTO> pageModel = new PageModel<MessageDTO>();
		pageModel.setData(dtoList);
		pageModel.setTotal(totalCount);

		return pageModel;
	}

}
