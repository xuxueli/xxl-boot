package com.xxl.boot.admin.framework.controller.base;

import com.xxl.boot.admin.framework.constant.enums.LogModuleEnum;
import com.xxl.boot.admin.framework.constant.enums.LogTypeEnum;
import com.xxl.boot.admin.framework.constant.enums.UserStatuEnum;
import com.xxl.boot.admin.framework.model.entity.XxlBootLog;
import com.xxl.boot.admin.framework.model.entity.XxlBootUser;
import com.xxl.boot.admin.framework.service.LogService;
import com.xxl.boot.admin.framework.service.UserService;
import com.xxl.boot.admin.framework.util.I18nUtil;
import com.xxl.boot.admin.framework.util.Ip2regionUtil;
import com.xxl.sso.core.annotation.XxlSso;
import com.xxl.sso.core.helper.XxlSsoHelper;
import com.xxl.sso.core.model.LoginInfo;
import com.xxl.tool.core.StringTool;
import com.xxl.tool.crypto.Sha256Tool;
import com.xxl.tool.id.UUIDTool;
import com.xxl.tool.response.Response;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.RedirectView;

/**
 * index controller
 * @author xuxueli 2015-12-19 16:13:16
 */
@Controller
@RequestMapping("/auth")
public class LoginController {


	@Resource
	private UserService userService;
	@Resource
	private LogService logService;


	@RequestMapping("/login")
	@XxlSso(login = false)
	public ModelAndView login(HttpServletRequest request, HttpServletResponse response, ModelAndView modelAndView) {

		// xxl-sso, logincheck (login-false, must check wiht cookie)
		Response<LoginInfo> loginInfoResponse = XxlSsoHelper.loginCheckWithCookie(request, response);

		if (loginInfoResponse.isSuccess()) {
			modelAndView.setView(new RedirectView("/",true,false));
			return modelAndView;
		}
		return new ModelAndView("/framework/base/login");
	}

	@RequestMapping(value="/doLogin", method=RequestMethod.POST)
	@ResponseBody
	@XxlSso(login=false)
	public Response<String> doLogin(HttpServletRequest request, HttpServletResponse response, String userName, String password, String ifRemember){

		// param
		boolean ifRem = StringTool.isNotBlank(ifRemember) && "on".equals(ifRemember);
		if (StringTool.isBlank(userName) || StringTool.isBlank(password)){
			return Response.ofFail( I18nUtil.getString("login_param_empty") );
		}

		// valid user, empty、status、passowrd
		Response<XxlBootUser> xxlBootUserResponse = userService.loadByUserName(userName);
		if (!xxlBootUserResponse.isSuccess()) {
			return Response.ofFail( I18nUtil.getString("login_param_unvalid") );
		}
		XxlBootUser xxlBootUser = xxlBootUserResponse.getData();
		if (xxlBootUser.getStatus() != UserStatuEnum.NORMAL.getStatus()) {
			return Response.ofFail( I18nUtil.getString("login_status_invalid") );
		}
		String passwordHash = Sha256Tool.sha256(password);
		if (!passwordHash.equals(xxlBootUser.getPassword())) {
			return Response.ofFail( I18nUtil.getString("login_param_unvalid") );
		}

		// xxl-sso, do login
		LoginInfo loginInfo = new LoginInfo(String.valueOf(xxlBootUser.getId()), UUIDTool.getSimpleUUID());
		// add log
		addLog(LogTypeEnum.LOGIN_LOG, LogModuleEnum.LOGIN, "系统登录", "登录成功",xxlBootUser.getUsername(), request);
		return XxlSsoHelper.loginWithCookie(loginInfo, response, ifRem);
	}
	
	@RequestMapping(value="/logout", method=RequestMethod.POST)
	@ResponseBody
	@XxlSso(login=false)
	public Response<String> logout(HttpServletRequest request, HttpServletResponse response){
		// xxl-sso, do logout
		return XxlSsoHelper.logoutWithCookie(request, response);
	}

	@RequestMapping("/updatePwd")
	@ResponseBody
	@XxlSso
	public Response<String> updatePwd(HttpServletRequest request, String oldPassword, String password){

		// xxl-sso, logincheck
		Response<LoginInfo> loginInfoResponse = XxlSsoHelper.loginCheckWithAttr(request);
		// add log
		addLog(LogTypeEnum.OPT_LOG, LogModuleEnum.USER, "修改密码", "修改密码成功", loginInfoResponse.getData().getUserName(), request);
		return userService.updatePwd(loginInfoResponse.getData().getUserName(), oldPassword, password);
	}

	/**
	 * add log
	 */
	private void addLog(LogTypeEnum logTypeEnum,
						LogModuleEnum logModuleEnum,
						String title,
						String content,
						String operator,
						HttpServletRequest request) {

		// param
		String ip = Ip2regionUtil.getIp(request);
		ip = ip!=null?ip:"";

		// build log
		XxlBootLog xxlBootLog = new XxlBootLog();
		xxlBootLog.setType(logTypeEnum.getCode());
		xxlBootLog.setModule(logModuleEnum.name());
		xxlBootLog.setTitle(title);
		xxlBootLog.setContent(content);
		xxlBootLog.setOperator(operator);
		xxlBootLog.setIp(ip);

		// write
		logService.insert(xxlBootLog);
	}

}
