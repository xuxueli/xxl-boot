package com.xxl.boot.api.framework.controller.system;

import com.xxl.boot.api.framework.constant.enums.MessageCategoryEnum;
import com.xxl.boot.api.framework.constant.enums.MessageStatusEnum;
import com.xxl.boot.api.framework.mapper.system.MessageMapper;
import com.xxl.boot.api.framework.model.adaptor.MesssageAdaptor;
import com.xxl.boot.api.framework.model.dto.MessageDTO;
import com.xxl.boot.api.framework.model.entity.Message;
import com.xxl.boot.api.framework.model.entity.MessageRead;
import com.xxl.boot.api.framework.service.MessageReadService;
import com.xxl.boot.api.framework.service.MessageService;
import com.xxl.sso.core.annotation.XxlSso;
import com.xxl.sso.core.helper.XxlSsoHelper;
import com.xxl.sso.core.model.LoginInfo;
import com.xxl.tool.response.PageModel;
import com.xxl.tool.response.Response;
import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

/**
 * Message Controller
 *
 * Created by xuxueli on '2024-11-03 11:03:29'.
 */
@RestController
@RequestMapping("/system/message")
public class MessageController {

    @Resource
    private MessageService messageService;
    @Resource
    private MessageReadService messageReadService;
    @Resource
    private MessageMapper messageMapper;

    /**
     * 分页查询
     */
    @RequestMapping("/pageList")
    @XxlSso
    public Response<PageModel<MessageDTO>> pageList(@RequestParam(required = false, defaultValue = "0") int offset,
                                                    @RequestParam(required = false, defaultValue = "10") int pagesize,
                                                    @RequestParam(required = false, defaultValue = "-1") int status,
                                                    String title) {
        PageModel<MessageDTO> pageModel = messageService.pageList(status, title, offset, pagesize);
        return Response.ofSuccess(pageModel);
    }

    /**
     * Load查询
     */
    @RequestMapping("/load")
    @XxlSso
    public Response<Message> load(int id){
        return messageService.load(id);
    }

    /**
     * 新增
     */
    @RequestMapping("/insert")
    @XxlSso
    public Response<String> insert(@RequestBody(required = false) Message xxlBootMessage, HttpServletRequest request){

        // xxl-sso, logincheck
        Response<LoginInfo> loginInfoResponse = XxlSsoHelper.loginCheckWithAttr(request);

        return messageService.insert(xxlBootMessage, loginInfoResponse.getData().getUserName());
    }

    /**
     * 删除
     */
    @RequestMapping("/delete")
    @XxlSso
    public Response<String> delete(@RequestParam("ids[]") List<Integer> ids){
        return messageService.delete(ids);
    }

    /**
     * 更新
     */
    @RequestMapping("/update")
    @XxlSso
    public Response<String> update(@RequestBody(required = false) Message xxlBootMessage){
        return messageService.update(xxlBootMessage);
    }

    /**
     * 首页顶部公告列表
     */
    @RequestMapping("/listTop")
    @XxlSso
    public Response<List<MessageDTO>> listTop(HttpServletRequest request) {

        Response<LoginInfo> loginInfoResponse = XxlSsoHelper.loginCheckWithAttr(request);
        int userId = Integer.parseInt(loginInfoResponse.getData().getUserId());

        List<Message> messageList = messageMapper.pageList(MessageStatusEnum.NORMAL.getValue(), null, 0, 5);
        List<MessageDTO> dtoList = MesssageAdaptor.adaptor(messageList);
        for (MessageDTO dto : dtoList) {
            dto.setIsRead(messageReadService.isRead(dto.getId(), userId));
        }
        return Response.ofSuccess(dtoList);
    }

    /**
     * 标记已读
     */
    @RequestMapping("/markRead")
    @XxlSso
    public Response<String> markRead(long messageId, HttpServletRequest request) {

        Response<LoginInfo> loginInfoResponse = XxlSsoHelper.loginCheckWithAttr(request);
        int userId = Integer.parseInt(loginInfoResponse.getData().getUserId());

        return messageReadService.markRead(messageId, userId);
    }

    /**
     * 批量标记已读
     */
    @RequestMapping("/markReadAll")
    @XxlSso
    public Response<String> markReadAll(String ids, HttpServletRequest request) {

        Response<LoginInfo> loginInfoResponse = XxlSsoHelper.loginCheckWithAttr(request);
        int userId = Integer.parseInt(loginInfoResponse.getData().getUserId());

        List<Long> messageIds = new ArrayList<>();
        if (ids != null && !ids.isEmpty()) {
            for (String id : ids.split(",")) {
                messageIds.add(Long.parseLong(id.trim()));
            }
        }
        return messageReadService.markReadAll(messageIds, userId);
    }

    /**
     * 已读用户列表
     */
    @RequestMapping("/readUsers")
    @XxlSso
    public Response<PageModel<MessageRead>> readUsers(long messageId,
                                                       @RequestParam(required = false, defaultValue = "0") int offset,
                                                       @RequestParam(required = false, defaultValue = "10") int pagesize) {
        PageModel<MessageRead> pageModel = messageReadService.readUsers(messageId, offset, pagesize);
        return Response.ofSuccess(pageModel);
    }

}
