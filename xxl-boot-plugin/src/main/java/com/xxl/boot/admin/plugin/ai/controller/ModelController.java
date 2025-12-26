package com.xxl.boot.admin.plugin.ai.controller;

import com.xxl.boot.admin.plugin.ai.constant.enums.ModelTypeEnum;
import com.xxl.boot.admin.plugin.ai.constant.enums.SupplierTypeEnum;
import com.xxl.boot.admin.plugin.ai.model.Model;
import com.xxl.boot.admin.plugin.ai.service.ModelService;
import com.xxl.tool.core.AssertTool;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import jakarta.annotation.Resource;

import com.xxl.tool.response.Response;
import com.xxl.tool.response.PageModel;
import com.xxl.sso.core.annotation.XxlSso;

/**
* Model Controller
*
* Created by xuxueli on '2025-12-21 16:13:29'.
*/
@Controller
@RequestMapping("/ai/model")
public class ModelController {
    private static final Logger logger = LoggerFactory.getLogger(ModelController.class);

    @Resource
    private ModelService modelService;

    /**
    * 页面
    */
    @RequestMapping
    @XxlSso(permission = "ai:model")
    public String index(org.springframework.ui.Model model) {

        // set enum
        model.addAttribute("ModelTypeEnum", ModelTypeEnum.values());
        model.addAttribute("SupplierTypeEnum", SupplierTypeEnum.values());

        return "/ai/model.list";
    }

    /**
    * 分页查询
    */
    @RequestMapping("/pageList")
    @ResponseBody
    @XxlSso(permission = "ai:model")
    public Response<PageModel<Model>> pageList(@RequestParam(required = false, defaultValue = "0") int offset,
                                               @RequestParam(required = false, defaultValue = "10") int pagesize,
                                               int modelType,
                                               String name) {
        PageModel<Model> pageModel = modelService.pageList(offset, pagesize, modelType, name);
        return Response.ofSuccess(pageModel);
    }

    /**
    * Load查询
    */
    @RequestMapping("/load")
    @ResponseBody
    @XxlSso(permission = "ai:model")
    public Response<Model> load(int id){
        return modelService.load(id);
    }

    /**
    * 新增
    */
    @RequestMapping("/insert")
    @ResponseBody
    @XxlSso
    public Response<String> insert(Model model){
        return modelService.insert(model);
    }

    /**
    * 删除
    */
    @RequestMapping("/delete")
    @ResponseBody
    @XxlSso(permission = "ai:model")
    public Response<String> delete(@RequestParam("ids[]") List<Integer> ids){
        return modelService.delete(ids);
    }

    /**
    * 更新
    */
    @RequestMapping("/update")
    @ResponseBody
    @XxlSso(permission = "ai:model")
    public Response<String> update(Model model){
        return modelService.update(model);
    }

    /**
     * test
     */
    @RequestMapping("/test")
    @ResponseBody
    @XxlSso(permission = "ai:model")
    public Response<String> test(int id){
        Response<Model> modelResponse = modelService.load(id);
        AssertTool.isTrue(modelResponse.isSuccess(), "Model ID非法");

        try {
            // build chatClient
            ChatClient chatClient = ChatMessageController.loadChatClient(modelResponse.getData().getModel(), modelResponse.getData().getBaseUrl(), null);

            // call
            String response = chatClient.prompt("Hi").call().content();
            logger.info("model test success, model:{}, baseUrl:{}, response: {}", modelResponse.getData().getModel(), modelResponse.getData().getBaseUrl(), response);
            return Response.ofSuccess("测试成功");
        } catch (Exception e) {
            return Response.ofFail("测试失败：" + e.getMessage());
        }
    }

}
