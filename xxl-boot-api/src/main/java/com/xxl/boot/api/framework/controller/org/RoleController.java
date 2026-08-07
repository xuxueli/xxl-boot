package com.xxl.boot.api.framework.controller.org;

import com.xxl.boot.api.framework.model.entity.Role;
import com.xxl.boot.api.framework.service.RoleService;
import com.xxl.sso.core.annotation.XxlSso;
import com.xxl.tool.response.PageModel;
import com.xxl.tool.response.Response;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 角色管理
 *
 * @author xuxueli 2024-07-21 13:58:17
 */
@RestController
@RequestMapping("/org/role")
public class RoleController {

    @Resource
    private RoleService roleService;

    /**
     * 分页查询
     */
    @RequestMapping("/pageList")
    @XxlSso(permission = "org:role")
    public Response<PageModel<Role>> pageList(@RequestParam(required = false, defaultValue = "0") int offset,
                                              @RequestParam(required = false, defaultValue = "10") int pagesize,
                                              String name,
                                              @RequestParam(required = false, defaultValue = "-1") int status) {
        PageModel<Role> pageModel = roleService.pageList(offset, pagesize, name, status);
        return Response.ofSuccess(pageModel);
    }

    /**
     * 新增
     */
    @RequestMapping("/insert")
    @XxlSso(permission = "org:role")
    public Response<Integer> insert(Role xxlBootRole){
        return roleService.insert(xxlBootRole);
    }

    /**
     * 删除
     */
    @RequestMapping("/delete")
    @XxlSso(permission = "org:role")
    public Response<String> delete(@RequestParam("ids[]") List<Integer> ids) {
        return roleService.deleteByIds(ids);
    }

    /**
     * 更新
     */
    @RequestMapping("/update")
    @XxlSso(permission = "org:role")
    public Response<String> update(Role xxlBootRole){
        return roleService.update(xxlBootRole);
    }

    /**
     * Load查询
     */
    @RequestMapping("/load")
    @XxlSso(permission = "org:role")
    public Response<Role> load(int id){
        return roleService.load(id);
    }

    /**
     * 角色资源查询
     */
    @RequestMapping("/loadRoleRes")
    @XxlSso(permission = "org:role")
    public Response<List<Integer>> loadRoleRes(int roleId){
        return roleService.loadRoleRes(roleId);
    }

    /**
     * 角色资源授权
     */
    @RequestMapping("/updateRoleRes")
    @XxlSso(permission = "org:role")
    public Response<String> updateRoleRes(@RequestParam int roleId,
                                          @RequestParam(value = "resourceIds[]", required = false) List<Integer> resourceIds){
        return roleService.updateRoleRes(roleId, resourceIds);
    }

}
