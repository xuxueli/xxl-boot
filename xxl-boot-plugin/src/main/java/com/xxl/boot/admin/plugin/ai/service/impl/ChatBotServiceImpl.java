package com.xxl.boot.admin.plugin.ai.service.impl;

import com.xxl.boot.admin.plugin.ai.mapper.ChatBotMapper;
import com.xxl.boot.admin.plugin.ai.model.ChatBot;
import com.xxl.boot.admin.plugin.ai.service.ChatBotService;
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
