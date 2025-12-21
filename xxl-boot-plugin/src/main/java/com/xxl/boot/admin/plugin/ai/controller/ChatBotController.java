package com.xxl.boot.admin.plugin.ai.controller;

import com.xxl.boot.admin.plugin.ai.model.ChatBot;
import com.xxl.boot.admin.plugin.ai.service.ChatBotService;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.MessageChatMemoryAdvisor;
import org.springframework.ai.chat.client.advisor.SimpleLoggerAdvisor;
import org.springframework.ai.chat.memory.MessageWindowChatMemory;
import org.springframework.ai.ollama.OllamaChatModel;
import org.springframework.ai.ollama.api.OllamaApi;
import org.springframework.ai.ollama.api.OllamaChatOptions;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import jakarta.annotation.Resource;

import com.xxl.tool.response.Response;
import com.xxl.tool.response.PageModel;
import com.xxl.sso.core.annotation.XxlSso;
import reactor.core.publisher.Flux;

/**
* Agent Controller
*
* Created by xuxueli on '2025-11-30 20:41:37'.
*/
@Controller
@RequestMapping("/ai/chatbot")
public class ChatBotController {
    private static final Logger logger = LoggerFactory.getLogger(ChatBotController.class);

    @Resource
    private ChatBotService userService;

    /**
    * 页面
    */
    @RequestMapping
    @XxlSso
    public String index(Model model) {
        return "ai/chatbot.list";
    }

    /**
    * 分页查询
    */
    @RequestMapping("/pageList")
    @ResponseBody
    @XxlSso
    public Response<PageModel<ChatBot>> pageList(@RequestParam(required = false, defaultValue = "0") int offset,
                                                 @RequestParam(required = false, defaultValue = "10") int pagesize) {
        PageModel<ChatBot> pageModel = userService.pageList(offset, pagesize);
        return Response.ofSuccess(pageModel);
    }

    /**
    * Load查询
    */
    @RequestMapping("/load")
    @ResponseBody
    @XxlSso
    public Response<ChatBot> load(int id){
        return userService.load(id);
    }

    /**
    * 新增
    */
    @RequestMapping("/insert")
    @ResponseBody
    @XxlSso
    public Response<String> insert(ChatBot user){
        return userService.insert(user);
    }

    /**
    * 删除
    */
    @RequestMapping("/delete")
    @ResponseBody
    @XxlSso
    public Response<String> delete(@RequestParam("ids[]") List<Integer> ids){
        return userService.delete(ids);
    }

    /**
    * 更新
    */
    @RequestMapping("/update")
    @ResponseBody
    @XxlSso
    public Response<String> update(ChatBot user){
        return userService.update(user);
    }


    // --------------------------------- ollama chat ---------------------------------

    private String ollamaUrl = "http://localhost:11434";
    private String modle = "qwen3:0.6b";
    private String prompt = "你好，你是一个研发工程师，擅长解决技术类问题。";


    private ChatClient buildOllamaChatClient() {
        // build chat-model
        OllamaChatModel ollamaChatModel = OllamaChatModel
                .builder()
                .ollamaApi(OllamaApi.builder().baseUrl(ollamaUrl).build())
                .build();

        // build chat-client
        ChatClient ollamaChatClient = ChatClient
                .builder(ollamaChatModel)
                .defaultAdvisors(MessageChatMemoryAdvisor.builder(MessageWindowChatMemory.builder().build()).build())       // add memory
                .defaultAdvisors(SimpleLoggerAdvisor.builder().build())                                                     // add logger
                .defaultOptions(OllamaChatOptions.builder().model(modle).build())                                           // assign model
                .build();
        return ollamaChatClient;
    }

    /**
     * ChatClient 简单调用
     */
    @GetMapping("/chat/default")
    @ResponseBody
    public String simpleChat(@RequestParam(value = "input", required = false, defaultValue = "介绍你自己") String input) {

        // build chat-client
        ChatClient ollamaChatClient = buildOllamaChatClient();

        // call ollama
        String response = ollamaChatClient
                .prompt(prompt)
                .user(input)
                .call()
                .content();

        logger.debug("result: " + response);
        return response;
    }

    /**
     * ChatClient 流式调用
     */
    @GetMapping("/chat/stream")
    public Flux<String> streamChat(HttpServletResponse response, @RequestParam(value = "input", required = false, defaultValue = "介绍你自己") String input) {
        response.setCharacterEncoding("UTF-8");

        // build chat-client
        ChatClient ollamaChatClient = buildOllamaChatClient();

        // call ollama
        return ollamaChatClient
                .prompt(prompt)
                .user(input)
                .stream()
                .content();
    }

}
