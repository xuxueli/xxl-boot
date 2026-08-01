package com.xxl.boot.api.framework.service;

import com.xxl.boot.api.framework.model.dto.MessageDTO;
import com.xxl.boot.api.framework.model.entity.Message;
import com.xxl.tool.response.PageModel;
import com.xxl.tool.response.Response;

import java.util.List;

/**
 * 消息 Service
 *
 * @author xuxueli 2024-11-03
 */
public interface MessageService {

    /**
     * 新增消息
     *
     * @param xxlBootMessage 消息实体
     * @param optUserName    发送人
     */
    public Response<String> insert(Message xxlBootMessage, String optUserName);

    /**
     * 批量删除消息
     *
     * @param ids 消息ID列表
     */
    public Response<String> delete(List<Integer> ids);

    /**
     * 更新消息
     *
     * @param xxlBootMessage 消息实体
     */
    public Response<String> update(Message xxlBootMessage);

    /**
     * Load查询（按ID查询单条消息）
     *
     * @param id 消息ID
     */
    public Response<Message> load(int id);

    /**
     * 分页查询消息
     *
     * @param category 分类（-1 全部、0 通知、1 公告）
     * @param status   状态（-1 全部、0 正常、1 下线）
     * @param title    标题/内容关键词（模糊匹配）
     * @param offset   分页偏移量
     * @param pagesize 每页条数
     */
    public PageModel<MessageDTO> pageList(int category, int status, String title, int offset, int pagesize);

}
