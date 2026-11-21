package com.xxl.boot.api.framework.controller.base;

import com.xxl.boot.api.framework.model.dto.BaseConfigDTO;
import com.xxl.boot.api.framework.model.dto.MenuVO;
import com.xxl.boot.api.framework.model.entity.Config;
import com.xxl.boot.api.framework.service.ConfigService;
import com.xxl.boot.api.framework.service.ResourceService;
import com.xxl.boot.api.framework.util.I18nUtil;
import com.xxl.sso.core.annotation.XxlSso;
import com.xxl.sso.core.helper.XxlSsoHelper;
import com.xxl.sso.core.model.LoginInfo;
import com.xxl.tool.core.StringTool;
import com.xxl.tool.response.Response;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * index controller
 *
 * @author xuxueli 2015-12-19 16:13:16
 */
@RestController
public class IndexController {

	@Resource
	private ResourceService resourceService;

	@Resource
	private ConfigService configService;

    // ---------------------- index ----------------------

	@RequestMapping("/")
	@XxlSso(login = false)
	public String index() {
        return StringTool.format("Welcome to {0}  {1} ",
                I18nUtil.getString("admin_name_full"),
                I18nUtil.getString("admin_version")
        );
	}


	// ---------------------- loadBaseConfig ----------------------

	/**
	 * 加载系统基础配置
	 *
	 * 返回：界面语言（后端系统配置，本地缓存）、登录验证码开关
	 */
	@RequestMapping("/loadBaseConfig")
	@XxlSso(login = false)
	public Response<BaseConfigDTO> loadBaseConfig() {
		BaseConfigDTO baseConfigDTO = new BaseConfigDTO();
		baseConfigDTO.setLanguage(I18nUtil.getI18n());

		// 登录验证码开关：从系统配置中读取（配置Key：system.login.captcha.enabled，值为 true/false）
		Config captchaConfig = configService.loadByKeyWithCache("system.login.captcha.enabled").getData();
		baseConfigDTO.setCaptchaEnabled(captchaConfig != null && Boolean.parseBoolean(captchaConfig.getValue()));

		return Response.ofSuccess(baseConfigDTO);
	}


	// ---------------------- getMenus ----------------------

	/**
	 * 获取当前用户菜单树
	 *
	 * 仅返回纯业务菜单数据，路由与菜单结构由前端按自身 UI 库适配
	 */
	@RequestMapping("/getMenus")
	@XxlSso
	public Response<List<MenuVO>> getMenus(HttpServletRequest request) {

		// login check
		Response<LoginInfo> loginCheckResult = XxlSsoHelper.loginCheckWithAttr(request);

		// query user menu tree
		int userId = Integer.parseInt(loginCheckResult.getData().getUserId());
		return Response.ofSuccess(resourceService.queryMenuTreeByUserId(userId));
	}


	// ---------------------- default error page ----------------------

	@RequestMapping(value = "/errorpage")
	@XxlSso(login = false)
	public Response<String> errorPage(HttpServletResponse response) {
		String exceptionMsg = "Error, HTTP Status Code: "+response.getStatus();
		return Response.ofFail(exceptionMsg);
	}

}
