package com.xxl.boot.admin.plugin.ai.controller;

import com.xxl.boot.admin.plugin.ai.constant.enums.AgentTypeEnum;
import com.xxl.boot.admin.plugin.ai.constant.enums.SupplierTypeEnum;
import com.xxl.boot.admin.plugin.ai.model.Agent;
import com.xxl.boot.admin.plugin.ai.service.AgentService;
import org.springframework.beans.propertyeditors.CustomDateEditor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.InitBinder;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import jakarta.annotation.Resource;

import com.xxl.tool.response.Response;
import com.xxl.tool.response.PageModel;
import com.xxl.sso.core.annotation.XxlSso;

/**
* Agent Controller
*
* Created by xuxueli on '2025-12-21 16:13:29'.
*/
@Controller
@RequestMapping("/ai/agent")
public class AgentController {

    @Resource
    private AgentService agentService;

    /**
    * 页面
    */
    @RequestMapping
    @XxlSso(permission = "ai:agent")
    public String index(Model model) {

        // set enum
        model.addAttribute("AgentTypeEnum", AgentTypeEnum.values());
        model.addAttribute("SupplierTypeEnum", SupplierTypeEnum.values());

        return "/ai/agent.list";
    }

    /**
    * 分页查询
    */
    @RequestMapping("/pageList")
    @ResponseBody
    @XxlSso(permission = "ai:agent")
    public Response<PageModel<Agent>> pageList(@RequestParam(required = false, defaultValue = "0") int offset,
                                               @RequestParam(required = false, defaultValue = "10") int pagesize,
                                               int agentType,
                                               String name) {
        PageModel<Agent> pageModel = agentService.pageList(offset, pagesize, agentType, name);
        return Response.ofSuccess(pageModel);
    }

    /**
    * Load查询
    */
    @RequestMapping("/load")
    @ResponseBody
    @XxlSso(permission = "ai:agent")
    public Response<Agent> load(int id){
        return agentService.load(id);
    }

    /**
    * 新增
    */
    @RequestMapping("/insert")
    @ResponseBody
    @XxlSso
    public Response<String> insert(Agent agent){
        return agentService.insert(agent);
    }

    /**
    * 删除
    */
    @RequestMapping("/delete")
    @ResponseBody
    @XxlSso(permission = "ai:agent")
    public Response<String> delete(@RequestParam("ids[]") List<Integer> ids){
        return agentService.delete(ids);
    }

    /**
    * 更新
    */
    @RequestMapping("/update")
    @ResponseBody
    @XxlSso(permission = "ai:agent")
    public Response<String> update(Agent agent){
        return agentService.update(agent);
    }

    @InitBinder
    public void initBinder(WebDataBinder binder) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        dateFormat.setLenient(false);
        binder.registerCustomEditor(Date.class, new CustomDateEditor(dateFormat, true));
    }

}
