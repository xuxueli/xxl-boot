package com.xxl.boot.admin.framework.controller.tool;

import com.xxl.boot.admin.framework.annotation.XxlLog;
import com.xxl.boot.admin.framework.constant.enums.LogModuleEnum;
import com.xxl.boot.admin.framework.constant.enums.LogTypeEnum;
import com.xxl.boot.admin.framework.util.codegen.ClassInfo;
import com.xxl.boot.admin.framework.util.codegen.TableParseUtil;
import com.xxl.sso.core.annotation.XxlSso;
import com.xxl.tool.core.StringTool;
import com.xxl.tool.freemarker.FtlTool;
import com.xxl.tool.response.Response;
import freemarker.template.Configuration;
import freemarker.template.TemplateException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * 代码生成 Controller，根据建表 SQL 生成对应代码文件
 *
 * @author xuxueli 2024-01-01
 */
@Controller
@RequestMapping("/tool/codegen")
public class CodeGenController {
    private static final Logger logger = LoggerFactory.getLogger(CodeGenController.class);

    @Autowired
    private Configuration freemarkerConfig;

    /**
     * 代码生成页面
     */
    @RequestMapping
    @XxlSso
    public String index(Model model) {
        return "/framework/tool/codegen";
    }

    /**
     * 根据建表 SQL 生成代码
     */
    @RequestMapping("/genCode")
    @ResponseBody
    @XxlSso
    @XxlLog(type= LogTypeEnum.OPT_LOG, module = LogModuleEnum.CODE_GEN, title = "生成代码")
    public Response<Map<String, String>> codeGenerate(String tableSql,
                                                       String author,
                                                       String packagePath,
                                                       String businessName) {

        try {
            // 参数校验
            if (StringTool.isBlank(tableSql)) {
                return Response.ofFail("表结构信息不可为空");
            }
            if (StringTool.isBlank(author)) {
                return Response.ofFail("Author不可为空");
            }
            if (StringTool.isBlank(packagePath)) {
                return Response.ofFail("Package路径不可为空");
            }

            // 解析表结构
            ClassInfo classInfo = TableParseUtil.processTableIntoClassInfo(tableSql);
            classInfo.setAuthor(author);
            classInfo.setPackageName(packagePath);
            if (StringTool.isNotBlank(businessName)) {
                classInfo.setClassName(businessName);
            }

            // 准备 FreeMarker 模板参数
            Map<String, Object> params = new HashMap<String, Object>();
            params.put("classInfo", classInfo);

            // 通过模板生成各层代码
            Map<String, String> result = new HashMap<String, String>();
            result.put("controller_code", FtlTool.processString(freemarkerConfig,"/framework/tool/codegen-module/controller.ftl", params));
            result.put("service_code", FtlTool.processString(freemarkerConfig,"/framework/tool/codegen-module/service.ftl", params));
            result.put("service_impl_code", FtlTool.processString(freemarkerConfig,"/framework/tool/codegen-module/service_impl.ftl", params));
            result.put("mapper_code", FtlTool.processString(freemarkerConfig,"/framework/tool/codegen-module/mapper.ftl", params));
            result.put("mapper_xml_code", FtlTool.processString(freemarkerConfig,"/framework/tool/codegen-module/mapper_xml.ftl", params));
            result.put("entity_code", FtlTool.processString(freemarkerConfig,"/framework/tool/codegen-module/entity.ftl", params));
            result.put("page_code", FtlTool.processString(freemarkerConfig,"/framework/tool/codegen-module/page.ftl", params));

            // 统计生成代码行数
            int lineNum = 0;
            for (Map.Entry<String, String> item: result.entrySet()) {
                if (item.getValue() != null) {
                    lineNum += StringTool.countMatches(item.getValue(), "\n");
                }
            }
            logger.info("genCode lineNum：{}", lineNum);

            return Response.ofSuccess(result);
        } catch (IOException | TemplateException e) {
            logger.error(e.getMessage(), e);
            return Response.ofFail("表结构解析失败");
        }
    }


}
