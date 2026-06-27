package com.xxl.boot.api.framework.controller.base;

import com.xxl.boot.api.framework.constant.enums.MessageStatusEnum;
import com.xxl.boot.api.framework.model.dto.XxlBootMessageDTO;
import com.xxl.boot.api.framework.model.dto.XxlBootResourceDTO;
import com.xxl.boot.api.framework.service.MessageService;
import com.xxl.boot.api.framework.service.ResourceService;
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
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

/**
 * index controller
 *
 * @author xuxueli 2015-12-19 16:13:16
 */
@RestController
public class IndexController {


	@Resource
	private MessageService messageService;
	@Resource
	private ResourceService resourceService;


    // ---------------------- index ----------------------

	@RequestMapping("/")
	@XxlSso
	public String index(HttpServletRequest request, Model model) {

		// menu resource
		Response<LoginInfo> loginInfoResponse = XxlSsoHelper.loginCheckWithAttr(request);
		List<XxlBootResourceDTO> resourceList = resourceService.treeListByUserId(Integer.parseInt(loginInfoResponse.getData().getUserId()));
		model.addAttribute("resourceList", resourceList);

		return "/framework/base/index";
	}


    // ---------------------- dashboard ----------------------

	@RequestMapping("/dashboard")
	@XxlSso
	public String dashboard(HttpServletRequest request, Model model) {

        // message
		PageModel<XxlBootMessageDTO>  pageModel = messageService.pageList(MessageStatusEnum.NORMAL.getValue(), null, 0, 10);
		if (pageModel!=null && CollectionTool.isNotEmpty(pageModel.getData())) {
			List<XxlBootMessageDTO> messageList = pageModel.getData();
			model.addAttribute("messageList", messageList);
		}

		return "/framework/base/dashboard";
	}


    // ---------------------- help ----------------------

	@InitBinder
	public void initBinder(WebDataBinder binder) {
		SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		dateFormat.setLenient(false);
		binder.registerCustomEditor(Date.class, new CustomDateEditor(dateFormat, true));
	}
	
}
