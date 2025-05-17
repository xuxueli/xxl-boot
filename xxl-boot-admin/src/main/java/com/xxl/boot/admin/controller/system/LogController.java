package com.xxl.boot.admin.controller.system;

import com.xxl.boot.admin.constant.enums.LogModuleEnum;
import com.xxl.boot.admin.constant.enums.LogTypeEnum;
import com.xxl.boot.admin.model.dto.XxlBootLogDTO;
import com.xxl.boot.admin.model.entity.XxlBootLog;
import com.xxl.boot.admin.service.LogService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import javax.annotation.Resource;

import com.xxl.tool.response.Response;
import com.xxl.tool.response.PageModel;
import com.xxl.boot.admin.annotation.Permission;

/**
 * XxlBootLog Controller
 *
 * Created by xuxueli on '2024-10-27 12:19:06'.
 */
@Controller
@RequestMapping("/system/log")
public class LogController {

    @Resource
    private LogService xxlBootLogService;

    /**
     * 页面
     */
    @RequestMapping
    @Permission
    public String index(Model model) {

        model.addAttribute("LogTypeEnum", LogTypeEnum.values());
        model.addAttribute("LogModuleEnum", LogModuleEnum.values());

        return "system/log";
    }

    /**
     * 分页查询
     */
    @RequestMapping("/pageList")
    @ResponseBody
    @Permission
    public Response<PageModel<XxlBootLogDTO>> pageList(@RequestParam(required = false, defaultValue = "-1") int type,
                                                    String module,
                                                    String title,
                                                    @RequestParam(required = false, defaultValue = "0") int offset,
                                                    @RequestParam(required = false, defaultValue = "10") int pagesize) {
        PageModel<XxlBootLogDTO> pageModel = xxlBootLogService.pageList(type, module, title, offset, pagesize);
        return Response.ofSuccess(pageModel);
    }

    /**
     * Load查询
     */
    @RequestMapping("/load")
    @ResponseBody
    @Permission
    public Response<XxlBootLog> load(int id){
        return xxlBootLogService.load(id);
    }

    /**
     * 新增
     */
    @RequestMapping("/insert")
    @ResponseBody
    @Permission
    public Response<String> insert(XxlBootLog xxlBootLog){
        return xxlBootLogService.insert(xxlBootLog);
    }

    /**
     * 删除
     */
    @RequestMapping("/delete")
    @ResponseBody
    @Permission
    public Response<String> delete(@RequestParam("ids[]") List<Integer> ids){
        return xxlBootLogService.delete(ids);
    }

    /**
     * 更新
     */
    @RequestMapping("/update")
    @ResponseBody
    @Permission
    public Response<String> update(XxlBootLog xxlBootLog){
        return xxlBootLogService.update(xxlBootLog);
    }

}