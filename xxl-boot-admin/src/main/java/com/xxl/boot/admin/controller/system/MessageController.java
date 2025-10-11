package com.xxl.boot.admin.controller.system;

import com.xxl.boot.admin.constant.enums.MessageCategoryEnum;
import com.xxl.boot.admin.constant.enums.MessageStatusEnum;
import com.xxl.boot.admin.model.dto.XxlBootMessageDTO;
import com.xxl.boot.admin.model.entity.XxlBootMessage;
import com.xxl.boot.admin.service.MessageService;
import com.xxl.sso.core.annotation.XxlSso;
import com.xxl.sso.core.helper.XxlSsoHelper;
import com.xxl.sso.core.model.LoginInfo;
import com.xxl.tool.response.PageModel;
import com.xxl.tool.response.Response;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import jakarta.annotation.Resource;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

/**
 * XxlBootMessage Controller
 *
 * Created by xuxueli on '2024-11-03 11:03:29'.
 */
@Controller
@RequestMapping("/system/message")
public class MessageController {

    @Resource
    private MessageService messageService;

    /**
     * 页面
     */
    @RequestMapping
    @XxlSso
    public String index(Model model) {

        model.addAttribute("MessageCategoryEnum", MessageCategoryEnum.values());
        model.addAttribute("MessageStatusEnum", MessageStatusEnum.values());

        return "system/message";
    }

    /**
     * 分页查询
     */
    @RequestMapping("/pageList")
    @ResponseBody
    @XxlSso
    public Response<PageModel<XxlBootMessageDTO>> pageList(@RequestParam(required = false, defaultValue = "0") int offset,
                                                           @RequestParam(required = false, defaultValue = "10") int pagesize,
                                                           int status,
                                                           String title) {
        PageModel<XxlBootMessageDTO> pageModel = messageService.pageList(status, title, offset, pagesize);
        return Response.ofSuccess(pageModel);
    }

    /**
     * Load查询
     */
    @RequestMapping("/load")
    @ResponseBody
    @XxlSso
    public Response<XxlBootMessage> load(int id){
        return messageService.load(id);
    }

    /**
     * 新增
     */
    @RequestMapping("/insert")
    @ResponseBody
    @XxlSso
    public Response<String> insert(XxlBootMessage xxlBootMessage, HttpServletRequest request){

        // xxl-sso, logincheck
        Response<LoginInfo> loginInfoResponse = XxlSsoHelper.loginCheckWithAttr(request);

        return messageService.insert(xxlBootMessage, loginInfoResponse.getData().getUserName());
    }

    /**
     * 删除
     */
    @RequestMapping("/delete")
    @ResponseBody
    @XxlSso
    public Response<String> delete(@RequestParam("ids[]") List<Integer> ids){
        return messageService.delete(ids);
    }

    /**
     * 更新
     */
    @RequestMapping("/update")
    @ResponseBody
    @XxlSso
    public Response<String> update(XxlBootMessage xxlBootMessage){
        return messageService.update(xxlBootMessage);
    }

}
