package com.xxl.boot.api.framework.service.impl;

import com.xxl.boot.api.framework.mapper.RoleMapper;
import com.xxl.boot.api.framework.mapper.RoleResMapper;
import com.xxl.boot.api.framework.model.entity.Role;
import com.xxl.boot.api.framework.model.entity.RoleRes;
import com.xxl.boot.api.framework.service.RoleService;
import com.xxl.boot.api.framework.util.I18nUtil;
import com.xxl.tool.core.CollectionTool;
import com.xxl.tool.response.PageModel;
import com.xxl.tool.response.Response;
import jakarta.annotation.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

/**
* role service
*
* Created by xuxueli on '2024-07-21 02:06:59'.
*/
@Service
public class RoleServiceImpl implements RoleService {
	private static final Logger logger = LoggerFactory.getLogger(RoleServiceImpl.class);

	@Resource
	private RoleMapper roleMapper;
	@Resource
	private RoleResMapper roleResMapper;

	/**
    * 新增
    */
	@Override
	public Response<String> insert(Role xxlBootRole) {

		// valid
		if (xxlBootRole == null) {
			return Response.ofFail("必要参数缺失");
        }
		if (xxlBootRole.getName() == null || xxlBootRole.getName().trim().isEmpty()) {
			return Response.ofFail(I18nUtil.getString("system_please_input") + I18nUtil.getString("role_name"));
		}
		if (xxlBootRole.getCode() == null || xxlBootRole.getCode().trim().isEmpty()) {
			return Response.ofFail(I18nUtil.getString("system_please_input") + I18nUtil.getString("role_code"));
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
		List<RoleRes> roleResList = roleResMapper.queryRoleRes(ids);
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
	public Response<String> update(Role xxlBootRole) {
		if (xxlBootRole.getName() == null || xxlBootRole.getName().trim().isEmpty()) {
			return Response.ofFail(I18nUtil.getString("system_please_input") + I18nUtil.getString("role_name"));
		}
		if (xxlBootRole.getCode() == null || xxlBootRole.getCode().trim().isEmpty()) {
			return Response.ofFail(I18nUtil.getString("system_please_input") + I18nUtil.getString("role_code"));
		}
		int ret = roleMapper.update(xxlBootRole);
		return ret>0? Response.ofSuccess() : Response.ofFail();
	}

	/**
	* Load查询
	*/
	@Override
	public Response<Role> load(int id) {
		Role record = roleMapper.load(id);
		return Response.ofSuccess(record);
	}

	/**
	* 分页查询
	*/
	@Override
	public PageModel<Role> pageList(int offset, int pagesize, String name, int status) {

		List<Role> pageList = roleMapper.pageList(offset, pagesize, name, status);
		int totalCount = roleMapper.pageListCount(offset, pagesize, name, status);

		// result
		PageModel<Role> pageModel = new PageModel<>();
		pageModel.setData(pageList);
		pageModel.setTotal(totalCount);

		return pageModel;
	}

	@Override
	public Response<List<Integer>> loadRoleRes(int roleId) {
		List<RoleRes> roleResList = roleResMapper.loadRoleRes(roleId);
		if (CollectionTool.isEmpty(roleResList)) {
			return Response.ofSuccess();
		}

		List<Integer> resIds = roleResList
				.stream()
				.map(RoleRes::getResId)
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
			List<RoleRes> roleResList = resourceIds
					.stream()
					.map(resId -> new RoleRes(roleId, resId))
					.collect(Collectors.toList());
			int ret = roleResMapper.batchInsert(roleResList);
			logger.info("updateRoleRes roleId:{}, resourceIds:{}, ret:{}", roleId, resourceIds, ret);
		}

		return Response.ofSuccess();
	}

	@Override
	public List<Role> queryRoleByUserid(int userId) {
		return roleMapper.queryByUserid(userId);
	}

}
