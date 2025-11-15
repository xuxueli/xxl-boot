package com.xxl.boot.admin.service.impl;

import com.xxl.boot.admin.mapper.RoleMapper;
import com.xxl.boot.admin.mapper.RoleResMapper;
import com.xxl.boot.admin.model.entity.XxlBootRole;
import com.xxl.boot.admin.model.entity.XxlBootRoleRes;
import com.xxl.boot.admin.service.RoleService;
import com.xxl.boot.admin.util.I18nUtil;
import com.xxl.tool.core.CollectionTool;
import com.xxl.tool.response.PageModel;
import com.xxl.tool.response.Response;
import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import java.util.List;
import java.util.stream.Collectors;

/**
* role service
*
* Created by xuxueli on '2024-07-21 02:06:59'.
*/
@Service
public class RoleServiceImpl implements RoleService {

	@Resource
	private RoleMapper roleMapper;
	@Resource
	private RoleResMapper roleResMapper;

	/**
    * 新增
    */
	@Override
	public Response<String> insert(XxlBootRole xxlBootRole) {

		// valid
		if (xxlBootRole == null) {
			return Response.ofFail("必要参数缺失");
        }

		int ret = roleMapper.insert(xxlBootRole);
		return Response.ofSuccess();
	}

	/**
	* 删除
	*/
	@Override
	public Response<String> deleteByIds(List<Integer> ids) {

		// valid
		if (CollectionTool.isEmpty(ids)) {
			return Response.ofFail(I18nUtil.getString("system_please_choose") + I18nUtil.getString("role_tips"));
		}
		List<XxlBootRoleRes> roleResList = roleResMapper.queryRoleRes(ids);
		if (CollectionTool.isNotEmpty(roleResList)) {
			return Response.ofFail("无法删除，请先取消关联资源");
		}

		int ret = roleMapper.deleteByIds(ids);
		return ret>0? Response.ofSuccess() : Response.ofFail();
	}

	/**
	* 更新
	*/
	@Override
	public Response<String> update(XxlBootRole xxlBootRole) {
		int ret = roleMapper.update(xxlBootRole);
		return ret>0? Response.ofSuccess() : Response.ofFail();
	}

	/**
	* Load查询
	*/
	@Override
	public Response<XxlBootRole> load(int id) {
		XxlBootRole record = roleMapper.load(id);
		return Response.ofSuccess(record);
	}

	/**
	* 分页查询
	*/
	@Override
	public PageModel<XxlBootRole> pageList(int offset, int pagesize, String name) {

		List<XxlBootRole> pageList = roleMapper.pageList(offset, pagesize, name);
		int totalCount = roleMapper.pageListCount(offset, pagesize, name);

		// result
		PageModel<XxlBootRole> pageModel = new PageModel<>();
		pageModel.setData(pageList);
		pageModel.setTotal(totalCount);

		return pageModel;
	}

	@Override
	public Response<List<Integer>> loadRoleRes(int roleId) {
		List<XxlBootRoleRes> roleResList = roleResMapper.loadRoleRes(roleId);
		if (CollectionTool.isEmpty(roleResList)) {
			return Response.ofSuccess();
		}

		List<Integer> resIds = roleResList
				.stream()
				.map(XxlBootRoleRes::getResId)
				.collect(Collectors.toList());
		return Response.ofSuccess(resIds);
	}

	@Override
	public Response<String> updateRoleRes(int roleId, List<Integer> resourceIds) {
		if (roleId < 1) {
			return Response.ofFail();
		}
		// remove old
		roleResMapper.deleteByRoleId(roleId);

		// init new
		if (CollectionTool.isNotEmpty(resourceIds)) {
			List<XxlBootRoleRes> roleResList = resourceIds
					.stream()
					.map(resId -> new XxlBootRoleRes(roleId, resId))
					.collect(Collectors.toList());
			int ret = roleResMapper.batchInsert(roleResList);
			System.out.println(ret);
		}

		return Response.ofSuccess();
	}

}
