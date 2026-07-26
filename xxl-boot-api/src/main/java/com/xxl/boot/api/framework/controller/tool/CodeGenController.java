package com.xxl.boot.api.framework.controller.tool;

import com.xxl.boot.api.framework.annotation.XxlLog;
import com.xxl.boot.api.framework.constant.enums.LogModuleEnum;
import com.xxl.boot.api.framework.constant.enums.LogTypeEnum;
import com.xxl.boot.api.framework.model.dto.CodegenDTO;
import com.xxl.boot.api.framework.service.CodegenService;
import com.xxl.sso.core.annotation.XxlSso;
import com.xxl.tool.core.StringTool;
import com.xxl.tool.json.GsonTool;
import com.xxl.tool.response.PageModel;
import com.xxl.tool.response.Response;
import jakarta.annotation.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.List;
import java.util.Map;

/**
 * 代码生成 Controller
 */
@RestController
@RequestMapping("/tool/codegen")
public class CodeGenController {
    private static final Logger logger = LoggerFactory.getLogger(CodeGenController.class);

    @Resource
    private CodegenService codegenService;


    // ------ 代码生成 数据管理 ------

    /** 分页列表 */
    @RequestMapping("/pageList")
    @XxlSso
    public Response<PageModel<CodegenDTO>> pageList(@RequestParam(defaultValue = "0") int offset,
                                                    @RequestParam(defaultValue = "10") int pagesize,
                                                    String tableName, String tableComment) {
        return Response.ofSuccess(codegenService.pageList(tableName, tableComment, offset, pagesize));
    }

    /** 查询表详情（含字段列表） */
    @RequestMapping("/detail")
    @XxlSso
    public Response<CodegenDTO> detail(int id) {
        return codegenService.loadDetail(id);
    }

    /** 更新 */
    @RequestMapping("/update")
    @XxlSso
    @XxlLog(type= LogTypeEnum.OPT_LOG, module = LogModuleEnum.CODE_GEN, title = "更新代码生成")
    public Response<String> update(@RequestBody CodegenDTO dto) {
        return codegenService.update(dto);
    }

    /** 批量删除 */
    @RequestMapping("/delete")
    @XxlSso
    @XxlLog(type= LogTypeEnum.OPT_LOG, module = LogModuleEnum.CODE_GEN, title = "删除代码生成")
    public Response<String> delete(@RequestParam("ids[]") List<Integer> ids) {
        return codegenService.delete(ids);
    }

    /** 通过 SQL 建表 */
    @RequestMapping("/createTable")
    @XxlSso
    @XxlLog(type= LogTypeEnum.OPT_LOG, module = LogModuleEnum.CODE_GEN, title = "创建数据表")
    public Response<String> createTable(String tableSql) {
        return codegenService.createTable(tableSql);
    }

    // ------ 生成操作 ------

    /** 预览生成代码 */
    @RequestMapping("/preview")
    @XxlSso
    public Response<Map<String, String>> preview(int id) {
        return codegenService.preview(id);
    }

    /** 批量生成代码（下载 zip） */
    @GetMapping("/batchGenCode")
    @XxlSso
    @XxlLog(type= LogTypeEnum.OPT_LOG, module = LogModuleEnum.CODE_GEN, title = "批量生成代码")
    public void batchGenCode(HttpServletResponse response, String tables) throws IOException {
        if (StringTool.isBlank(tables)) {
            response.setContentType("application/json;charset=utf-8");
            response.getWriter().write(GsonTool.toJson(Response.ofFail("请选择要生成的表")));
            return;
        }
        byte[] data = codegenService.downloadCode(tables.split(","));
        if (data == null || data.length == 0) {
            response.setContentType("application/json;charset=utf-8");
            response.getWriter().write(GsonTool.toJson(Response.ofFail("生成失败")));
            return;
        }

        // write zip file
        response.reset();
        response.addHeader("Access-Control-Allow-Origin", "*");
        response.addHeader("Access-Control-Expose-Headers", "Content-Disposition");
        response.setHeader("Content-Disposition", "attachment; filename=\"boot.zip\"");
        response.addHeader("Content-Length", "" + data.length);
        response.setContentType("application/octet-stream; charset=UTF-8");
        response.getOutputStream().write(data);
    }

}
