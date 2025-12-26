package com.xxl.boot.admin.plugin.ai.controller;

import com.xxl.boot.admin.plugin.ai.model.Model;
import com.xxl.boot.admin.plugin.ai.model.Chat;
import com.xxl.boot.admin.plugin.ai.service.ModelService;
import com.xxl.boot.admin.plugin.ai.service.ChatService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import jakarta.annotation.Resource;

import com.xxl.tool.response.Response;
import com.xxl.tool.response.PageModel;
import com.xxl.sso.core.annotation.XxlSso;

/**
* Chat Controller
*
* Created by xuxueli on '2025-12-21 17:41:58'.
*/
@Controller
@RequestMapping("/ai/chat")
public class ChatController {

    @Resource
    private ChatService chatService;
    @Resource
    private ModelService modelService;

    /**
    * 页面
    */
    @RequestMapping
    @XxlSso(permission = "ai:chat")
    public String index(org.springframework.ui.Model model) {

        // find all model
        List<Model> modelList = modelService.queryAllModel();
        model.addAttribute("modelList", modelList);

        return "ai/chat.list";
    }

    /**
    * 分页查询
    */
    @RequestMapping("/pageList")
    @ResponseBody
    @XxlSso(permission = "ai:chat")
    public Response<PageModel<Chat>> pageList(@RequestParam(required = false, defaultValue = "0") int offset,
                                              @RequestParam(required = false, defaultValue = "10") int pagesize,
                                              @RequestParam(value = "modelId") int modelId,
                                              @RequestParam(value = "title") String title) {
        PageModel<Chat> pageModel = chatService.pageList(modelId, title, offset, pagesize);
        return Response.ofSuccess(pageModel);
    }

    /**
    * Load查询
    */
    @RequestMapping("/load")
    @ResponseBody
    @XxlSso(permission = "ai:chat")
    public Response<Chat> load(int id){
        return chatService.load(id);
    }

    /**
    * 新增
    */
    @RequestMapping("/insert")
    @ResponseBody
    @XxlSso(permission = "ai:chat")
    public Response<String> insert(Chat chat){
        return chatService.insert(chat);
    }

    /**
    * 删除
    */
    @RequestMapping("/delete")
    @ResponseBody
    @XxlSso(permission = "ai:chat")
    public Response<String> delete(@RequestParam("ids[]") List<Integer> ids){
        return chatService.delete(ids);
    }

    /**
     * 删除消息
     */
    @RequestMapping("/deleteMessage")
    @ResponseBody
    @XxlSso(permission = "ai:chat")
    public Response<String> deleteMessage(@RequestParam("id") int id){
        return chatService.deleteMessage(id);
    }

    /**
    * 更新
    */
    @RequestMapping("/update")
    @ResponseBody
    @XxlSso(permission = "ai:chat")
    public Response<String> update(Chat chat){
        return chatService.update(chat);
    }

}
