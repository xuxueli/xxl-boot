package com.xxl.boot.admin.plugin.ai.service.impl;

import com.xxl.boot.admin.plugin.ai.mapper.KbInfoMapper;
import com.xxl.boot.admin.plugin.ai.model.KbInfo;
import com.xxl.boot.admin.plugin.ai.service.KbInfoService;
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
* KbInfo Service Impl
*
* Created by xuxueli on '2026-03-08 09:39:11'.
*/
@Service
public class KbInfoServiceImpl implements KbInfoService {

	@Resource
	private KbInfoMapper kbInfoMapper;

	/**
    * 新增
    */
	@Override
	public Response<String> insert(KbInfo kbInfo) {

		// valid
		if (kbInfo == null) {
			return Response.ofFail("必要参数缺失");
        }
		if (StringTool.isBlank(kbInfo.getKbName()) || StringTool.isBlank(kbInfo.getKbDesc())) {
			return Response.ofFail("必要参数缺失[1]");
		}

		kbInfoMapper.insert(kbInfo);
		return Response.ofSuccess();
	}

	/**
	* 删除
	*/
	@Override
	public Response<String> delete(List<Integer> ids) {
		int ret = kbInfoMapper.delete(ids);
			return ret>0? Response.ofSuccess() : Response.ofFail() ;
	}

	/**
	* 更新
	*/
	@Override
	public Response<String> update(KbInfo kbInfo) {

		// valid
		if (kbInfo == null || kbInfo.getId() < 1) {
			return Response.ofFail("必要参数缺失");
		}
		if (StringTool.isBlank(kbInfo.getKbName()) || StringTool.isBlank(kbInfo.getKbDesc())) {
			return Response.ofFail("必要参数缺失[1]");
		}

		int ret = kbInfoMapper.update(kbInfo);
		return ret>0? Response.ofSuccess() : Response.ofFail() ;
	}

	/**
	* Load查询
	*/
	@Override
	public Response<KbInfo> load(long id) {
		KbInfo record = kbInfoMapper.load(id);
		return Response.ofSuccess(record);
	}

	/**
	* 分页查询
	*/
	@Override
	public PageModel<KbInfo> pageList(String kbName, int offset, int pagesize) {

		List<KbInfo> pageList = kbInfoMapper.pageList(kbName, offset, pagesize);
		int totalCount = kbInfoMapper.pageListCount(kbName, offset, pagesize);

		// result
		PageModel<KbInfo> pageModel = new PageModel<KbInfo>();
		pageModel.setData(pageList);
		pageModel.setTotal(totalCount);

		return pageModel;
	}

}
