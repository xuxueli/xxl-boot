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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

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
    public Response<String> insert(Codegen xxlBootCodegen) {
        codegenMapper.insert(xxlBootCodegen);
        return Response.ofSuccess();
    }

    @Override
    public Response<String> delete(List<Integer> ids) {
        codegenFieldMapper.deleteByCodegenIds(ids);
        return codegenMapper.delete(ids) > 0 ? Response.ofSuccess() : Response.ofFail();
    }

    @Override
    public Response<String> update(Codegen xxlBootCodegen) {
        return codegenMapper.update(xxlBootCodegen) > 0 ? Response.ofSuccess() : Response.ofFail();
    }

    @Override
    public Response<Codegen> load(int id) {
        return Response.ofSuccess(codegenMapper.load(id));
    }

    @Override
    public Response<Map<String, Object>> loadDetail(int id) {
        Codegen info = codegenMapper.load(id);
        List<CodegenField> rows = codegenFieldMapper.findByCodegenId(id);
        List<Codegen> tables = codegenMapper.pageList(null, null, 0, Integer.MAX_VALUE);
        Map<String, Object> map = new HashMap<>();
        map.put("info", info);
        map.put("rows", rows);
        map.put("tables", tables);
        return Response.ofSuccess(map);
    }

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
    public Response<String> insertField(CodegenField f) {
        codegenFieldMapper.insert(f);
        return Response.ofSuccess();
    }

    @Override
    public Response<String> deleteField(List<Integer> ids) {
        return codegenFieldMapper.delete(ids) > 0 ? Response.ofSuccess() : Response.ofFail();
    }

    @Override
    public Response<String> updateField(CodegenField f) {
        return codegenFieldMapper.update(f) > 0 ? Response.ofSuccess() : Response.ofFail();
    }

    @Override
    public Response<CodegenField> loadField(int id) {
        return Response.ofSuccess(codegenFieldMapper.load(id));
    }

    @Override
    public PageModel<CodegenFieldDTO> fieldPageList(long codegenId, int offset, int pagesize) {
        List<CodegenField> list = codegenFieldMapper.pageList(codegenId, offset, pagesize);
        int total = codegenFieldMapper.pageListCount(codegenId, offset, pagesize);
        PageModel<CodegenFieldDTO> pm = new PageModel<>();
        pm.setData(CodegenFieldAdaptor.adaptor(list));
        pm.setTotal(total);
        return pm;
    }

    @Override
    public List<CodegenField> findFieldsByCodegenId(long codegenId) {
        return codegenFieldMapper.findByCodegenId(codegenId);
    }

    @Override
    public Response<String> createTable(String tableSql) {
        try {
            ClassInfo ci = TableParseUtil.processTableIntoClassInfo(tableSql);
            Codegen c = new Codegen();
            c.setTableName(ci.getTableName());
            c.setTableComment(ci.getClassComment());
            c.setClassName(ci.getClassName());
            c.setTplCategory("crud");
            codegenMapper.insert(c);
            // 保存字段
            if (ci.getFieldList() != null) {
                for (int i = 0; i < ci.getFieldList().size(); i++) {
                    FieldInfo fi = ci.getFieldList().get(i);
                    CodegenField f = new CodegenField();
                    f.setCodegenId(c.getId());
                    f.setColumnName(fi.getColumnName());
                    f.setColumnComment(fi.getFieldComment());
                    f.setColumnType(fi.getFieldClass());
                    f.setJavaField(fi.getFieldName());
                    f.setJavaType(fi.getFieldClass());
                    f.setIsInsert(fi.getColumnName().equals("add_time") ? "0" : "1");
                    f.setIsEdit(fi.getColumnName().equals("update_time") ? "0" : "1");
                    f.setIsList("1");
                    f.setIsQuery("0");
                    f.setQueryType("EQ");
                    f.setSort(i + 1);
                    if ("id".equals(fi.getColumnName())) {
                        f.setIsPk("1");
                        f.setIsIncrement("1");
                    }
                    codegenFieldMapper.insert(f);
                }
            }
            return Response.ofSuccess();
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return Response.ofFail("建表失败");
        }
    }

    @Override
    public Response<Map<String, String>> preview(int id) {
        Codegen codegen = codegenMapper.load(id);
        if (codegen == null) return Response.ofFail("表不存在");
        List<CodegenField> fields = codegenFieldMapper.findByCodegenId(id);
        try {
            ClassInfo ci = toClassInfo(codegen, fields);
            Map<String, Object> params = new HashMap<>();
            params.put("classInfo", ci);

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
    public byte[] downloadCode(String[] tableNames) {
        try {
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ZipOutputStream zos = new ZipOutputStream(baos);

            for (String tableName : tableNames) {
                List<Codegen> list = codegenMapper.pageList(tableName.trim(), null, 0, 1);
                if (list == null || list.isEmpty()) continue;
                Codegen codegen = list.get(0);
                List<CodegenField> fields = codegenFieldMapper.findByCodegenId(codegen.getId());

                ClassInfo ci = toClassInfo(codegen, fields);
                Map<String, Object> params = new HashMap<>();
                params.put("classInfo", ci);

                String pkgPath = codegen.getPackageName() != null
                        ? codegen.getPackageName().replace('.', '/')
                        : "com/xxl/boot/demo";
                String cn = ci.getClassName();
                String module = codegen.getModuleName() != null ? codegen.getModuleName() : "demo";

                addZipEntry(zos, "main/java/" + pkgPath + "/domain/" + cn + ".java", render("entity.ftl", params));
                addZipEntry(zos, "main/java/" + pkgPath + "/mapper/" + cn + "Mapper.java", render("mapper.ftl", params));
                addZipEntry(zos, "main/resources/mapper/" + module + "/" + cn + "Mapper.xml", render("mapper_xml.ftl", params));
                addZipEntry(zos, "main/java/" + pkgPath + "/service/I" + cn + "Service.java", render("service.ftl", params));
                addZipEntry(zos, "main/java/" + pkgPath + "/service/impl/" + cn + "ServiceImpl.java", render("service_impl.ftl", params));
                addZipEntry(zos, "main/java/" + pkgPath + "/controller/" + cn + "Controller.java", render("controller.ftl", params));
                addZipEntry(zos, "vue/views/" + module + "/" + codegen.getBusinessName() + "/index.vue", render("page.ftl", params));
            }

            zos.close();
            return baos.toByteArray();
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
            return null;
        }
    }

    private String render(String ftl, Map<String, Object> params) throws IOException, TemplateException {
        return FtlTool.processString(freemarkerConfig, TPL_PATH + ftl, params);
    }

    private void addZipEntry(ZipOutputStream zos, String name, String content) throws IOException {
        if (content == null) return;
        zos.putNextEntry(new ZipEntry(name));
        zos.write(content.getBytes("UTF-8"));
        zos.closeEntry();
    }

    private ClassInfo toClassInfo(Codegen codegen, List<CodegenField> fields) {
        ClassInfo ci = new ClassInfo();
        ci.setTableName(codegen.getTableName());
        ci.setClassComment(codegen.getTableComment());
        ci.setClassName(codegen.getClassName() != null ? codegen.getClassName() : "Demo");
        ci.setPackageName(codegen.getPackageName() != null ? codegen.getPackageName() : "com.xxl.boot.demo");
        ci.setAuthor(codegen.getFunctionAuthor() != null ? codegen.getFunctionAuthor() : "xxl-boot");
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
}
