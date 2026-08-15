package com.xxl.boot.admin.framework.controller.base;

import com.xxl.boot.admin.framework.model.dto.ResourceDTO;
import com.xxl.boot.admin.framework.service.ResourceService;
import com.xxl.sso.core.annotation.XxlSso;
import com.xxl.sso.core.helper.XxlSsoHelper;
import com.xxl.sso.core.model.LoginInfo;
import com.xxl.tool.response.Response;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * index controller
 * @author xuxueli 2015-12-19 16:13:16
 */
@Controller
public class IndexController {


	@Resource
	private ResourceService resourceService;


    // ---------------------- index ----------------------

	@RequestMapping("/")
	@XxlSso
	public String index(HttpServletRequest request, Model model) {

		// menu resource
		Response<LoginInfo> loginInfoResponse = XxlSsoHelper.loginCheckWithAttr(request);
		List<ResourceDTO> resourceList = resourceService.treeListByUserId(Integer.parseInt(loginInfoResponse.getData().getUserId()), 0);
		model.addAttribute("resourceList", resourceList);

		return "/framework/base/index";
		/*return "redirect:/index";*/
	}


    // ---------------------- help ----------------------

	@RequestMapping("/help")
	@XxlSso(permission = "help")
	public String help() {
		return "/framework/base/help";
	}

	@RequestMapping(value = "/errorpage")
	@XxlSso(login = false)
	public ModelAndView errorPage(HttpServletRequest request, HttpServletResponse response, ModelAndView mv) {

		String exceptionMsg = "HTTP Status Code: "+response.getStatus();

		mv.addObject("exceptionMsg", exceptionMsg);
		mv.setViewName("/framework/common/common.errorpage");
		return mv;
	}

	@InitBinder
	public void initBinder(WebDataBinder binder) {
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		dateFormat.setLenient(false);
		binder.registerCustomEditor(Date.class, new CustomDateEditor(dateFormat, true));
	}
	
}
