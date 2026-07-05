package com.xxl.boot.api.framework.controller.tool;

import com.xxl.boot.api.framework.annotation.XxlLog;
import com.xxl.boot.api.framework.constant.enums.LogModuleEnum;
import com.xxl.boot.api.framework.constant.enums.LogTypeEnum;
import com.xxl.boot.api.framework.util.codegen.ClassInfo;
import com.xxl.boot.api.framework.util.codegen.TableParseUtil;
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

@Controller
@RequestMapping("/tool/codegen")
public class CodeGenController {
    private static final Logger logger = LoggerFactory.getLogger(CodeGenController.class);

    @Autowired
    private Configuration freemarkerConfig;

    @RequestMapping
    @XxlSso
    public String index(Model model) {
        return "/framework/tool/codegen";
    }

    @RequestMapping("/genCode")
    @ResponseBody
    @XxlSso
    @XxlLog(type= LogTypeEnum.OPT_LOG, module = LogModuleEnum.CODE_GEN, title = "生成代码")
    public Response<Map<String, String>> codeGenerate(String tableSql,
                                                      String author,
                                                      String packagePath,
                                                      String businessName) {

        try {
            if (StringTool.isBlank(tableSql)) {
                return Response.ofFail("表结构信息不可为空");
            }
            if (StringTool.isBlank(author)) {
                return Response.ofFail("Author不可为空");
            }
            if (StringTool.isBlank(packagePath)) {
                return Response.ofFail("Package路径不可为空");
            }

            // parse table
            ClassInfo classInfo = TableParseUtil.processTableIntoClassInfo(tableSql);
            classInfo.setAuthor(author);
            classInfo.setPackageName(packagePath);
            if (StringTool.isNotBlank(businessName)) {
                classInfo.setClassName(businessName);
            }

            // code genarete
            Map<String, Object> params = new HashMap<String, Object>();
            params.put("classInfo", classInfo);

            // result
            Map<String, String> result = new HashMap<String, String>();

            result.put("controller_code", FtlTool.processString(freemarkerConfig,"/framework/tool/codegen-module/controller.ftl", params));
            result.put("service_code", FtlTool.processString(freemarkerConfig,"/framework/tool/codegen-module/service.ftl", params));
            result.put("service_impl_code", FtlTool.processString(freemarkerConfig,"/framework/tool/codegen-module/service_impl.ftl", params));
            result.put("mapper_code", FtlTool.processString(freemarkerConfig,"/framework/tool/codegen-module/mapper.ftl", params));
            result.put("mapper_xml_code", FtlTool.processString(freemarkerConfig,"/framework/tool/codegen-module/mapper_xml.ftl", params));
            result.put("entity_code", FtlTool.processString(freemarkerConfig,"/framework/tool/codegen-module/entity.ftl", params));
            result.put("page_code", FtlTool.processString(freemarkerConfig,"/framework/tool/codegen-module/page.ftl", params));

            // 计算,生成代码行数
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
