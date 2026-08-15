package com.xxl.boot.admin.framework.controller.base;

import com.xxl.boot.admin.framework.constant.enums.MessageStatusEnum;
import com.xxl.boot.admin.framework.model.dto.LogDTO;
import com.xxl.boot.admin.framework.model.dto.MessageDTO;
import com.xxl.boot.admin.framework.model.dto.UserDTO;
import com.xxl.boot.admin.framework.model.entity.Role;
import com.xxl.boot.admin.framework.service.LogService;
import com.xxl.boot.admin.framework.service.MessageService;
import com.xxl.boot.admin.framework.service.RoleService;
import com.xxl.boot.admin.framework.service.UserService;
import com.xxl.sso.core.annotation.XxlSso;
import com.xxl.tool.core.CollectionTool;
import com.xxl.tool.response.PageModel;
import com.xxl.tool.response.Response;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import java.util.Map;

/**
 * dashboard controller
 *
 * @author xuxueli 2026-08-15
 */
@Controller
@RequestMapping("/dashboard")
public class DashboardController {

	@Resource
	private MessageService messageService;
	@Resource
	private UserService userService;
	@Resource
	private RoleService roleService;
	@Resource
	private LogService logService;


	// ---------------------- dashboard ----------------------

	/**
	 * 首页仪表盘：指标统计 + 站内消息
	 */
	@RequestMapping
	@XxlSso
	public String index(Model model) {

		// message
		PageModel<MessageDTO> pageModel = messageService.pageList(MessageStatusEnum.NORMAL.getCode(), null, 0, 10);
		if (pageModel != null && CollectionTool.isNotEmpty(pageModel.getData())) {
			List<MessageDTO> messageList = pageModel.getData();
			model.addAttribute("messageList", messageList);
		}

		// user total
		PageModel<UserDTO> userPageModel = userService.pageList(0, 1, null, -1, -1);
		int userTotal = userPageModel.getTotal();
		model.addAttribute("userTotal", userTotal);
		// role total
		PageModel<Role> rolePageModel = roleService.pageList(0, 1, null, -1);
		int roleTotal = rolePageModel.getTotal();
		model.addAttribute("roleTotal", roleTotal);
		// message total
		PageModel<MessageDTO> messageTotalPageModel = messageService.pageList(-1, null, 0, 1);
		int messageTotal = messageTotalPageModel.getTotal();
		model.addAttribute("messageTotal", messageTotal);
		// log total
		PageModel<LogDTO> logPageModel = logService.pageList(-1, 0, null, 0, 1);
		int logTotal = logPageModel.getTotal();
		model.addAttribute("logTotal", logTotal);


		return "/framework/base/dashboard";
	}

	/**
	 * 日志趋势图表数据
	 */
	@RequestMapping("/logTrend")
	@ResponseBody
	@XxlSso
	public Response<List<Map<String, Object>>> logTrend(@RequestParam(defaultValue = "30") int days) {

		// 天数参数校验
		if (days <= 0 || days > 30) {
			days = 30;
		}
		List<Map<String, Object>> list = logService.trendList(days);
		return Response.ofSuccess(list);
	}

}
