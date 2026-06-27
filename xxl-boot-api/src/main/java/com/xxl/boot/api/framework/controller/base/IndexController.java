package com.xxl.boot.api.framework.controller.base;

import com.xxl.boot.api.framework.util.I18nUtil;
import com.xxl.sso.core.annotation.XxlSso;
import com.xxl.tool.core.StringTool;
import com.xxl.tool.response.Response;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * index controller
 *
 * @author xuxueli 2015-12-19 16:13:16
 */
@RestController
public class IndexController {

    // ---------------------- index ----------------------

	@RequestMapping("/")
	@XxlSso(login = false)
	public String index() {
        return StringTool.format("Welcome to {0}  {1} ",
                I18nUtil.getString("admin_name_full"),
                I18nUtil.getString("admin_version")
        );
	}


	// ---------------------- default error page ----------------------

	@RequestMapping(value = "/errorpage")
	@XxlSso(login = false)
	public Response<String> errorPage(HttpServletResponse response) {
		String exceptionMsg = "Error, HTTP Status Code: "+response.getStatus();
		return Response.ofFail(exceptionMsg);
	}

	// ---------------------- other ----------------------

}
