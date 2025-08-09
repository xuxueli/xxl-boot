package com.xxl.boot.admin.controller.org;
import com.xxl.boot.admin.constant.enums.ResourceStatuEnum;
import com.xxl.boot.admin.constant.enums.ResourceTypeEnum;
import com.xxl.boot.admin.model.dto.XxlBootResourceDTO;
import com.xxl.boot.admin.model.entity.XxlBootResource;
import com.xxl.boot.admin.service.ResourceService;
import com.xxl.sso.core.annotation.XxlSso;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import jakarta.annotation.Resource;
import com.xxl.tool.response.Response;

import java.util.List;

/**
 * XxlBootResource Controller
 *
 * Created by xuxueli on '2024-07-28 12:52:39'.
 */
@Controller
@RequestMapping("/org/resource")
public class ResourceController {

    @Resource
    private ResourceService resourceService;

    /**
     * 页面
     */
    @RequestMapping
    @XxlSso(permission = "org:resource")
    public String index(Model model) {

        model.addAttribute("resourceStatuEnum", ResourceStatuEnum.values());
        model.addAttribute("resourceTypeEnum", ResourceTypeEnum.values());

        return "org/resource";
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
    @XxlSso(permission = "org:resource")
    public Response<List<XxlBootResourceDTO>> treeList(@RequestParam(required = false) String name,
                                                       @RequestParam(required = false, defaultValue = "-1") int status) {

        List<XxlBootResourceDTO> treeListData = resourceService.treeList(name, status);
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
    @XxlSso(permission = "org:resource")
    public Response<List<XxlBootResourceDTO>> simpleTreeList(@RequestParam(required = false) String name,
                                                             @RequestParam(required = false, defaultValue = "-1") int status) {
        List<XxlBootResourceDTO> treeListData = resourceService.simpleTreeList(name, status);
        return Response.ofSuccess(treeListData);
    }

    /**
     * Load查询
     */
    @RequestMapping("/load")
    @ResponseBody
    @XxlSso(permission = "org:resource")
    public Response<XxlBootResource> load(int id){
        return resourceService.load(id);
    }

    /**
     * 新增
     */
    @RequestMapping("/insert")
    @ResponseBody
    @XxlSso(permission = "org:resource")
    public Response<String> insert(XxlBootResource xxlBootResource){
        return resourceService.insert(xxlBootResource);
    }

    /**
     * 删除
     */
    @RequestMapping("/delete")
    @ResponseBody
    @XxlSso(permission = "org:resource")
    public Response<String> delete(@RequestParam("ids[]") List<Integer> ids){
        return resourceService.delete(ids);
    }

    /**
     * 更新
     */
    @RequestMapping("/update")
    @ResponseBody
    @XxlSso(permission = "org:resource")
    public Response<String> update(XxlBootResource xxlBootResource){
        return resourceService.update(xxlBootResource);
    }

}
