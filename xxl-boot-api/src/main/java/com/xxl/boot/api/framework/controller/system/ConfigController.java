package com.xxl.boot.api.framework.controller.system;

import com.xxl.boot.api.framework.constant.enums.ConfigStatusEnum;
import com.xxl.boot.api.framework.model.dto.ConfigDTO;
import com.xxl.boot.api.framework.model.entity.Config;
import com.xxl.boot.api.framework.service.ConfigService;
import com.xxl.sso.core.annotation.XxlSso;
import com.xxl.tool.response.PageModel;
import com.xxl.tool.response.Response;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
@RequestMapping("/system/config")
public class ConfigController {

    @Resource
    private ConfigService configService;

    @RequestMapping
    @XxlSso
    public String index(Model model) {

        model.addAttribute("ConfigStatusEnum", ConfigStatusEnum.values());

        return "/framework/system/config";
    }

    @RequestMapping("/pageList")
    @ResponseBody
    @XxlSso
    public Response<PageModel<ConfigDTO>> pageList(@RequestParam(required = false, defaultValue = "0") int offset,
                                                           @RequestParam(required = false, defaultValue = "10") int pagesize,
                                                           int status,
                                                           String name,
                                                           String key) {
        PageModel<ConfigDTO> pageModel = configService.pageList(status, name, key, offset, pagesize);
        return Response.ofSuccess(pageModel);
    }

    @RequestMapping("/load")
    @ResponseBody
    @XxlSso
    public Response<Config> load(int id){
        return configService.load(id);
    }

    @RequestMapping("/insert")
    @ResponseBody
    @XxlSso
    public Response<String> insert(Config xxlBootConfig){
        return configService.insert(xxlBootConfig);
    }

    @RequestMapping("/delete")
    @ResponseBody
    @XxlSso
    public Response<String> delete(@RequestParam("ids[]") List<Integer> ids){
        return configService.delete(ids);
    }

    @RequestMapping("/update")
    @ResponseBody
    @XxlSso
    public Response<String> update(Config xxlBootConfig){
        return configService.update(xxlBootConfig);
    }

}
