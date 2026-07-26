package com.xxl.boot.api.framework.service.impl;

import com.xxl.boot.api.framework.mapper.tool.CodegenFieldMapper;
import com.xxl.boot.api.framework.mapper.tool.CodegenMapper;
import com.xxl.boot.api.framework.model.adaptor.CodegenAdaptor;
import com.xxl.boot.api.framework.model.adaptor.CodegenFieldAdaptor;
import com.xxl.boot.api.framework.model.dto.CodegenDTO;
import com.xxl.boot.api.framework.model.dto.CodegenFieldDTO;
import com.xxl.boot.api.framework.model.entity.Codegen;
import com.xxl.boot.api.framework.model.entity.CodegenField;
import com.xxl.boot.api.framework.service.CodegenService;
import com.xxl.boot.api.framework.util.codegen.ClassInfo;
import com.xxl.boot.api.framework.util.codegen.FieldInfo;
import com.xxl.boot.api.framework.util.codegen.TableParseUtil;
import com.xxl.tool.core.StringTool;
import com.xxl.tool.freemarker.FtlTool;
import com.xxl.tool.response.PageModel;
import com.xxl.tool.response.Response;
import freemarker.template.Configuration;
import freemarker.template.TemplateException;
import jakarta.annotation.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

/**
 * 代码生成 Service 实现
 */
@Service
public class CodegenServiceImpl implements CodegenService {

    private static final Logger logger = LoggerFactory.getLogger(CodegenServiceImpl.class);

    @Resource private CodegenMapper codegenMapper;
    @Resource private CodegenFieldMapper codegenFieldMapper;
    @Resource private Configuration freemarkerConfig;

    private static final String TPL_PATH = "/tool/codegen2/";

    @Override
    public PageModel<CodegenDTO> pageList(String tableName, String tableComment, int offset, int pagesize) {
        List<Codegen> list = codegenMapper.pageList(tableName, tableComment, offset, pagesize);
        int total = codegenMapper.pageListCount(tableName, tableComment, offset, pagesize);
        PageModel<CodegenDTO> pm = new PageModel<>();
        pm.setData(CodegenAdaptor.adaptor(list));
        pm.setTotal(total);
        return pm;
    }

    @Override
    public Response<String> delete(List<Integer> ids) {
        codegenFieldMapper.deleteByCodegenIds(ids);
        return codegenMapper.delete(ids) > 0 ? Response.ofSuccess() : Response.ofFail();
    }

    @Override
    public Response<String> update(CodegenDTO dto) {
        Codegen c = new Codegen();
        c.setId(dto.getId());
        c.setTableName(dto.getTableName());
        c.setTableComment(dto.getTableComment());
        c.setRemark(dto.getRemark());
        c.setPackageName(dto.getPackageName());
        c.setModuleName(dto.getModuleName());
        c.setBusinessName(dto.getBusinessName());
        c.setFunctionName(dto.getFunctionName());
        c.setFunctionAuthor(dto.getFunctionAuthor());
        c.setFormColNum(dto.getFormColNum());
        c.setTplCategory(dto.getTplCategory());
        c.setTplWebType(dto.getTplWebType());

        int ret = codegenMapper.update(c);
        if (ret <= 0) return Response.ofFail();

        // 保存字段
        List<CodegenFieldDTO> fieldList = dto.getFieldList();
        if (fieldList != null && !fieldList.isEmpty()) {
            codegenFieldMapper.deleteByCodegenIds(List.of((int) c.getId()));
            for (CodegenFieldDTO fd : fieldList) {
                codegenFieldMapper.insert(toEntity(c.getId(), fd));
            }
        }
        return Response.ofSuccess();
    }

    private CodegenField toEntity(long codegenId, CodegenFieldDTO dto) {
        CodegenField f = new CodegenField();
        f.setId(dto.getId());
        f.setCodegenId(codegenId);
        f.setColumnName(dto.getColumnName());
        f.setColumnComment(dto.getColumnComment());
        f.setJavaType(dto.getJavaType());
        f.setJavaField(dto.getJavaField());
        f.setIsRequired(dto.getIsRequired());
        f.setIsInsert(dto.getIsInsert());
        f.setIsEdit(dto.getIsEdit());
        f.setIsList(dto.getIsList());
        f.setIsQuery(dto.getIsQuery());
        f.setQueryType(dto.getQueryType());
        f.setHtmlType(dto.getHtmlType());
        f.setDictType(dto.getDictType());
        f.setSort(dto.getSort());
        return f;
    }

    @Override
    public Response<CodegenDTO> loadDetail(int id) {
        Codegen entity = codegenMapper.load(id);
        List<CodegenField> rows = codegenFieldMapper.findByCodegenId(id);

        List<CodegenDTO> list = CodegenAdaptor.adaptor(List.of(entity));
        CodegenDTO dto = list.get(0);
        dto.setFieldList(CodegenFieldAdaptor.adaptor(rows));

        return Response.ofSuccess(dto);
    }

    @Override
    public Response<String> createTable(String tableSql) {
        try {
            // parse class-info
            ClassInfo ci = TableParseUtil.processTableIntoClassInfo(tableSql);

            Codegen c = new Codegen();
            c.setTableName(ci.getTableName());
            c.setTableComment(ci.getClassComment());
            c.setPackageName("com.xxl.boot.api.business");
            c.setModuleName("demo");
            c.setBusinessName(ci.getClassName());

            String funcName = ci.getClassComment() != null && !ci.getClassComment().isEmpty()
                    ? ci.getClassComment()
                    : ci.getClassName() + "管理";
            c.setFunctionName(funcName);
            c.setFunctionAuthor("xxl-boot");
            c.setFormColNum(1);
            c.setTplCategory("crud");
            codegenMapper.insert(c);

            // 保存字段
            if (ci.getFieldList() != null) {
                for (int i = 0; i < ci.getFieldList().size(); i++) {
                    FieldInfo fi = ci.getFieldList().get(i);
                    String colName = fi.getColumnName().toLowerCase();

                    CodegenField f = new CodegenField();
                    f.setCodegenId(c.getId());
                    f.setColumnName(fi.getColumnName());
                    f.setColumnComment(fi.getFieldComment());
                    f.setJavaField(fi.getFieldName());
                    f.setJavaType(fi.getFieldClass());

                    boolean isWhitelist = List.of("id", "add_time", "update_time").contains(colName);
                    f.setIsInsert("1");
                    f.setIsEdit("1");
                    f.setIsList(isWhitelist ? "0" : "1");
                    f.setIsQuery(isWhitelist ? "0" : "1");
                    f.setIsRequired("0");

                    f.setQueryType(colName.endsWith("name") || colName.endsWith("title") ? "LIKE" : "EQ");
                    f.setHtmlType(inferHtmlType(colName, fi.getFieldClass(), fi.getColumnType()));
                    f.setSort(i + 1);
                    codegenFieldMapper.insert(f);
                }
            }
            return Response.ofSuccess();
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return Response.ofFail("建表失败");
        }
    }

    /** 根据列名、Java类型、SQL类型推断合适的显示组件 */
    private String inferHtmlType(String colName, String javaType, String sqlType) {
        if (sqlType != null) {
            String st = sqlType.toLowerCase();
            if (st.contains("text") || st.contains("blob")) {
                return "textarea";
            }
            if (st.startsWith("tinyint") && colName.contains("status")) {
                return "radio";
            }
        }
        if (colName.endsWith("status") || colName.endsWith("type") || colName.equals("sex")) {
            return "radio";
        }
        if (colName.endsWith("content") || colName.endsWith("description") || colName.endsWith("desc")) {
            return "editor";
        }
        if (colName.endsWith("image") || colName.endsWith("img") || colName.endsWith("avatar")) {
            return "imageUpload";
        }
        if (colName.endsWith("file") || colName.endsWith("attachment")) {
            return "fileUpload";
        }
        if (colName.endsWith("time") || colName.endsWith("date")) {
            return "datetime";
        }
        if ("String".equals(javaType) && sqlType != null && sqlType.contains("(")) {
            String digits = sqlType.replaceAll("\\D", "");
            if (!digits.isEmpty() && Integer.parseInt(digits) > 500) {
                return "textarea";
            }
        }
        return "input";
    }

    @Override
    public Response<Map<String, String>> preview(int id) {
        Codegen codegen = codegenMapper.load(id);
        if (codegen == null) return Response.ofFail("表不存在");
        List<CodegenField> fields = codegenFieldMapper.findByCodegenId(id);
        try {

            // build template data
            ClassInfo ci = toClassInfo(codegen, fields);
            Map<String, Object> params = new HashMap<>();
            params.put("classInfo", ci);

            // 单表：生成代码预览
            Map<String, String> result = new LinkedHashMap<>();
            result.put("java/domain.java.vm", render("entity.ftl", params));
            result.put("java/mapper.java.vm", render("mapper.ftl", params));
            result.put("java/mapper.xml.vm", render("mapper_xml.ftl", params));
            result.put("java/service.java.vm", render("service.ftl", params));
            result.put("java/serviceImpl.java.vm", render("service_impl.ftl", params));
            result.put("java/controller.java.vm", render("controller.ftl", params));
            result.put("vue/page.vue.vm", render("page.ftl", params));

            return Response.ofSuccess(result);
        } catch (IOException | TemplateException e) {
            logger.error(e.getMessage(), e);
            return Response.ofFail("代码生成失败");
        }
    }

    @Override
    public byte[] downloadCode(List<Integer> ids) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        // 多表下载
        try (ZipOutputStream zos = new ZipOutputStream(baos)) {
            for (int id : ids) {

                // load data
                Codegen codegen = codegenMapper.load(id);
                if (codegen == null) continue;
                List<CodegenField> fields = codegenFieldMapper.findByCodegenId(codegen.getId());

                // build template data
                ClassInfo ci = toClassInfo(codegen, fields);
                Map<String, Object> params = new HashMap<>();
                params.put("classInfo", ci);

                String pkg = codegen.getPackageName() != null ? codegen.getPackageName().replace('.', '/') : "com/xxl/boot/demo";
                String cn = toPascalCase(codegen.getBusinessName() != null ? codegen.getBusinessName() : "demo");
                String module = codegen.getModuleName() != null ? codegen.getModuleName() : "demo";

                // 单表：生成代码预览
                addZipEntry(zos, "main/java/" + pkg + "/domain/" + cn + ".java", render("entity.ftl", params));
                addZipEntry(zos, "main/java/" + pkg + "/mapper/" + cn + "Mapper.java", render("mapper.ftl", params));
                addZipEntry(zos, "main/resources/mapper/" + module + "/" + cn + "Mapper.xml", render("mapper_xml.ftl", params));
                addZipEntry(zos, "main/java/" + pkg + "/service/I" + cn + "Service.java", render("service.ftl", params));
                addZipEntry(zos, "main/java/" + pkg + "/service/impl/" + cn + "ServiceImpl.java", render("service_impl.ftl", params));
                addZipEntry(zos, "main/java/" + pkg + "/controller/" + cn + "Controller.java", render("controller.ftl", params));
                addZipEntry(zos, "vue/views/" + module + "/" + codegen.getBusinessName() + "/index.vue", render("page.ftl", params));
            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return null;
        }
        return baos.toByteArray();
    }


    /**
     * 渲染 FreeMarker 模板
     */
    private String render(String ftl, Map<String, Object> params) throws IOException, TemplateException {
        return FtlTool.processString(freemarkerConfig, TPL_PATH + ftl, params);
    }

    /**
     * 写入文件到 zip 包
     *
     * @param zos ZipOutputStream,
     * @param name 文件名
     * @param content 文件内容
     */
    private void addZipEntry(ZipOutputStream zos, String name, String content) throws IOException {
        if (content == null) return;
        zos.putNextEntry(new ZipEntry(name));
        zos.write(content.getBytes(StandardCharsets.UTF_8));
        zos.closeEntry();
    }

    private ClassInfo toClassInfo(Codegen codegen, List<CodegenField> fields) {
        ClassInfo ci = new ClassInfo();
        ci.setTableName(codegen.getTableName());
        ci.setClassComment(codegen.getTableComment());
        ci.setClassName(toPascalCase(codegen.getBusinessName() != null ? codegen.getBusinessName() : "demo"));
        ci.setPackageName(codegen.getPackageName());
        ci.setAuthor(codegen.getFunctionAuthor());
        List<FieldInfo> fl = new ArrayList<>();
        for (CodegenField f : fields) {
            FieldInfo fi = new FieldInfo();
            fi.setColumnName(f.getColumnName());
            fi.setFieldName(f.getJavaField());
            fi.setFieldClass(f.getJavaType());
            fi.setFieldComment(f.getColumnComment());
            fl.add(fi);
        }
        ci.setFieldList(fl);
        return ci;
    }

    private String toPascalCase(String name) {
        if (name == null || name.isEmpty()) return name;
        String camel = StringTool.underlineToCamelCase(name);
        return StringTool.upperCaseFirst(camel);
    }

}
