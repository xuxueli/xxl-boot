package com.xxl.boot.api.framework.controller.org;

import com.xxl.boot.api.framework.model.dto.ResourceDTO;
import com.xxl.boot.api.framework.model.entity.Resource;
import com.xxl.boot.api.framework.service.ResourceService;
import com.xxl.sso.core.annotation.XxlSso;
import com.xxl.tool.response.Response;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Resource Controller
 *
 * Created by xuxueli on '2024-07-28 12:52:39'.
 */
@RestController
@RequestMapping("/org/resource")
public class ResourceController {

    @jakarta.annotation.Resource
    private ResourceService resourceService;


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
    @XxlSso(permission = "org:resource")
    public Response<List<ResourceDTO>> treeList(@RequestParam(required = false) String name,
                                                       @RequestParam(required = false, defaultValue = "-1") int status) {

        List<ResourceDTO> treeListData = resourceService.treeList(name, status);
        return Response.ofSuccess(treeListData);
    }

    /**
     * Load查询
     */
    @RequestMapping("/load")
    @XxlSso(permission = "org:resource")
    public Response<Resource> load(@RequestParam("id") int id){
        return resourceService.load(id);
    }

    /**
     * 新增
     */
    @RequestMapping("/insert")
    @XxlSso(permission = "org:resource")
    public Response<String> insert(Resource xxlBootResource){
        return resourceService.insert(xxlBootResource);
    }

    /**
     * 删除
     */
    @RequestMapping("/delete")
    @XxlSso(permission = "org:resource")
    public Response<String> delete(@RequestParam("ids[]") List<Integer> ids){
        return resourceService.delete(ids);
    }

    /**
     * 更新
     */
    @RequestMapping("/update")
    @XxlSso(permission = "org:resource")
    public Response<String> update(Resource xxlBootResource){
        return resourceService.update(xxlBootResource);
    }

    /**
     * 批量更新排序
     */
    @RequestMapping("/updateSort")
    @XxlSso(permission = "org:resource")
    public Response<String> updateSort(@RequestParam("ids[]") List<Integer> ids,
                                       @RequestParam("orders[]") List<Integer> orders){
        return resourceService.updateSort(ids, orders);
    }

}
