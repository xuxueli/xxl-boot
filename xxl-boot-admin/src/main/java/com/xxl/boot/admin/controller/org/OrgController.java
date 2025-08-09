package com.xxl.boot.admin.controller.org;

import com.xxl.boot.admin.constant.enums.OrgStatuEnum;
import com.xxl.boot.admin.model.dto.XxlBootOrgDTO;
import com.xxl.boot.admin.model.entity.XxlBootOrg;
import com.xxl.boot.admin.service.OrgService;
import com.xxl.sso.core.annotation.XxlSso;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import jakarta.annotation.Resource;

import com.xxl.tool.response.Response;

/**
 * XxlBootOrg Controller
 *
 * Created by xuxueli on '2024-09-30 15:38:21'.
 */
@Controller
@RequestMapping("/org/org")
public class OrgController {

    @Resource
    private OrgService orgService;

    /**
     * 页面
     */
    @RequestMapping
    @XxlSso(permission = "org:org")
    public String index(Model model) {

        model.addAttribute("orgStatuEnum", OrgStatuEnum.values());
        return "org/org";
    }

    /**
     * tree数据查询
     *
     *  <pre>
     *  {
     *      "data":
     *          [
     *              {
     *                  "name": "lhmyy521125",
     *                  ...
     *                  "children": [
     *                      {
     *                          "name": "hello",
     *                          ...
     *                      }
     *                  ]
     *              }
     *          ]
     *  }
     *  </pre>
     */
    @RequestMapping("/treeList")
    @ResponseBody
    @XxlSso(permission = "org:org")
    public Response<List<XxlBootOrgDTO>> treeList(@RequestParam(required = false) String name,
                                                  @RequestParam(required = false, defaultValue = "-1") int status) {

        List<XxlBootOrgDTO> treeListData = orgService.treeList(name, status);
        return Response.ofSuccess(treeListData);
    }

    /**
     * 简单tree数据查询
     *
     * <pre>
     *     [
     * 			  {id: 1, pId: 0, name: "资源A", open: true},
     *            {id: 5, pId: 1, name: "资源A1"},
     *            {id: 2, pId: 0, name: "资源B", open: false},
     *            {id: 11, pId: 2, name: "资源B2"}
     * 		]
     * </pre>
     */
    @RequestMapping("/simpleTreeList")
    @ResponseBody
    @XxlSso(permission = "org:org")
    public Response<List<XxlBootOrgDTO>> simpleTreeList(@RequestParam(required = false) String name,
                                                             @RequestParam(required = false, defaultValue = "-1") int status) {
        List<XxlBootOrgDTO> treeListData = orgService.simpleTreeList(name, status);
        return Response.ofSuccess(treeListData);
    }

    /**
     * Load查询
     */
    @RequestMapping("/load")
    @ResponseBody
    @XxlSso(permission = "org:org")
    public Response<XxlBootOrg> load(int id){
        return orgService.load(id);
    }

    /**
     * 新增
     */
    @RequestMapping("/insert")
    @ResponseBody
    @XxlSso(permission = "org:org")
    public Response<String> insert(XxlBootOrg xxlBootOrg){
        return orgService.insert(xxlBootOrg);
    }

    /**
     * 删除
     */
    @RequestMapping("/delete")
    @ResponseBody
    @XxlSso(permission = "org:org")
    public Response<String> delete(@RequestParam("ids[]") List<Integer> ids){
        return orgService.delete(ids);
    }

    /**
     * 更新
     */
    @RequestMapping("/update")
    @ResponseBody
    @XxlSso(permission = "org:org")
    public Response<String> update(XxlBootOrg xxlBootOrg){
        return orgService.update(xxlBootOrg);
    }

}
