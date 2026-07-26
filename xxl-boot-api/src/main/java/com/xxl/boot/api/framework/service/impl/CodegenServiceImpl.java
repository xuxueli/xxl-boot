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

    @Resource
    private CodegenMapper codegenMapper;

    @Resource
    private CodegenFieldMapper codegenFieldMapper;

    @Resource
    private Configuration freemarkerConfig;


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

            // ClassInfo 2 Codegen
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
                    // FieldInfo 2 CodegenField
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
            Map<String, Object> params = buildTemplateContext(codegen, fields);

            // generate java
            Map<String, String> result = new LinkedHashMap<>();
            result.put("java/entity.java.ftl", render("java/entity.java.ftl", params));
            result.put("java/mapper.java.ftl", render("java/mapper.java.ftl", params));
            result.put("java/mapper.xml.ftl", render("java/mapper.xml.ftl", params));
            result.put("java/service.java.ftl", render("java/service.java.ftl", params));
            result.put("java/serviceImpl.java.ftl", render("java/serviceImpl.java.ftl", params));
            result.put("java/controller.java.ftl", render("java/controller.java.ftl", params));

            // generate sql
            result.put("sql/sql.ftl", render("sql/sql.ftl", params));

            // generate vue
            result.put("vue3/api.js.ftl", render("vue3/api.js.ftl", params));
            if (codegen.getTplCategory().equals("tree")) {
                result.put("vue3/index-tree.vue.ftl", render("vue3/index-tree.vue.ftl", params));
            } else {
                result.put("vue3/index.vue.ftl", render("vue3/index.vue.ftl", params));
            }

            return Response.ofSuccess(result);
        } catch (IOException | TemplateException e) {
            logger.error(e.getMessage(), e);
            return Response.ofFail("代码生成失败: "  + e.getMessage());
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

                // param
                Map<String, Object> params = buildTemplateContext(codegen, fields);
                String pkg = codegen.getPackageName() != null ? codegen.getPackageName().replace('.', '/') : "com.xxl.boot.api.business";
                String module = codegen.getModuleName() != null ? codegen.getModuleName() : "demo";
                String cn = codegen.getBusinessName() != null ? codegen.getBusinessName() : "Demo";

                // generate java
                addZipEntry(zos, "main/java/" + pkg + "/entity/" + cn + ".java", render("java/entity.java.ftl", params));
                addZipEntry(zos, "main/java/" + pkg + "/mapper/" + cn + "Mapper.java", render("java/mapper.java.ftl", params));
                addZipEntry(zos, "main/resources/mapper/" + module + "/" + cn + "Mapper.xml", render("java/mapper.xml.ftl", params));
                addZipEntry(zos, "main/java/" + pkg + "/service/" + cn + "Service.java", render("java/service.java.ftl", params));
                addZipEntry(zos, "main/java/" + pkg + "/service/impl/" + cn + "ServiceImpl.java", render("java/serviceImpl.java.ftl", params));
                addZipEntry(zos, "main/java/" + pkg + "/controller/" + cn + "Controller.java", render("java/controller.java.ftl", params));

                // generate sql
                addZipEntry(zos, "main/resources/mapper/" + module + "/" + cn + "-init.sql", render("sql/sql.ftl", params));

                // generate vue
                addZipEntry(zos, "vue/api/" + module + "/" + cn + ".js", render("vue3/api.js.ftl", params));
                if (codegen.getTplCategory().equals("tree")) {
                    addZipEntry(zos, "vue/views/" + module + "/" + cn + "/index.vue", render("vue3/index-tree.vue.ftl", params));
                } else {
                    addZipEntry(zos, "vue/views/" + module + "/" + cn + "/index.vue", render("vue3/index.vue.ftl", params));
                }

            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return null;
        }
        return baos.toByteArray();
    }

    /**
     * template base path
     */
    private static final String TPL_PATH = "/tool/codegen/";

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

    /** 构建模板上下文：直接传递实体对象，模板访问 codegen.xxx / fields */
    private Map<String, Object> buildTemplateContext(Codegen codegen, List<CodegenField> fields) {
        Map<String, Object> ctx = new HashMap<>();
        ctx.put("codegen", codegen);
        ctx.put("fields", fields);
        return ctx;
    }

}
