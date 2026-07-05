package com.xxl.boot.admin.framework.service.impl;

import com.xxl.boot.admin.framework.mapper.OrgMapper;
import com.xxl.boot.admin.framework.model.entity.Org;
import com.xxl.boot.admin.framework.service.OrgService;
import com.xxl.tool.core.CollectionTool;
import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import java.util.*;

import com.xxl.tool.response.Response;
import com.xxl.tool.response.PageModel;

/**
* Org Service Impl
*
* Created by xuxueli on '2024-09-30 15:38:21'.
*/
@Service
public class OrgServiceImpl implements OrgService {

	@Resource
	private OrgMapper orgMapper;

	/**
    * 新增
    */
	@Override
	public Response<String> insert(Org xxlBootOrg) {

		// valid
		if (xxlBootOrg == null) {
			return Response.ofFail("必要参数缺失");
        }

		orgMapper.insert(xxlBootOrg);
		return Response.ofSuccess();
	}

	/**
	* 删除
	*/
	@Override
	public Response<String> delete(List<Integer> ids) {
		if (CollectionTool.isEmpty(ids)) {
			return Response.ofFail("请选择要删除的记录");
		}

		if (CollectionTool.isNotEmpty(orgMapper.queryByParentIds(ids))) {
			return Response.ofFail("存在子组织，禁止删除");
		}

		int ret = orgMapper.delete(ids);
		return ret>0? Response.ofSuccess() : Response.ofFail() ;
	}

	/**
	* 更新
	*/
	@Override
	public Response<String> update(Org xxlBootOrg) {
		int ret = orgMapper.update(xxlBootOrg);
		return ret>0? Response.ofSuccess() : Response.ofFail() ;
	}

	/**
	* Load查询
	*/
	@Override
	public Response<Org> load(int id) {
		Org record = orgMapper.load(id);
		return Response.ofSuccess(record);
	}

	/**
	* 分页查询
	*/
	@Override
	public PageModel<Org> pageList(int offset, int pagesize) {

		List<Org> pageList = orgMapper.pageList(offset, pagesize);
		int totalCount = orgMapper.pageListCount(offset, pagesize);

		// result
		PageModel<Org> pageModel = new PageModel<Org>();
		pageModel.setData(pageList);
		pageModel.setTotal(totalCount);

		return pageModel;
	}

	@Override
	public List<Org> treeList(String name, int status) {
		return orgMapper.queryOrg(name, status);
	}

}
