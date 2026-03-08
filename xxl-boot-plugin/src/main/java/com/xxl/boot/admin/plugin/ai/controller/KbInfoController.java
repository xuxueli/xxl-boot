package com.xxl.boot.admin.plugin.ai.controller;

import com.xxl.boot.admin.plugin.ai.model.KbInfo;
import com.xxl.boot.admin.plugin.ai.service.KbInfoService;
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
* KbInfo Controller
*
* Created by xuxueli on '2026-03-08 09:39:11'.
*/
@Controller
@RequestMapping("/ai/kb")
public class KbInfoController {

    @Resource
    private KbInfoService kbInfoService;

    /**
    * 页面
    */
    @RequestMapping
    @XxlSso
    public String index(Model model) {
        return "/ai/kb.list";
    }

    /**
    * 分页查询
    */
    @RequestMapping("/pageList")
    @ResponseBody
    @XxlSso
    public Response<PageModel<KbInfo>> pageList(@RequestParam(required = false, defaultValue = "0") int offset,
                                                @RequestParam(required = false, defaultValue = "10") int pagesize,
                                                String kbName) {
        PageModel<KbInfo> pageModel = kbInfoService.pageList(kbName, offset, pagesize);
        return Response.ofSuccess(pageModel);
    }

    /**
    * Load查询
    */
    @RequestMapping("/load")
    @ResponseBody
    @XxlSso
    public Response<KbInfo> load(int id){
        return kbInfoService.load(id);
    }

    /**
    * 新增
    */
    @RequestMapping("/insert")
    @ResponseBody
    @XxlSso
    public Response<String> insert(KbInfo kbInfo){
        return kbInfoService.insert(kbInfo);
    }

    /**
    * 删除
    */
    @RequestMapping("/delete")
    @ResponseBody
    @XxlSso
    public Response<String> delete(@RequestParam("ids[]") List<Integer> ids){
        return kbInfoService.delete(ids);
    }

    /**
    * 更新
    */
    @RequestMapping("/update")
    @ResponseBody
    @XxlSso
    public Response<String> update(KbInfo kbInfo){
        return kbInfoService.update(kbInfo);
    }

}
