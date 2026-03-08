package com.xxl.boot.admin.plugin.ai.controller;

import com.xxl.boot.admin.plugin.ai.constant.enums.KbDucumentStatusEnum;
import com.xxl.boot.admin.plugin.ai.model.KbDocument;
import com.xxl.boot.admin.plugin.ai.model.KbInfo;
import com.xxl.boot.admin.plugin.ai.service.KbDocumentService;
import com.xxl.boot.admin.plugin.ai.service.KbEmbeddingService;
import com.xxl.boot.admin.plugin.ai.service.KbInfoService;
import com.xxl.tool.error.BizException;
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
* KbDocument Controller
*
* Created by xuxueli on '2026-03-08 10:57:39'.
*/
@Controller
@RequestMapping("/ai/kb/document")
public class KbDocumentController {

    @Resource
    private KbDocumentService kbDocumentService;
    @Resource
    private KbInfoService KbIndexService;
    @Resource
    private KbEmbeddingService kbEmbeddingService;

    /**
    * 页面
    */
    @RequestMapping
    @XxlSso
    public String index(Model model, @RequestParam(required = false, defaultValue = "0") Long kbId) {

        // load kb info
        Response<KbInfo> kbInfo = KbIndexService.load(kbId);
        if (!Response.isSuccess(kbInfo)) {
            throw new BizException("知识库[" + kbId + "]不存在");
        }
        model.addAttribute("kbInfo", kbInfo.getData());
        // document status
        model.addAttribute("KbDucumentStatusEnum", KbDucumentStatusEnum.values());

        return "/ai/document.list";
    }

    /**
    * 分页查询
    */
    @RequestMapping("/pageList")
    @ResponseBody
    @XxlSso
    public Response<PageModel<KbDocument>> pageList(@RequestParam(required = false, defaultValue = "0") int offset,
                                                    @RequestParam(required = false, defaultValue = "10") int pagesize,
                                                    String docName) {
        PageModel<KbDocument> pageModel = kbDocumentService.pageList(docName, offset, pagesize);
        return Response.ofSuccess(pageModel);
    }

    /**
    * Load查询
    */
    @RequestMapping("/load")
    @ResponseBody
    @XxlSso
    public Response<KbDocument> load(int id){
        return kbDocumentService.load(id);
    }

    /**
    * 新增
    */
    @RequestMapping("/insert")
    @ResponseBody
    @XxlSso
    public Response<String> insert(KbDocument kbDocument){
        return kbDocumentService.insert(kbDocument);
    }

    /**
    * 删除
    */
    @RequestMapping("/delete")
    @ResponseBody
    @XxlSso
    public Response<String> delete(@RequestParam("ids[]") List<Integer> ids){
        return kbDocumentService.delete(ids);
    }

    /**
    * 更新
    */
    @RequestMapping("/update")
    @ResponseBody
    @XxlSso
    public Response<String> update(KbDocument kbDocument){
        return kbDocumentService.update(kbDocument);
    }

}
