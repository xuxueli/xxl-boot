package com.xxl.boot.admin.plugin.ai.service.impl;

import com.xxl.boot.admin.plugin.ai.mapper.ChatBotMapper;
import com.xxl.boot.admin.plugin.ai.model.ChatBot;
import com.xxl.boot.admin.plugin.ai.service.ChatBotService;
import com.xxl.tool.core.StringTool;
import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import java.util.List;
import com.xxl.tool.response.Response;
import com.xxl.tool.response.PageModel;

/**
 * ChatBot Service Impl
 *
 * Created by xuxueli on '2025-12-07 02:23:23'.
 */
@Service
public class ChatBotServiceImpl implements ChatBotService {

    @Resource
    private ChatBotMapper chatBotMapper;

    /**
     * 新增
     */
    @Override
    public Response<String> insert(ChatBot chatBot) {

        // valid
        if (chatBot == null) {
            return Response.ofFail("必要参数缺失");
        }
        if (StringTool.isBlank(chatBot.getName())) {
            return Response.ofFail("名称不能为空");
        }
        if (!(chatBot.getName().length()>=2 && chatBot.getName().length()<=20)) {
            return Response.ofFail("名称长度限制2-20");
        }
        if (StringTool.isBlank(chatBot.getModel())) {
            return Response.ofFail("模型不能为空");
        }
        if (StringTool.isBlank(chatBot.getOllamaUrl())) {
            return Response.ofFail("Ollama URL不能为空");
        }

        // write
        chatBotMapper.insert(chatBot);
        return Response.ofSuccess();
    }

    /**
     * 删除
     */
    @Override
    public Response<String> delete(List<Integer> ids) {
        int ret = chatBotMapper.delete(ids);
        return ret>0? Response.ofSuccess() : Response.ofFail() ;
    }

    /**
     * 更新
     */
    @Override
    public Response<String> update(ChatBot chatBot) {

        // valid
        if (chatBot == null || chatBot.getId()<=0) {
            return Response.ofFail("必要参数缺失");
        }
        if (StringTool.isBlank(chatBot.getName())) {
            return Response.ofFail("名称不能为空");
        }
        if (!(chatBot.getName().length()>=2 && chatBot.getName().length()<=20)) {
            return Response.ofFail("名称长度限制2-20");
        }
        if (StringTool.isBlank(chatBot.getModel())) {
            return Response.ofFail("模型不能为空");
        }
        if (StringTool.isBlank(chatBot.getOllamaUrl())) {
            return Response.ofFail("Ollama URL不能为空");
        }

        // write
        int ret = chatBotMapper.update(chatBot);
        return ret>0? Response.ofSuccess() : Response.ofFail() ;
    }

    /**
     * Load查询
     */
    @Override
    public Response<ChatBot> load(int id) {
        ChatBot record = chatBotMapper.load(id);
        return Response.ofSuccess(record);
    }

    /**
     * 分页查询
     */
    @Override
    public PageModel<ChatBot> pageList(int offset, int pagesize) {

        List<ChatBot> pageList = chatBotMapper.pageList(offset, pagesize);
        int totalCount = chatBotMapper.pageListCount(offset, pagesize);

        // result
        PageModel<ChatBot> pageModel = new PageModel<ChatBot>();
        pageModel.setData(pageList);
        pageModel.setTotal(totalCount);

        return pageModel;
    }

}
