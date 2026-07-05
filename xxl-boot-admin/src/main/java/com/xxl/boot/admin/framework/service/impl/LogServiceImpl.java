package com.xxl.boot.admin.framework.service.impl;

import com.xxl.boot.admin.framework.mapper.LogMapper;
import com.xxl.boot.admin.framework.model.adaptor.LogAdaptor;
import com.xxl.boot.admin.framework.model.dto.LogDTO;
import com.xxl.boot.admin.framework.model.entity.Log;
import com.xxl.boot.admin.framework.service.LogService;
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

	/**
    * 新增
    */
	@Override
	public Response<String> insert(Log xxlBootLog) {

		// valid
		if (xxlBootLog == null) {
			return Response.ofFail("必要参数缺失");
        }

		logMapper.insert(xxlBootLog);
		return Response.ofSuccess();
	}

	/**
	* 删除
	*/
	@Override
	public Response<String> delete(List<Integer> ids) {
		int ret = logMapper.delete(ids);
		return ret>0? Response.ofSuccess() : Response.ofFail() ;
	}

	/**
	* 更新
	*/
	@Override
	public Response<String> update(Log xxlBootLog) {
		int ret = logMapper.update(xxlBootLog);
		return ret>0? Response.ofSuccess() : Response.ofFail() ;
	}

	/**
	* Load查询
	*/
	@Override
	public Response<Log> load(int id) {
		Log record = logMapper.load(id);
		return Response.ofSuccess(record);
	}

	/**
	* 分页查询
	*/
	@Override
	public PageModel<LogDTO> pageList(int type, String module, String title, int offset, int pagesize) {

		List<Log> pageList = logMapper.pageList(type, module, title, offset, pagesize);
		int totalCount = logMapper.pageListCount(type, module, title, offset, pagesize);

		List<LogDTO> pageListDTO = LogAdaptor.adaptor(pageList);

		// result
		PageModel<LogDTO> pageModel = new PageModel<>();
		pageModel.setData(pageListDTO);
		pageModel.setTotal(totalCount);

		return pageModel;
	}

}
