package com.xxl.boot.admin.service.impl;

import com.xxl.boot.admin.mapper.MessageMapper;
import com.xxl.boot.admin.model.adaptor.XxlBootMesssageAdaptor;
import com.xxl.boot.admin.model.dto.XxlBootMessageDTO;
import com.xxl.boot.admin.model.entity.XxlBootMessage;
import com.xxl.boot.admin.service.MessageService;
import com.xxl.tool.core.StringTool;
import com.xxl.tool.response.PageModel;
import com.xxl.tool.response.Response;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

/**
* XxlBootMessage Service Impl
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
	public Response<String> insert(XxlBootMessage xxlBootMessage, String optUserName) {

		// valid
		if (xxlBootMessage == null) {
			return Response.ofFail("必要参数缺失");
        }
		if (StringTool.isBlank(xxlBootMessage.getContent())){
			return Response.ofFail("请输入通知正文");
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
	public Response<String> update(XxlBootMessage xxlBootMessage) {
		int ret = messageMapper.update(xxlBootMessage);
		return ret>0? Response.ofSuccess() : Response.ofFail();
	}

	/**
	* Load查询
	*/
	@Override
	public Response<XxlBootMessage> load(int id) {
		XxlBootMessage record = messageMapper.load(id);
		return Response.ofSuccess(record);
	}

	/**
	* 分页查询
	*/
	@Override
	public PageModel<XxlBootMessageDTO> pageList(int status, String title, int offset, int pagesize) {

		List<XxlBootMessage> pageList = messageMapper.pageList(status, title, offset, pagesize);
		int totalCount = messageMapper.pageListCount(status, title, offset, pagesize);

		// adaptor
		List<XxlBootMessageDTO> dtoList = XxlBootMesssageAdaptor.adaptor(pageList);

		// result
		PageModel<XxlBootMessageDTO> pageModel = new PageModel<XxlBootMessageDTO>();
		pageModel.setData(dtoList);
		pageModel.setTotal(totalCount);

		return pageModel;
	}

}
