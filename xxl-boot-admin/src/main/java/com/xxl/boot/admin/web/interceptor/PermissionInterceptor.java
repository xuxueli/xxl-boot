package com.xxl.boot.admin.web.interceptor;

import com.xxl.boot.admin.annotation.Permission;
import com.xxl.boot.admin.model.dto.LoginUserDTO;
import com.xxl.boot.admin.model.dto.XxlBootResourceDTO;
import com.xxl.boot.admin.util.I18nUtil;
import com.xxl.boot.admin.service.impl.LoginService;
import com.xxl.tool.core.StringTool;
import com.xxl.tool.exception.BizException;
import com.xxl.tool.freemarker.FreemarkerTool;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.AsyncHandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.util.List;

/**
 * 权限拦截
 *
 * @author xuxueli 2015-12-12 18:09:04
 */
@Component
public class PermissionInterceptor implements AsyncHandlerInterceptor {

	@Resource
	private LoginService loginService;

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

		// handler method
		if (!(handler instanceof HandlerMethod)) {
			return true;	// proceed with the next interceptor
		}
		HandlerMethod method = (HandlerMethod)handler;

		// parse permission config
		Permission permission = method.getMethodAnnotation(Permission.class);
		if (permission == null) {
			throw new BizException("权限拦截，请求路径权限未设置");
		}
		if (!permission.login()) {
			return true;	// not need login ,not valid permission, pass
		}

		// valid login
		LoginUserDTO loginUser = loginService.checkLogin(request, response);
		if (loginUser == null) {
			response.setStatus(302);
			response.setHeader("location", request.getContextPath() + "/toLogin");
			return false;
		}
		LoginService.setLoginUser(request, loginUser);

		// valid permission
		if (StringTool.isBlank(permission.value())) {
			return true;	// permission empty, only need login，paas
		} else {
			if (loginUser.getPermissionList()!=null && loginUser.getPermissionList().contains(permission.value())) {
				return true;	// proceed with the next interceptor
			} else {
				throw new BizException(I18nUtil.getString("system_permission_limit"));
			}
		}

	}

	@Override
	public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView modelAndView) throws Exception {

		if (modelAndView != null) {
			// i18n, static method
			modelAndView.addObject("I18nUtil", FreemarkerTool.generateStaticModel(I18nUtil.class.getName()));

			// resource load
			LoginUserDTO loginUser = loginService.getLoginUser(request);
			if (loginUser != null) {

				// filter Authentication （by authorization）
				List<XxlBootResourceDTO> resourceList = loginService.queryAuthentication(loginUser.getId());
				modelAndView.addObject("resourceList", resourceList);
			}
		}

	}


}
