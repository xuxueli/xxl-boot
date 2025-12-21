package com.xxl.boot.admin.plugin.ai.controller;

import com.xxl.boot.admin.plugin.ai.model.Chat;
import com.xxl.boot.admin.plugin.ai.model.ChatMessage;
import com.xxl.boot.admin.plugin.ai.service.ChatMessageService;
import com.xxl.boot.admin.plugin.ai.service.ChatService;
import com.xxl.tool.core.AssertTool;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import jakarta.annotation.Resource;

import com.xxl.tool.response.Response;
import com.xxl.tool.response.PageModel;
import com.xxl.sso.core.annotation.XxlSso;

/**
* ChatMessage Controller
*
* Created by xuxueli on '2025-12-21 18:18:12'.
*/
@Controller
@RequestMapping("/ai/chat/detail")
public class ChatMessageController {

    @Resource
    private ChatMessageService chatMessageService;
    @Resource
    private ChatService chatService;

    /**
    * 页面
    */
    @RequestMapping
    @XxlSso(permission = "ai:chat")
    public String index(Model model, @RequestParam(required = false, defaultValue = "0") int chatId) {

        // valid chat
        Response<Chat> chatRest =chatService.load(chatId);
        AssertTool.notNull(chatRest.getData(), "参数非法，当前对话不存在");

        // set chat data
        model.addAttribute("chat", chatRest.getData());

        return "ai/chat.detail";
    }

    /**
    * 分页查询
    */
    @RequestMapping("/pageList")
    @ResponseBody
    @XxlSso(permission = "ai:chat")
    public Response<PageModel<ChatMessage>> pageList(@RequestParam(required = false, defaultValue = "0") int offset,
                                                     @RequestParam(required = false, defaultValue = "10") int pagesize) {
        PageModel<ChatMessage> pageModel = chatMessageService.pageList(offset, pagesize);
        return Response.ofSuccess(pageModel);
    }

    /**
    * Load查询
    */
    @RequestMapping("/load")
    @ResponseBody
    @XxlSso(permission = "ai:chat")
    public Response<ChatMessage> load(int id){
        return chatMessageService.load(id);
    }

    /**
    * 新增
    */
    @RequestMapping("/insert")
    @ResponseBody
    @XxlSso(permission = "ai:chat")
    public Response<String> insert(ChatMessage chatMessage){
        return chatMessageService.insert(chatMessage);
    }

    /**
    * 删除
    */
    @RequestMapping("/delete")
    @ResponseBody
    @XxlSso(permission = "ai:chat")
    public Response<String> delete(@RequestParam("ids[]") List<Integer> ids){
        return chatMessageService.delete(ids);
    }

    /**
    * 更新
    */
    @RequestMapping("/update")
    @ResponseBody
    @XxlSso(permission = "ai:chat")
    public Response<String> update(ChatMessage chatMessage){
        return chatMessageService.update(chatMessage);
    }

}
