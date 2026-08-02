package com.xxl.boot.api.framework.controller.org;

import com.xxl.boot.api.framework.constant.enums.OrgStatuEnum;
import com.xxl.boot.api.framework.model.entity.Org;
import com.xxl.boot.api.framework.service.OrgService;
import com.xxl.sso.core.annotation.XxlSso;
import com.xxl.tool.response.Response;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Org Controller
 *
 * Created by xuxueli on '2024-09-30 15:38:21'.
 */
@RestController
@RequestMapping("/org/org")
public class OrgController {

    @Resource
    private OrgService orgService;

    /**
     * tree数据查询
     *
     *  <pre>
     *     [
     * 			  {id: 1, pId: 0, name: "资源A", open: true},
     *            {id: 5, pId: 1, name: "资源A1"},
     *            {id: 2, pId: 0, name: "资源B", open: false},
     *            {id: 11, pId: 2, name: "资源B2"}
     * 		]
     *  </pre>
     */
    @RequestMapping("/treeList")
    @XxlSso(permission = "org:org")
    public Response<List<Org>> treeList(@RequestParam(required = false) String name,
                                               @RequestParam(required = false, defaultValue = "-1") int status) {

        List<Org> treeListData = orgService.treeList(name, status);
        return Response.ofSuccess(treeListData);
    }

    /**
     * Load查询
     */
    @RequestMapping("/load")
    @XxlSso(permission = "org:org")
    public Response<Org> load(int id){
        return orgService.load(id);
    }

    /**
     * 新增
     */
    @RequestMapping("/insert")
    @XxlSso(permission = "org:org")
    public Response<String> insert(Org xxlBootOrg){
        return orgService.insert(xxlBootOrg);
    }

    /**
     * 删除
     */
    @RequestMapping("/delete")
    @XxlSso(permission = "org:org")
    public Response<String> delete(@RequestParam("ids[]") List<Integer> ids){
        return orgService.delete(ids);
    }

    /**
     * 更新
     */
    @RequestMapping("/update")
    @XxlSso(permission = "org:org")
    public Response<String> update(Org xxlBootOrg){
        return orgService.update(xxlBootOrg);
    }

}
