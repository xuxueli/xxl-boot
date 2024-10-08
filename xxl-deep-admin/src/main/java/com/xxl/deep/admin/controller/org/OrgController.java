package com.xxl.deep.admin.controller.org;

import com.xxl.deep.admin.annotation.Permission;
import com.xxl.deep.admin.constant.enums.OrgStatuEnum;
import com.xxl.deep.admin.model.dto.XxlDeepOrgDTO;
import com.xxl.deep.admin.model.entity.XxlDeepOrg;
import com.xxl.deep.admin.service.OrgService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import javax.annotation.Resource;

import com.xxl.tool.response.Response;
import com.xxl.tool.response.ResponseBuilder;

/**
 * XxlDeepOrg Controller
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
    @Permission(adminuser = true)
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
    public Response<List<XxlDeepOrgDTO>> treeList(@RequestParam(required = false) String name,
                                                  @RequestParam(required = false, defaultValue = "-1") int status) {

        List<XxlDeepOrgDTO> treeListData = orgService.treeList(name, status);
        return new ResponseBuilder<List<XxlDeepOrgDTO>>().success(treeListData).build();
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
    public Response<List<XxlDeepOrgDTO>> simpleTreeList(@RequestParam(required = false) String name,
                                                             @RequestParam(required = false, defaultValue = "-1") int status) {
        List<XxlDeepOrgDTO> treeListData = orgService.simpleTreeList(name, status);
        return new ResponseBuilder<List<XxlDeepOrgDTO>>().success(treeListData).build();
    }

    /**
     * Load查询
     */
    @RequestMapping("/load")
    @ResponseBody
    public Response<XxlDeepOrg> load(int id){
        return orgService.load(id);
    }

    /**
     * 新增
     */
    @RequestMapping("/insert")
    @ResponseBody
    public Response<String> insert(XxlDeepOrg xxlDeepOrg){
        return orgService.insert(xxlDeepOrg);
    }

    /**
     * 删除
     */
    @RequestMapping("/delete")
    @ResponseBody
    public Response<String> delete(@RequestParam("ids[]") List<Integer> ids){
        return orgService.delete(ids);
    }

    /**
     * 更新
     */
    @RequestMapping("/update")
    @ResponseBody
    public Response<String> update(XxlDeepOrg xxlDeepOrg){
        return orgService.update(xxlDeepOrg);
    }

}
