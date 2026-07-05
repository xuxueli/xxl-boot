package com.xxl.boot.admin.framework.service;

import java.util.List;

import com.xxl.boot.admin.framework.model.dto.MessageDTO;
import com.xxl.boot.admin.framework.model.entity.Message;
import com.xxl.tool.response.Response;
import com.xxl.tool.response.PageModel;

/**
* Message Service
*
* Created by xuxueli on '2024-11-03 11:03:29'.
*/
public interface MessageService {

    /**
    * 新增
    */
    public Response<String> insert(Message xxlBootMessage, String optUserName);

    /**
    * 删除
    */
    public Response<String> delete(List<Integer> ids);

    /**
    * 更新
    */
    public Response<String> update(Message xxlBootMessage);

    /**
    * Load查询
    */
    public Response<Message> load(int id);

    /**
    * 分页查询
    */
    public PageModel<MessageDTO> pageList(int status, String title, int offset, int pagesize);

}
