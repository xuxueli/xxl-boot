package com.xxl.boot.api.framework.controller.base;

import com.xxl.boot.api.framework.constant.enums.UserStatuEnum;
import com.xxl.boot.api.framework.model.dto.LoginRequest;
import com.xxl.boot.api.framework.model.entity.XxlBootResource;
import com.xxl.boot.api.framework.model.entity.XxlBootRole;
import com.xxl.boot.api.framework.model.entity.XxlBootUser;
import com.xxl.boot.api.framework.service.ResourceService;
import com.xxl.boot.api.framework.service.RoleService;
import com.xxl.boot.api.framework.service.UserService;
import com.xxl.boot.api.framework.util.I18nUtil;
import com.xxl.sso.core.annotation.XxlSso;
import com.xxl.sso.core.helper.XxlSsoHelper;
import com.xxl.sso.core.model.LoginInfo;
import com.xxl.tool.core.CollectionTool;
import com.xxl.tool.core.StringTool;
import com.xxl.tool.crypto.Sha256Tool;
import com.xxl.tool.id.UUIDTool;
import com.xxl.tool.response.Response;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

/**
 * index controller
 *
 * @author xuxueli 2015-12-19 16:13:16
 */
@RestController
@RequestMapping("/auth")
public class LoginController {


	@Resource
	private UserService userService;
	@Resource
	private ResourceService resourceService;
	@Resource
	private RoleService roleService;


	/**
	 * Login
	 */
	@RequestMapping("/login")
	@XxlSso(login = false)
	public Response<String> login(@RequestBody(required = false) LoginRequest loginRequest) {
		// base valid
		if (loginRequest == null) {
			return Response.ofFail("username or password is invalid.");
		}

		// 1、verify login user, include userName, password, status
		Response<XxlBootUser> xxlBootUserResponse = userService.loadByUserName(loginRequest.getUsername());
		if (!xxlBootUserResponse.isSuccess()) {
			return Response.ofFail( I18nUtil.getString("login_param_unvalid") );
		}
		XxlBootUser xxlBootUser = xxlBootUserResponse.getData();
		if (xxlBootUser.getStatus() != UserStatuEnum.NORMAL.getStatus()) {
			return Response.ofFail( I18nUtil.getString("login_status_invalid") );
		}
		String passwordHash = Sha256Tool.sha256(loginRequest.getPassword());
		if (!passwordHash.equals(xxlBootUser.getPassword())) {
			return Response.ofFail( I18nUtil.getString("login_param_unvalid") );
		}

		// 2、find permission + role
		List<XxlBootResource> resourceList = resourceService.queryResourceByUserid(xxlBootUser.getId());
		List<String> permissions = CollectionTool.isNotEmpty(resourceList) ?
				resourceList.stream().map(XxlBootResource::getPermission).toList() :
				new ArrayList<>();

		List<XxlBootRole> roleList = roleService.queryRoleByUserid(xxlBootUser.getId());
		List<String> roleIds = CollectionTool.isNotEmpty(roleList) ?
				roleList.stream().map(XxlBootRole::getName).toList() :		// TODO, change 角色Code
				new ArrayList<>();

		// 3、build LoginInfo
		LoginInfo loginInfo = new LoginInfo(
				String.valueOf(xxlBootUser.getId()),
				xxlBootUser.getUsername(),
				xxlBootUser.getRealName(),
				null,
				roleIds,
				permissions,
				-1,
				UUIDTool.getSimpleUUID());

		// 4、login (write store)
		Response<String> loginResult = XxlSsoHelper.login(loginInfo);
		if (!loginResult.isSuccess()) {
			return loginResult;
		}
		String token = loginResult.getData();
		return Response.ofSuccess(token);
	}

	/**
	 * Logout
	 */
	@RequestMapping("/logout")
	@XxlSso(login = false)
	public Response<String> logout(HttpServletRequest request) {
		return logoutWithHeader(request);
	}

	/**
	 * logout with header
	 */
	private static Response<String> logoutWithHeader(HttpServletRequest request) {

		// get header
		String token = request.getHeader(XxlSsoHelper.getInstance().getTokenKey());
		if (StringTool.isBlank(token)) {
			return Response.ofSuccess();    // not login; no need to logout.
		}

		// do logout
		return XxlSsoHelper.logout(token);
	}

	/**
	 * loginCheck
	 */
	@RequestMapping("/logincheck")
	@XxlSso
	public Response<LoginInfo> logincheck(HttpServletRequest request) {
		// login check
		return XxlSsoHelper.loginCheckWithAttr(request);
	}


	/**
	 * updatePwd
	 */
	@RequestMapping("/updatePwd")
	@ResponseBody
	@XxlSso
	public Response<String> updatePwd(HttpServletRequest request, String oldPassword, String password){

		// login check
		Response<LoginInfo> loginInfoResponse = XxlSsoHelper.loginCheckWithAttr(request);

		return userService.updatePwd(loginInfoResponse.getData().getUserName(), oldPassword, password);
	}

}
