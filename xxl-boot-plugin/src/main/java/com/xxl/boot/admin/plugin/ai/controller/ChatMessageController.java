package com.xxl.boot.admin.plugin.ai.controller;

import com.xxl.boot.admin.plugin.ai.constant.enums.SenderTypeEnum;
import com.xxl.boot.admin.plugin.ai.model.Agent;
import com.xxl.boot.admin.plugin.ai.model.Chat;
import com.xxl.boot.admin.plugin.ai.model.ChatMessage;
import com.xxl.boot.admin.plugin.ai.service.AgentService;
import com.xxl.boot.admin.plugin.ai.service.ChatMessageService;
import com.xxl.boot.admin.plugin.ai.service.ChatService;
import com.xxl.sso.core.helper.XxlSsoHelper;
import com.xxl.sso.core.model.LoginInfo;
import com.xxl.tool.core.AssertTool;
import jakarta.servlet.http.HttpServletRequest;
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
    private static final Logger logger = LoggerFactory.getLogger(ChatMessageController.class);

    @Resource
    private ChatMessageService chatMessageService;
    @Resource
    private ChatService chatService;
    @Resource
    private AgentService agentService;

    /**
    * 页面
    */
    @RequestMapping
    @XxlSso(permission = "ai:chat")
    public String index(Model model, @RequestParam(required = false, defaultValue = "0") int chatId) {

        // load chat
        Response<Chat> chatRest =chatService.load(chatId);
        AssertTool.notNull(chatRest.getData(), "参数非法，当前对话不存在");

        // query chat message
        Response<List<ChatMessage>> chatMessageResp = chatMessageService.queryByChatId(chatId);

        // set data
        model.addAttribute("chat", chatRest.getData());
        model.addAttribute("messageList", chatMessageResp.getData());
        model.addAttribute("SenderTypeEnum", SenderTypeEnum.values());

        return "ai/chat.detail";
    }

    @RequestMapping("/send")
    @ResponseBody
    @XxlSso(permission = "ai:chat")
    public Response<String> send(HttpServletRequest request,
                             HttpServletResponse response,
                             ChatMessage chatMessage){

        // valid
        AssertTool.notNull(chatMessage.getContent(), "请输入内容");

        // login user
        Response<LoginInfo> loginInfoRest = XxlSsoHelper.loginCheckWithAttr(request);
        String userName = loginInfoRest.getData().getUserName();

        // load chat
        Response<Chat> chatRest =chatService.load(chatMessage.getChatId());
        AssertTool.notNull(chatRest.getData(), "当前对话不存在");
        Response<Agent> agentResp = agentService.load(chatRest.getData().getAgentId());
        AssertTool.notNull(chatRest.getData(), "当前回话对应Agent配置非法");

        // load chat-client
        ChatClient chatClient = loadChatClient(agentResp.getData().getModel(), agentResp.getData().getOllamaUrl(), null);

        // call ollama
        String responseMesssage = null;
        try {
            responseMesssage = chatClient
                    .prompt(agentResp.getData().getPrompt())
                    .user(chatMessage.getContent())
                    .call()
                    .content();
        } catch (Exception e) {
            logger.error("chat-message send error, request:{}, error: {}", chatMessage, e.getMessage(), e);
            return Response.ofFail("处理请求时出错: " + e.getMessage());
        }

        // send message
        chatMessageService.send(chatMessage.getChatId(), SenderTypeEnum.USER.getValue(), userName, chatMessage.getContent());
        chatMessageService.send(chatMessage.getChatId(), SenderTypeEnum.AGENT.getValue(), SenderTypeEnum.AGENT.getDesc(), responseMesssage);
        logger.debug("chat-message send success, chatId:{},  request:{}, response:{}", chatMessage.getChatId(), chatMessage.getContent(), responseMesssage);
        return Response.ofSuccess(responseMesssage);
    }

    /**
     * @GetMapping("/chat/stream")
     * public Flux<String> streamChat(HttpServletResponse response, @RequestParam(value = "input", required = false, defaultValue = "介绍你自己") String input) {
     *     response.setCharacterEncoding("UTF-8");
     *
     *     // build chat-client
     *     ChatClient ollamaChatClient = ChatClient
     *             .builder(ollamaChatModel)
     *             .defaultAdvisors(MessageChatMemoryAdvisor.builder(MessageWindowChatMemory.builder().build()).build())
     *             .defaultAdvisors(SimpleLoggerAdvisor.builder().build())
     *             .defaultOptions(OllamaChatOptions.builder().model(modle).build())
     *             .build();
     *
     *     // call ollama
     *     return ollamaChatClient
     *             .prompt(prompt)
     *             .user(input)
     *             .stream()
     *             .content();
     * }
     */

    private ChatClient loadChatClient(String model, String baseUrl, String apiKey){
        AssertTool.notNull(model, "模型不能为空");
        AssertTool.notNull(baseUrl, "模型地址不能为空");

        // build chat model
        OllamaChatModel ollamaChatModel = OllamaChatModel
                .builder()
                .ollamaApi(OllamaApi
                        .builder()
                        .baseUrl(baseUrl)
                        .build())
                .build();

        // build chat-client
        return ChatClient
                .builder(ollamaChatModel)
                .defaultAdvisors(MessageChatMemoryAdvisor   // chat memory
                        .builder(MessageWindowChatMemory    // memory window with length 20
                                .builder()
                                .maxMessages(20)
                                .build())
                        .build())       // add memory
                .defaultAdvisors(SimpleLoggerAdvisor.builder().build())                                                     // add logger
                .defaultOptions(OllamaChatOptions
                        .builder()
                        .model(model)
                        .build())                                           // assign model
                .build();
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
