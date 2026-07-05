package com.xxl.boot.admin.framework.controller.base;

import com.xxl.boot.admin.framework.constant.enums.MessageStatusEnum;
import com.xxl.boot.admin.framework.model.dto.LogDTO;
import com.xxl.boot.admin.framework.model.dto.MessageDTO;
import com.xxl.boot.admin.framework.model.dto.ResourceDTO;
import com.xxl.boot.admin.framework.model.dto.UserDTO;
import com.xxl.boot.admin.framework.service.LogService;
import com.xxl.boot.admin.framework.service.MessageService;
import com.xxl.boot.admin.framework.service.ResourceService;
import com.xxl.boot.admin.framework.service.UserService;
import com.xxl.sso.core.annotation.XxlSso;
import com.xxl.sso.core.helper.XxlSsoHelper;
import com.xxl.sso.core.model.LoginInfo;
import com.xxl.tool.core.CollectionTool;
import com.xxl.tool.response.PageModel;
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
	@Resource
	private MessageService messageService;
	@Resource
	private UserService userService;
	@Resource
	private LogService logService;


    // ---------------------- index ----------------------

	@RequestMapping("/")
	@XxlSso
	public String index(HttpServletRequest request, Model model) {

		// menu resource
		Response<LoginInfo> loginInfoResponse = XxlSsoHelper.loginCheckWithAttr(request);
		List<ResourceDTO> resourceList = resourceService.treeListByUserId(Integer.parseInt(loginInfoResponse.getData().getUserId()));
		model.addAttribute("resourceList", resourceList);

		return "/framework/base/index";
		/*return "redirect:/index";*/
	}


    // ---------------------- dashboard ----------------------

	@RequestMapping("/dashboard")
	@XxlSso
	public String dashboard(HttpServletRequest request, Model model) {

        // message
		PageModel<MessageDTO>  pageModel = messageService.pageList(MessageStatusEnum.NORMAL.getValue(), null, 0, 10);
		if (pageModel!=null && CollectionTool.isNotEmpty(pageModel.getData())) {
			List<MessageDTO> messageList = pageModel.getData();
			model.addAttribute("messageList", messageList);
		}
		// user total
		PageModel<UserDTO> userPageModel = userService.pageList(0, 1, null, -1, -1);
		int userTotal = userPageModel.getTotal();
		model.addAttribute("userTotal", userTotal);
		// log total
		PageModel<LogDTO> logPageModel = logService.pageList(-1, null, null, 0, 1);
		int logTotal = logPageModel.getTotal();
		model.addAttribute("logTotal", logTotal);


		return "/framework/base/dashboard";
	}


    // ---------------------- help ----------------------

	@RequestMapping("/help")
	@XxlSso
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
