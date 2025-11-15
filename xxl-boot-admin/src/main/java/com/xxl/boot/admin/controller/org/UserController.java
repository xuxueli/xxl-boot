package com.xxl.boot.admin.controller.org;

import com.xxl.boot.admin.annotation.Log;
import com.xxl.boot.admin.constant.enums.LogModuleEnum;
import com.xxl.boot.admin.constant.enums.LogTypeEnum;
import com.xxl.boot.admin.constant.enums.UserStatuEnum;
import com.xxl.boot.admin.model.dto.XxlBootUserDTO;
import com.xxl.boot.admin.model.entity.XxlBootRole;
import com.xxl.boot.admin.service.RoleService;
import com.xxl.boot.admin.service.UserService;
import com.xxl.sso.core.annotation.XxlSso;
import com.xxl.sso.core.helper.XxlSsoHelper;
import com.xxl.sso.core.model.LoginInfo;
import com.xxl.tool.response.PageModel;
import com.xxl.tool.response.Response;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * @author xuxueli 2019-05-04 16:39:50
 */
@Controller
@RequestMapping("/org/user")
public class UserController {

    @Resource
    private UserService userService;
    @Resource
    private RoleService roleService;

    @RequestMapping
    @XxlSso(permission = "org:user")
    public String index(Model model) {

        PageModel<XxlBootRole> pageModel = roleService.pageList(0, 999, null);

        model.addAttribute("roleList", pageModel.getData());
        model.addAttribute("userStatuEnum", UserStatuEnum.values());

        return "org/user";
    }

    @RequestMapping("/pageList")
    @ResponseBody
    @XxlSso(permission = "org:user")
    public Response<PageModel<XxlBootUserDTO>> pageList(@RequestParam(required = false, defaultValue = "0") int offset,
                                                        @RequestParam(required = false, defaultValue = "10") int pagesize,
                                                        String username,
                                                        @RequestParam(required = false, defaultValue = "-1") int status) {

        PageModel<XxlBootUserDTO> pageModel = userService.pageList(offset, pagesize, username, status);
        return Response.ofSuccess(pageModel);
    }

    @RequestMapping("/add")
    @ResponseBody
    @XxlSso(permission = "org:user")
    @Log(type= LogTypeEnum.OPT_LOG, module = LogModuleEnum.USER_MANAGE, title = "新增用户")
    public Response<String> add(XxlBootUserDTO xxlJobUser) {
        return userService.insert(xxlJobUser);
    }

    @RequestMapping("/update")
    @ResponseBody
    @XxlSso(permission = "org:user")
    @Log(type= LogTypeEnum.OPT_LOG, module = LogModuleEnum.USER_MANAGE, title = "更新用户")
    public Response<String> update(HttpServletRequest request, XxlBootUserDTO xxlJobUser) {
        // xxl-sso, logincheck
        Response<LoginInfo> loginInfoResponse = XxlSsoHelper.loginCheckWithAttr(request);

        return userService.update(xxlJobUser, loginInfoResponse.getData().getUserName());
    }

    @RequestMapping("/delete")
    @ResponseBody
    @XxlSso(permission = "org:user")
    @Log(type= LogTypeEnum.OPT_LOG, module = LogModuleEnum.USER_MANAGE, title = "删除用户")
    public Response<String> delete(HttpServletRequest request,
                                   @RequestParam("ids[]") List<Integer> ids) {
        // xxl-sso, logincheck
        Response<LoginInfo> loginInfoResponse = XxlSsoHelper.loginCheckWithAttr(request);

        return userService.deleteByIds(ids, Integer.valueOf(loginInfoResponse.getData().getUserId()));
    }

}
