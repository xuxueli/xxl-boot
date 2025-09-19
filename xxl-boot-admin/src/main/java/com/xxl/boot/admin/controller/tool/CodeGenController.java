package com.xxl.boot.admin.controller.tool;

import com.xxl.boot.admin.annotation.Log;
import com.xxl.boot.admin.constant.enums.LogModuleEnum;
import com.xxl.boot.admin.constant.enums.LogTypeEnum;
import com.xxl.boot.admin.util.codegen.ClassInfo;
import com.xxl.boot.admin.util.codegen.TableParseUtil;
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
        return "tool/codegen";
    }

    @RequestMapping("/genCode")
    @ResponseBody
    @XxlSso
    @Log(type= LogTypeEnum.OPT_LOG, module = LogModuleEnum.CODE_GEN, title = "生成代码")
    public Response<Map<String, String>> codeGenerate(String tableSql) {

        try {
            if (StringTool.isBlank(tableSql)) {
                return Response.ofFail("表结构信息不可为空");
            }

            // parse table
            ClassInfo classInfo = TableParseUtil.processTableIntoClassInfo(tableSql);

            // code genarete
            Map<String, Object> params = new HashMap<String, Object>();
            params.put("classInfo", classInfo);

            // result
            Map<String, String> result = new HashMap<String, String>();

            result.put("controller_code", FtlTool.processString(freemarkerConfig,"tool/codegen-module/controller.ftl", params));
            result.put("service_code", FtlTool.processString(freemarkerConfig,"tool/codegen-module/service.ftl", params));
            result.put("service_impl_code", FtlTool.processString(freemarkerConfig,"tool/codegen-module/service_impl.ftl", params));
            result.put("mapper_code", FtlTool.processString(freemarkerConfig,"tool/codegen-module/mapper.ftl", params));
            result.put("mapper_xml_code", FtlTool.processString(freemarkerConfig,"tool/codegen-module/mapper_xml.ftl", params));
            result.put("entity_code", FtlTool.processString(freemarkerConfig,"tool/codegen-module/entity.ftl", params));
            result.put("page_code", FtlTool.processString(freemarkerConfig,"tool/codegen-module/page.ftl", params));

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
