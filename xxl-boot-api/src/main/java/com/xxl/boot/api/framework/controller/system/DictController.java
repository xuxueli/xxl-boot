package com.xxl.boot.api.framework.controller.system;

import com.xxl.boot.api.framework.constant.enums.DictStatusEnum;
import com.xxl.boot.api.framework.model.dto.XxlBootDictDTO;
import com.xxl.boot.api.framework.model.dto.XxlBootDictItemDTO;
import com.xxl.boot.api.framework.model.entity.XxlBootDict;
import com.xxl.boot.api.framework.model.entity.XxlBootDictItem;
import com.xxl.boot.api.framework.service.DictService;
import com.xxl.sso.core.annotation.XxlSso;
import com.xxl.tool.response.PageModel;
import com.xxl.tool.response.Response;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;

@Controller
@RequestMapping("/system/dict")
public class DictController {

    @Resource
    private DictService dictService;

    @RequestMapping
    @XxlSso
    public String index(Model model) {
        model.addAttribute("DictStatusEnum", DictStatusEnum.values());
        return "/framework/system/dict";
    }

    @RequestMapping("/pageList")
    @ResponseBody
    @XxlSso
    public Response<PageModel<XxlBootDictDTO>> pageList(@RequestParam(required = false, defaultValue = "0") int offset,
                                                        @RequestParam(required = false, defaultValue = "10") int pagesize,
                                                        @RequestParam(required = false, defaultValue = "-1") int status,
                                                        String name,
                                                        String code) {
        PageModel<XxlBootDictDTO> pageModel = dictService.pageList(name, code, status, offset, pagesize);
        return Response.ofSuccess(pageModel);
    }

    @RequestMapping("/load")
    @ResponseBody
    @XxlSso
    public Response<XxlBootDict> load(int id) {
        return dictService.load(id);
    }

    @RequestMapping("/insert")
    @ResponseBody
    @XxlSso
    public Response<String> insert(XxlBootDict xxlBootDict) {
        return dictService.insert(xxlBootDict);
    }

    @RequestMapping("/delete")
    @ResponseBody
    @XxlSso
    public Response<String> delete(@RequestParam("ids[]") List<Integer> ids) {
        return dictService.delete(ids);
    }

    @RequestMapping("/update")
    @ResponseBody
    @XxlSso
    public Response<String> update(XxlBootDict xxlBootDict) {
        return dictService.update(xxlBootDict);
    }

    @RequestMapping("/itemPageList")
    @ResponseBody
    @XxlSso
    public Response<PageModel<XxlBootDictItemDTO>> itemPageList(@RequestParam(required = false, defaultValue = "0") int offset,
                                                                @RequestParam(required = false, defaultValue = "10") int pagesize,
                                                                long dictId) {
        PageModel<XxlBootDictItemDTO> pageModel = dictService.itemPageList(dictId, offset, pagesize);
        return Response.ofSuccess(pageModel);
    }

    @RequestMapping("/itemLoad")
    @ResponseBody
    @XxlSso
    public Response<XxlBootDictItem> itemLoad(int id) {
        return dictService.loadItem(id);
    }

    @RequestMapping("/itemInsert")
    @ResponseBody
    @XxlSso
    public Response<String> itemInsert(XxlBootDictItem xxlBootDictItem) {
        return dictService.insertItem(xxlBootDictItem);
    }

    @RequestMapping("/itemDelete")
    @ResponseBody
    @XxlSso
    public Response<String> itemDelete(@RequestParam("ids[]") List<Integer> ids) {
        return dictService.deleteItem(ids);
    }

    @RequestMapping("/itemUpdate")
    @ResponseBody
    @XxlSso
    public Response<String> itemUpdate(XxlBootDictItem xxlBootDictItem) {
        return dictService.updateItem(xxlBootDictItem);
    }

}
