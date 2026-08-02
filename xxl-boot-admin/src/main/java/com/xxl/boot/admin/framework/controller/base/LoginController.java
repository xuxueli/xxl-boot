package com.xxl.boot.admin.framework.controller.base;

import com.xxl.boot.admin.framework.constant.enums.LogModuleEnum;
import com.xxl.boot.admin.framework.constant.enums.LogTypeEnum;
import com.xxl.boot.admin.framework.constant.enums.UserStatuEnum;
import com.xxl.boot.admin.framework.model.entity.Log;
import com.xxl.boot.admin.framework.model.entity.User;
import com.xxl.boot.admin.framework.service.UserService;
import com.xxl.boot.admin.framework.util.I18nUtil;
import com.xxl.boot.admin.framework.util.Ip2regionUtil;
import com.xxl.boot.admin.framework.web.xxllog.XxlLogQueueHelper;
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
 * 登录认证 Controller，处理登录、登出、修改密码
 *
 * @author xuxueli 2015-12-19
 */
@Controller
@RequestMapping("/auth")
public class LoginController {


	@Resource
	private UserService userService;
	@Resource
	private XxlLogQueueHelper logQueueHelper;


	/**
	 * 登录页面
	 */
	@RequestMapping("/login")
	@XxlSso(login = false)
	public ModelAndView login(HttpServletRequest request, HttpServletResponse response, ModelAndView modelAndView) {

		// xxl-sso, logincheck (login-false, must check wiht cookie)
		Response<LoginInfo> loginInfoResponse = XxlSsoHelper.loginCheckWithCookie(request, response);

		// 已登录则重定向到首页
		if (loginInfoResponse.isSuccess()) {
			modelAndView.setView(new RedirectView("/",true,false));
			return modelAndView;
		}
		return new ModelAndView("/framework/base/login");
	}

	/**
	 * 执行登录
	 */
	@RequestMapping(value="/doLogin", method=RequestMethod.POST)
	@ResponseBody
	@XxlSso(login=false)
	public Response<String> doLogin(HttpServletRequest request, HttpServletResponse response, String userName, String password, String ifRemember){

		// 是否记住密码
		boolean ifRem = StringTool.isNotBlank(ifRemember) && "on".equals(ifRemember);

		// 参数为空校验
		if (StringTool.isBlank(userName) || StringTool.isBlank(password)){
			return Response.ofFail( I18nUtil.getString("login_param_empty") );
		}

		// 校验用户是否存在
		Response<User> xxlBootUserResponse = userService.loadByUserName(userName);
		if (!xxlBootUserResponse.isSuccess()) {
			return Response.ofFail( I18nUtil.getString("login_param_unvalid") );
		}
		User xxlBootUser = xxlBootUserResponse.getData();

		// 校验用户状态
		if (xxlBootUser.getStatus() != UserStatuEnum.NORMAL.getCode()) {
			return Response.ofFail( I18nUtil.getString("login_status_invalid") );
		}

		// 校验密码
		String passwordHash = Sha256Tool.sha256(password);
		if (!passwordHash.equals(xxlBootUser.getPassword())) {
			return Response.ofFail( I18nUtil.getString("login_param_unvalid") );
		}

		// SSO 登录
		LoginInfo loginInfo = new LoginInfo(String.valueOf(xxlBootUser.getId()), UUIDTool.getSimpleUUID());
		// 添加登录日志
		addLog(LogTypeEnum.LOGIN_LOG, LogModuleEnum.LOGIN, "系统登录", "登录成功",xxlBootUser.getUsername(), request);
		return XxlSsoHelper.loginWithCookie(loginInfo, response, ifRem);
	}
	
	/**
	 * 注销登录
	 */
	@RequestMapping(value="/logout", method=RequestMethod.POST)
	@ResponseBody
	@XxlSso(login=false)
	public Response<String> logout(HttpServletRequest request, HttpServletResponse response){
		return XxlSsoHelper.logoutWithCookie(request, response);
	}

	/**
	 * 修改密码
	 */
	@RequestMapping("/updatePwd")
	@ResponseBody
	@XxlSso
	public Response<String> updatePwd(HttpServletRequest request, String oldPassword, String password){

		// 获取当前登录用户
		Response<LoginInfo> loginInfoResponse = XxlSsoHelper.loginCheckWithAttr(request);
		// 添加操作日志
		addLog(LogTypeEnum.OPT_LOG, LogModuleEnum.USER, "修改密码", "修改密码成功", loginInfoResponse.getData().getUserName(), request);
		return userService.updatePwd(loginInfoResponse.getData().getUserName(), oldPassword, password);
	}

	/**
	 * 添加日志（同步方式）
	 */
	private void addLog(LogTypeEnum logTypeEnum,
						LogModuleEnum logModuleEnum,
						String title,
						String content,
						String operator,
						HttpServletRequest request) {

		// 获取客户端 IP
		String ip = Ip2regionUtil.getIp(request);
		ip = ip!=null?ip:"";

		// 构建日志实体
		Log xxlBootLog = new Log();
		xxlBootLog.setType(logTypeEnum.getCode());
		xxlBootLog.setModule(logModuleEnum.getCode());
		xxlBootLog.setTitle(title);
		xxlBootLog.setContent(content);
		xxlBootLog.setOperator(operator);
		xxlBootLog.setIp(ip);

		// 推入消息队列异步写入
		logQueueHelper.push(xxlBootLog);
	}

}
