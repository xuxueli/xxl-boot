package com.xxl.boot.admin.plugin.ai.controller;

import com.xxl.boot.admin.plugin.ai.model.Agent;
import com.xxl.boot.admin.plugin.ai.service.AgentService;
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
* Agent Controller
*
* Created by xuxueli on '2025-11-30 20:41:37'.
*/
@Controller
@RequestMapping("/ai/agent")
public class AgentrController {

    @Resource
    private AgentService userService;

    /**
    * 页面
    */
    @RequestMapping
    @XxlSso
    public String index(Model model) {
        return "ai/agent.list";
    }

    /**
    * 分页查询
    */
    @RequestMapping("/pageList")
    @ResponseBody
    @XxlSso
    public Response<PageModel<Agent>> pageList(@RequestParam(required = false, defaultValue = "0") int offset,
                                               @RequestParam(required = false, defaultValue = "10") int pagesize) {
        PageModel<Agent> pageModel = userService.pageList(offset, pagesize);
        return Response.ofSuccess(pageModel);
    }

    /**
    * Load查询
    */
    @RequestMapping("/load")
    @ResponseBody
    @XxlSso
    public Response<Agent> load(int id){
        return userService.load(id);
    }

    /**
    * 新增
    */
    @RequestMapping("/insert")
    @ResponseBody
    @XxlSso
    public Response<String> insert(Agent user){
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
    public Response<String> update(Agent user){
        return userService.update(user);
    }

}
