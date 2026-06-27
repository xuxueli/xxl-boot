package com.xxl.boot.api.framework.service;

import com.xxl.boot.api.framework.model.dto.XxlBootMessageDTO;
import com.xxl.boot.api.framework.model.entity.XxlBootMessage;
import com.xxl.tool.response.PageModel;
import com.xxl.tool.response.Response;

import java.util.List;

/**
* XxlBootMessage Service
*
* Created by xuxueli on '2024-11-03 11:03:29'.
*/
public interface MessageService {

    /**
    * 新增
    */
    public Response<String> insert(XxlBootMessage xxlBootMessage, String optUserName);

    /**
    * 删除
    */
    public Response<String> delete(List<Integer> ids);

    /**
    * 更新
    */
    public Response<String> update(XxlBootMessage xxlBootMessage);

    /**
    * Load查询
    */
    public Response<XxlBootMessage> load(int id);

    /**
    * 分页查询
    */
    public PageModel<XxlBootMessageDTO> pageList(int status, String title, int offset, int pagesize);

}
