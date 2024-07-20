package com.xxl.deep.admin.service.impl;

import com.xxl.deep.admin.dao.XxlDeepRoleMapper;
import com.xxl.deep.admin.model.XxlDeepRole;
import com.xxl.deep.admin.service.RoleService;
import com.xxl.tool.response.PageModel;
import com.xxl.tool.response.Response;
import com.xxl.tool.response.ResponseBuilder;
import org.springframework.stereotype.Service;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
* role service
*
* Created by xuxueli on '2024-07-21 02:06:59'.
*/
@Service
public class RoleServiceImpl implements RoleService {

	@Resource
	private XxlDeepRoleMapper xxlDeepRoleMapper;

	/**
    * 新增
    */
	@Override
	public Response<String> insert(XxlDeepRole xxlDeepRole) {

		// valid
		if (xxlDeepRole == null) {
			return new ResponseBuilder<String>().fail("必要参数缺失").build();
        }

		int ret = xxlDeepRoleMapper.insert(xxlDeepRole);
		return new ResponseBuilder<String>().success().build();
	}

	/**
	* 删除
	*/
	@Override
	public Response<String> delete(int id) {
		int ret = xxlDeepRoleMapper.delete(id);
		return ret>0? new ResponseBuilder<String>().success().build()
					: new ResponseBuilder<String>().fail().build() ;
	}

	/**
	* 更新
	*/
	@Override
	public Response<String> update(XxlDeepRole xxlDeepRole) {
		int ret = xxlDeepRoleMapper.update(xxlDeepRole);
		return ret>0? new ResponseBuilder<String>().success().build()
					: new ResponseBuilder<String>().fail().build() ;
	}

	/**
	* Load查询
	*/
	@Override
	public Response<XxlDeepRole> load(int id) {
		XxlDeepRole record = xxlDeepRoleMapper.load(id);
		return new ResponseBuilder<XxlDeepRole>().success(record).build();
	}

	/**
	* 分页查询
	*/
	@Override
	public PageModel<XxlDeepRole> pageList(int offset, int pagesize) {

		List<XxlDeepRole> pageList = xxlDeepRoleMapper.pageList(offset, pagesize);
		int totalCount = xxlDeepRoleMapper.pageListCount(offset, pagesize);

		// result
		Map<String, Object> result = new HashMap<String, Object>();
		result.put("pageList", pageList);
		result.put("totalCount", totalCount);

		// result
		PageModel<XxlDeepRole> pageModel = new PageModel<XxlDeepRole>();
		pageModel.setPageData(pageList);
		pageModel.setTotalCount(totalCount);

		return pageModel;
	}

}
