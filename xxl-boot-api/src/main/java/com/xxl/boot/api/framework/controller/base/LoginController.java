package com.xxl.boot.api.framework.controller.base;

import com.xxl.boot.api.framework.constant.consts.Consts;
import com.xxl.boot.api.framework.constant.enums.LogModuleEnum;
import com.xxl.boot.api.framework.constant.enums.LogTypeEnum;
import com.xxl.boot.api.framework.constant.enums.UserStatuEnum;
import com.xxl.boot.api.framework.model.dto.CaptchaDTO;
import com.xxl.boot.api.framework.model.dto.LoginRequest;
import com.xxl.boot.api.framework.model.entity.Config;
import com.xxl.boot.api.framework.model.entity.Log;
import com.xxl.boot.api.framework.model.entity.Role;
import com.xxl.boot.api.framework.model.entity.User;
import com.xxl.boot.api.framework.service.ConfigService;
import com.xxl.boot.api.framework.service.ResourceService;
import com.xxl.boot.api.framework.service.RoleService;
import com.xxl.boot.api.framework.service.UserService;
import com.xxl.boot.api.framework.util.I18nUtil;
import com.xxl.boot.api.framework.util.Ip2regionUtil;
import com.xxl.boot.api.framework.util.RedisCacheUtil;
import com.xxl.boot.api.framework.web.xxllog.XxlLogQueueHelper;
import com.xxl.sso.core.annotation.XxlSso;
import com.xxl.sso.core.helper.XxlSsoHelper;
import com.xxl.sso.core.model.LoginInfo;
import com.xxl.sso.core.token.TokenHelper;
import com.xxl.tool.captcha.CaptchaTool;
import com.xxl.tool.core.CollectionTool;
import com.xxl.tool.core.StringTool;
import com.xxl.tool.crypto.Sha256Tool;
import com.xxl.tool.id.RandomIdTool;
import com.xxl.tool.id.UUIDTool;
import com.xxl.tool.response.Response;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

/**
 * 登录认证 Controller
 * 
 * @author xuxueli 2024-01-01
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
	@Resource
	private XxlLogQueueHelper logQueueHelper;
	@Resource
	private RedisCacheUtil redisCacheUtil;
	@Resource
	private ConfigService configService;


	/**
	 * Login
	 */
	@RequestMapping("/login")
	@XxlSso(login = false)
	/*@ResponseBody*/
	public Response<String> login(@RequestBody(required = false) LoginRequest loginRequest, HttpServletRequest request) {
		// base valid
		if (loginRequest == null) {
			return Response.ofFail("username or password is invalid.");
		}

		// valid captcha
		if (isCaptchaEnabled()) {
			if (StringTool.isBlank(loginRequest.getCaptchaUuid())) {
				return Response.ofFail("验证码为空");
			}
			String captchaResult = redisCacheUtil.getObject(Consts.getLoginCaptchaKey(loginRequest.getCaptchaUuid()));
			if (StringTool.isBlank(captchaResult) || !captchaResult.equals(loginRequest.getCaptchaResult())) {
				return Response.ofFail("验证码非法");
			}
		}

		// 1、verify login user, include userName, password, status
		Response<User> userResponse = userService.loadByUserName(loginRequest.getUsername());
		if (!userResponse.isSuccess()) {
			return Response.ofFail( I18nUtil.getString("login_param_unvalid") );
		}
		User xxlBootUser = userResponse.getData();
		if (xxlBootUser.getStatus() != UserStatuEnum.NORMAL.getCode()) {
			return Response.ofFail( I18nUtil.getString("login_status_invalid") );
		}
		String passwordHash = Sha256Tool.sha256(loginRequest.getPassword());
		if (!passwordHash.equals(xxlBootUser.getPassword())) {
			return Response.ofFail( I18nUtil.getString("login_param_unvalid") );
		}

		// 2、find permission + role
		List<com.xxl.boot.api.framework.model.entity.Resource> resourceList = resourceService.queryResourceByUserid(xxlBootUser.getId(), -1);
		List<String> permissions = CollectionTool.isNotEmpty(resourceList) ?
				resourceList.stream()
						.map(com.xxl.boot.api.framework.model.entity.Resource::getPermission)
						.collect(Collectors.toCollection(ArrayList::new)) :
				new ArrayList<>();

		List<Role> roleList = roleService.queryRoleByUserid(xxlBootUser.getId());
		List<String> roles = CollectionTool.isNotEmpty(roleList) ?
				roleList.stream()
						.map(Role::getCode)
						.collect(Collectors.toCollection(ArrayList::new)) :
				new ArrayList<>();

		// 3、build LoginInfo
		LoginInfo loginInfo = new LoginInfo(
				String.valueOf(xxlBootUser.getId()),
				xxlBootUser.getUsername(),
				xxlBootUser.getRealName(),
				null,
				roles,
				permissions,
				-1,
				UUIDTool.getSimpleUUID());

		// 4、login (write store)
		Response<String> loginResult = XxlSsoHelper.login(loginInfo);
		if (!loginResult.isSuccess()) {
			return loginResult;
		}
		// add log
		addLog(LogTypeEnum.LOGIN_LOG, LogModuleEnum.LOGIN, "系统登录", "登录成功",xxlBootUser.getUsername(), request);

		// response
		String token = loginResult.getData();
		return Response.ofSuccess(token);
	}


	/**
	 * CaptchaTool
	 */
	private static CaptchaTool captchaTool;
	static {
		captchaTool = CaptchaTool
				.build()
				.setTextCreator(new CaptchaTool.ArithmeticTextCreator())
				.setNoiseColor(Color.GRAY);
	}

	/**
	 * captcha
	 */
	@RequestMapping("/captcha")
	@XxlSso(login = false)
	public Response<CaptchaDTO> captcha(){

		// build response
		CaptchaDTO captchaDTO = new CaptchaDTO();
		captchaDTO.setEnable(isCaptchaEnabled());

		// valid switch
		if (!captchaDTO.isEnable()) {
			return Response.ofSuccess(captchaDTO);
		}

		// 1、generate captcha text
		CaptchaTool.TextResult textResult = captchaTool.createText();

		// 2、generate captcha image, and convert to base64
		BufferedImage image = captchaTool.createImage(textResult);
		String base64Image = null;
		try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
			ImageIO.write(image, "png", baos);
			byte[] imageBytes = baos.toByteArray();
			base64Image = Base64.getEncoder().encodeToString(imageBytes);
		} catch (IOException e) {
			return Response.ofFail("Failed to generate captcha image, error: " + e.getMessage());
		}
		base64Image = "data:image/png;base64," + base64Image;

		// 3、store captcha result
		String uuid = RandomIdTool.getAlphaNumeric();
		String result = textResult.getResult();
		redisCacheUtil.setObject(Consts.getLoginCaptchaKey(uuid), result, 3, TimeUnit.MINUTES);

		// 4、build response
		captchaDTO.setUuid(uuid);
		captchaDTO.setImage(base64Image);

		return Response.ofSuccess(captchaDTO);
	}

	/**
	 * 登录验证码开关：从系统配置中读取（配置Key：system.login.captcha.enabled，值为 true/false）
	 */
	private boolean isCaptchaEnabled() {
		Config config = configService.loadByKey("system.login.captcha.enabled").getData();
		return config != null && Boolean.parseBoolean(config.getValue());
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

		// todo, will replace by new version
		// get header
		String token = request.getHeader(XxlSsoHelper.getInstance().getTokenKey());
		if (StringTool.isBlank(token)) {
			return Response.ofSuccess();    // not login; no need to logout.
		}
		// parse token
		LoginInfo loginInfoForToken = TokenHelper.parseToken(token);
		if (loginInfoForToken == null) {
			return Response.ofSuccess();			// invalid token; no need to logout.
		}

		// do logout
		return XxlSsoHelper.logout(token);
	}

	/**
	 * loginCheck
	 */
	@RequestMapping("/loginCheck")
	@XxlSso
	public Response<LoginInfo> loginCheck(HttpServletRequest request) {
		// login check
		return XxlSsoHelper.loginCheckWithAttr(request);
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
		Log xxlBootLog = new Log();
		xxlBootLog.setType(logTypeEnum.getCode());
		xxlBootLog.setModule(logModuleEnum.getCode());
		xxlBootLog.setTitle(title);
		xxlBootLog.setContent(content);
		xxlBootLog.setOperator(operator);
		xxlBootLog.setIp(ip);

		// write
		logQueueHelper.push(xxlBootLog);
	}

}
