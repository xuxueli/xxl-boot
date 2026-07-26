package com.xxl.boot.api.framework.service.impl;

import com.xxl.boot.api.framework.mapper.system.LogMapper;
import com.xxl.boot.api.framework.model.adaptor.LogAdaptor;
import com.xxl.boot.api.framework.model.dto.LogDTO;
import com.xxl.boot.api.framework.model.entity.Log;
import com.xxl.boot.api.framework.service.LogService;
import com.xxl.tool.response.PageModel;
import com.xxl.tool.response.Response;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

/**
* Log Service Impl
*
* Created by xuxueli on '2024-10-27 12:19:06'.
*/
@Service
public class LogServiceImpl implements LogService {

	@Resource
	private LogMapper logMapper;

	@Override
	public Response<String> insert(Log xxlBootLog) {
		// 参数校验
		if (xxlBootLog == null) {
			return Response.ofFail("必要参数缺失");
        }
		logMapper.insert(xxlBootLog);
		return Response.ofSuccess();
	}

	@Override
	public Response<String> delete(List<Integer> ids) {
		int ret = logMapper.delete(ids);
		return ret > 0 ? Response.ofSuccess() : Response.ofFail();
	}

	@Override
	public Response<String> update(Log xxlBootLog) {
		int ret = logMapper.update(xxlBootLog);
		return ret > 0 ? Response.ofSuccess() : Response.ofFail();
	}

	@Override
	public Response<Log> load(int id) {
		Log record = logMapper.load(id);
		return Response.ofSuccess(record);
	}

	@Override
	public PageModel<LogDTO> pageList(int type, int module, String title, int offset, int pagesize) {
		// 分页查询
		List<Log> pageList = logMapper.pageList(type, module, title, offset, pagesize);
		int totalCount = logMapper.pageListCount(type, module, title, offset, pagesize);

		// 实体转 DTO（补充 IP 地理位置）
		List<LogDTO> pageListDTO = LogAdaptor.adaptor(pageList);

		PageModel<LogDTO> pageModel = new PageModel<>();
		pageModel.setData(pageListDTO);
		pageModel.setTotal(totalCount);
		return pageModel;
	}
}
