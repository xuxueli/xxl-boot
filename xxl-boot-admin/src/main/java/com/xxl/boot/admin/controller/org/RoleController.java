package com.xxl.boot.admin.controller.org;

import com.xxl.boot.admin.constant.enums.UserStatuEnum;
import com.xxl.boot.admin.model.entity.XxlBootRole;
import com.xxl.boot.admin.service.RoleService;
import com.xxl.sso.core.annotation.XxlSso;
import com.xxl.tool.response.PageModel;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import jakarta.annotation.Resource;
import java.util.List;

import com.xxl.tool.response.Response;

/**
* role
*
* Created by xuxueli on '2024-07-21 13:58:17'.
*/
@Controller
@RequestMapping("/org/role")
public class RoleController {

    @Resource
    private RoleService roleService;

    @RequestMapping
    @XxlSso(permission = "org:role")
    public String index(Model model) {

        /*PageModel<XxlBootRole> pageModel = roleService.pageList(0, 100);*/
        model.addAttribute("userStatuEnum", UserStatuEnum.values());

        return "org/role";
    }

    /**
     * 分页查询
     */
    @RequestMapping("/pageList")
    @ResponseBody
    @XxlSso(permission = "org:role")
    public Response<PageModel<XxlBootRole>> pageList(@RequestParam(required = false, defaultValue = "0") int offset,
                                                     @RequestParam(required = false, defaultValue = "10") int pagesize,
                                                     String name) {
        PageModel<XxlBootRole> pageModel = roleService.pageList(offset, pagesize, name);
        return Response.ofSuccess(pageModel);
    }

    /**
    * 新增
    */
    @RequestMapping("/insert")
    @ResponseBody
    @XxlSso(permission = "org:role")
    public Response<String> insert(XxlBootRole xxlBootRole){
        return roleService.insert(xxlBootRole);
    }

    /**
    * 删除
    */
    @RequestMapping("/delete")
    @ResponseBody
    @XxlSso(permission = "org:role")
    public Response<String> delete(@RequestParam("ids[]") List<Integer> ids) {
        return roleService.deleteByIds(ids);
    }

    /**
    * 更新
    */
    @RequestMapping("/update")
    @ResponseBody
    @XxlSso(permission = "org:role")
    public Response<String> update(XxlBootRole xxlBootRole){
        return roleService.update(xxlBootRole);
    }

    /**
    * Load查询
    */
    @RequestMapping("/load")
    @ResponseBody
    @XxlSso(permission = "org:role")
    public Response<XxlBootRole> load(int id){
        return roleService.load(id);
    }

    /**
     * 角色资源查询
     */
    @RequestMapping("/loadRoleRes")
    @ResponseBody
    @XxlSso(permission = "org:role")
    public Response<List<Integer>> loadRoleRes(int roleId){
        return roleService.loadRoleRes(roleId);
    }

    /**
     * 角色资源授权
     */
    @RequestMapping("/updateRoleRes")
    @ResponseBody
    @XxlSso(permission = "org:role")
    public Response<String> updateRoleRes(@RequestParam int roleId,
                                          @RequestParam(value = "resourceIds[]", required = false) List<Integer> resourceIds){
        return roleService.updateRoleRes(roleId, resourceIds);
    }


}