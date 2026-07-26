package com.xxl.boot.api.framework.controller.tool;

import com.xxl.boot.api.framework.annotation.XxlLog;
import com.xxl.boot.api.framework.constant.enums.LogModuleEnum;
import com.xxl.boot.api.framework.constant.enums.LogTypeEnum;
import com.xxl.boot.api.framework.model.dto.CodegenDTO;
import com.xxl.boot.api.framework.model.dto.CodegenFieldDTO;
import com.xxl.boot.api.framework.model.entity.Codegen;
import com.xxl.boot.api.framework.model.entity.CodegenField;
import com.xxl.boot.api.framework.service.CodegenService;
import com.xxl.boot.api.framework.util.codegen.ClassInfo;
import com.xxl.boot.api.framework.util.codegen.TableParseUtil;
import com.xxl.sso.core.annotation.XxlSso;
import com.xxl.tool.core.StringTool;
import com.xxl.tool.freemarker.FtlTool;
import com.xxl.tool.json.GsonTool;
import com.xxl.tool.response.PageModel;
import com.xxl.tool.response.Response;
import freemarker.template.Configuration;
import freemarker.template.TemplateException;
import jakarta.annotation.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 代码生成 Controller
 */
@RestController
@RequestMapping("/tool/codegen")
public class CodeGenController {
    private static final Logger logger = LoggerFactory.getLogger(CodeGenController.class);

    @Autowired
    private Configuration freemarkerConfig;

    @Resource
    private CodegenService codegenService;


    // ------ 代码生成表 CRUD ------

    /** 分页列表 */
    @RequestMapping("/pageList")
    @XxlSso
    public Response<PageModel<CodegenDTO>> pageList(@RequestParam(defaultValue = "0") int offset,
                                                    @RequestParam(defaultValue = "10") int pagesize,
                                                    String tableName, String tableComment) {
        return Response.ofSuccess(codegenService.pageList(tableName, tableComment, offset, pagesize));
    }

    /** 根据 ID 查询 */
    @RequestMapping("/load")
    @XxlSso
    public Response<Codegen> load(int id) {
        return codegenService.load(id);
    }

    /** 查询表详情（含字段列表 + 全量表） */
    @RequestMapping("/detail")
    @XxlSso
    public Response<Map<String, Object>> detail(int id) {
        return codegenService.loadDetail(id);
    }

    /** 新增 */
    @RequestMapping("/insert")
    @XxlSso
    @XxlLog(type= LogTypeEnum.OPT_LOG, module = LogModuleEnum.CODE_GEN, title = "新增代码生成")
    public Response<String> insert(@RequestBody Codegen xxlBootCodegen) {
        return codegenService.insert(xxlBootCodegen);
    }

    /** 更新 */
    @RequestMapping("/update")
    @XxlSso
    @XxlLog(type= LogTypeEnum.OPT_LOG, module = LogModuleEnum.CODE_GEN, title = "更新代码生成")
    public Response<String> update(@RequestBody Map<String, Object> body) {
        return codegenService.update(body);
    }

    /** 批量删除 */
    @RequestMapping("/delete")
    @XxlSso
    @XxlLog(type= LogTypeEnum.OPT_LOG, module = LogModuleEnum.CODE_GEN, title = "删除代码生成")
    public Response<String> delete(@RequestParam("ids[]") List<Integer> ids) {
        return codegenService.delete(ids);
    }

    // ------ 代码生成字段 CRUD ------

    /** 字段分页列表 */
    @RequestMapping("/fieldPageList")
    @XxlSso
    public Response<PageModel<CodegenFieldDTO>> fieldPageList(@RequestParam(defaultValue = "0") int offset,
                                                              @RequestParam(defaultValue = "10") int pagesize,
                                                              long codegenId) {
        return Response.ofSuccess(codegenService.fieldPageList(codegenId, offset, pagesize));
    }

    /** 根据 ID 查询字段 */
    @RequestMapping("/fieldLoad")
    @XxlSso
    public Response<CodegenField> fieldLoad(int id) {
        return codegenService.loadField(id);
    }

    /** 新增字段 */
    @RequestMapping("/fieldInsert")
    @XxlSso
    public Response<String> fieldInsert(CodegenField xxlBootCodegenField) {
        return codegenService.insertField(xxlBootCodegenField);
    }

    /** 更新字段 */
    @RequestMapping("/fieldUpdate")
    @XxlSso
    public Response<String> fieldUpdate(CodegenField xxlBootCodegenField) {
        return codegenService.updateField(xxlBootCodegenField);
    }

    /** 批量删除字段 */
    @RequestMapping("/fieldDelete")
    @XxlSso
    public Response<String> fieldDelete(@RequestParam("ids[]") List<Integer> ids) {
        return codegenService.deleteField(ids);
    }

    // ------ 数据库导入导出操作 ------

    /** 通过 SQL 建表 */
    @RequestMapping("/createTable")
    @XxlSso
    @XxlLog(type= LogTypeEnum.OPT_LOG, module = LogModuleEnum.CODE_GEN, title = "创建数据表")
    public Response<String> createTable(String tableSql) {
        return codegenService.createTable(tableSql);
    }

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

    /** 在线代码生成（旧版） */
    @RequestMapping("/genCode")
    @XxlSso
    @XxlLog(type= LogTypeEnum.OPT_LOG, module = LogModuleEnum.CODE_GEN, title = "生成代码")
    public Response<Map<String, String>> codeGenerate(String tableSql, String author,
                                                      String packagePath, String businessName) {
        try {
            if (StringTool.isBlank(tableSql)) return Response.ofFail("表结构信息不可为空");
            if (StringTool.isBlank(author)) return Response.ofFail("Author不可为空");
            if (StringTool.isBlank(packagePath)) return Response.ofFail("Package路径不可为空");

            ClassInfo classInfo = TableParseUtil.processTableIntoClassInfo(tableSql);
            classInfo.setAuthor(author); classInfo.setPackageName(packagePath);
            if (StringTool.isNotBlank(businessName)) classInfo.setClassName(businessName);

            Map<String, Object> params = new HashMap<>();
            params.put("classInfo", classInfo);
            Map<String, String> result = new HashMap<>();
            result.put("controller_code", FtlTool.processString(freemarkerConfig,"/framework/tool/codegen-module/controller.ftl", params));
            result.put("service_code", FtlTool.processString(freemarkerConfig,"/framework/tool/codegen-module/service.ftl", params));
            result.put("service_impl_code", FtlTool.processString(freemarkerConfig,"/framework/tool/codegen-module/service_impl.ftl", params));
            result.put("mapper_code", FtlTool.processString(freemarkerConfig,"/framework/tool/codegen-module/mapper.ftl", params));
            result.put("mapper_xml_code", FtlTool.processString(freemarkerConfig,"/framework/tool/codegen-module/mapper_xml.ftl", params));
            result.put("entity_code", FtlTool.processString(freemarkerConfig,"/framework/tool/codegen-module/entity.ftl", params));
            result.put("page_code", FtlTool.processString(freemarkerConfig,"/framework/tool/codegen-module/page.ftl", params));

            int lineNum = 0;
            for (Map.Entry<String, String> item: result.entrySet()) {
                if (item.getValue() != null) lineNum += StringTool.countMatches(item.getValue(), "\n");
            }
            logger.info("genCode lineNum：{}", lineNum);
            return Response.ofSuccess(result);
        } catch (IOException | TemplateException e) {
            logger.error(e.getMessage(), e);
            return Response.ofFail("表结构解析失败");
        }
    }
}
