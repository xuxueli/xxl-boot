package com.xxl.boot.api.framework.controller.system;

import com.xxl.boot.api.framework.model.dto.ConfigDTO;
import com.xxl.boot.api.framework.model.entity.Config;
import com.xxl.boot.api.framework.service.ConfigService;
import com.xxl.sso.core.annotation.XxlSso;
import com.xxl.tool.response.PageModel;
import com.xxl.tool.response.Response;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/system/config")
public class ConfigController {

    @Resource
    private ConfigService configService;
    @RequestMapping("/pageList")
    @XxlSso
    public Response<PageModel<ConfigDTO>> pageList(@RequestParam(required = false, defaultValue = "0") int offset,
                                                   @RequestParam(required = false, defaultValue = "10") int pagesize,
                                                   @RequestParam(required = false, defaultValue = "-1") int status,
                                                   String name,
                                                   String key) {
        PageModel<ConfigDTO> pageModel = configService.pageList(status, name, key, offset, pagesize);
        return Response.ofSuccess(pageModel);
    }

    @RequestMapping("/load")
    @XxlSso
    public Response<Config> load(int id){
        return configService.load(id);
    }

    /**
     * 按参数键名查询
     */
    @RequestMapping("/loadByKey")
    @XxlSso
    public Response<Config> loadByKey(String key){
        return configService.loadByKey(key);
    }

    @RequestMapping("/insert")
    @XxlSso
    public Response<String> insert(@RequestBody(required = false) Config xxlBootConfig){
        return configService.insert(xxlBootConfig);
    }

    @RequestMapping("/delete")
    @XxlSso
    public Response<String> delete(@RequestParam("ids[]") List<Integer> ids){
        return configService.delete(ids);
    }

    @RequestMapping("/update")
    @XxlSso
    public Response<String> update(@RequestBody(required = false) Config xxlBootConfig){
        return configService.update(xxlBootConfig);
    }

}
