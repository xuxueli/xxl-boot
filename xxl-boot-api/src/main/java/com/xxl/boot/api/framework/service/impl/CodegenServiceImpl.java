package com.xxl.boot.api.framework.service.impl;

import com.xxl.boot.api.framework.mapper.CodegenFieldMapper;
import com.xxl.boot.api.framework.mapper.CodegenMapper;
import com.xxl.boot.api.framework.mapper.DbTableMapper;
import com.xxl.boot.api.framework.model.adaptor.CodegenAdaptor;
import com.xxl.boot.api.framework.model.adaptor.CodegenFieldAdaptor;
import com.xxl.boot.api.framework.model.dto.CodegenDTO;
import com.xxl.boot.api.framework.model.dto.CodegenFieldDTO;
import com.xxl.boot.api.framework.model.entity.Codegen;
import com.xxl.boot.api.framework.model.entity.CodegenField;
import com.xxl.boot.api.framework.model.entity.DbTable;
import com.xxl.boot.api.framework.model.entity.DbTableColumn;
import com.xxl.boot.api.framework.service.CodegenService;
import com.xxl.boot.api.framework.util.codegen.ClassInfo;
import com.xxl.boot.api.framework.util.codegen.FieldInfo;
import com.xxl.boot.api.framework.util.codegen.TableParseUtil;
import com.xxl.tool.freemarker.FtlTool;
import com.xxl.tool.response.PageModel;
import com.xxl.tool.response.Response;
import freemarker.template.Configuration;
import freemarker.template.TemplateException;
import jakarta.annotation.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 代码生成 Service 实现
 */
@Service
public class CodegenServiceImpl implements CodegenService {

    private static final Logger logger = LoggerFactory.getLogger(CodegenServiceImpl.class);

    @Resource private CodegenMapper codegenMapper;
    @Resource private CodegenFieldMapper codegenFieldMapper;
    @Resource private DbTableMapper dbTableMapper;
    @Resource private Configuration freemarkerConfig;

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
    public PageModel<DbTable> dbPageList(String tableName, int offset, int pagesize) {
        List<DbTable> list = dbTableMapper.listDbTable(tableName, offset, pagesize);
        int total = dbTableMapper.listDbTableCount(tableName);
        PageModel<DbTable> pm = new PageModel<>();
        pm.setData(list);
        pm.setTotal(total);
        return pm;
    }

    @Override
    public Response<String> importTable(String tableName) {
        List<DbTable> tables = dbTableMapper.listDbTable(tableName, 0, 1);
        if (tables == null || tables.isEmpty()) return Response.ofFail("表不存在");
        List<DbTableColumn> columns = dbTableMapper.listDbTableColumn(tableName);
        if (columns == null || columns.isEmpty()) return Response.ofFail("表字段为空");

        Codegen c = new Codegen();
        c.setTableName(tableName); c.setTableComment(tables.get(0).getTableComment());
        c.setClassName(toPascalCase(tableName)); c.setTplCategory("crud");
        codegenMapper.insert(c);

        for (int i = 0; i < columns.size(); i++) {
            codegenFieldMapper.insert(buildField(c.getId(), columns.get(i), i));
        }
        return Response.ofSuccess();
    }

    @Override
    public Response<String> createTable(String tableSql) {
        try {
            ClassInfo ci = TableParseUtil.processTableIntoClassInfo(tableSql);
            Codegen c = new Codegen();
            c.setTableName(ci.getTableName()); c.setTableComment(ci.getClassComment());
            c.setClassName(ci.getClassName()); c.setTplCategory("crud");
            codegenMapper.insert(c);
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
            Map<String, String> result = new HashMap<>();
            result.put("controller_code", FtlTool.processString(freemarkerConfig, "/framework/tool/codegen-module/controller.ftl", params));
            result.put("service_code", FtlTool.processString(freemarkerConfig, "/framework/tool/codegen-module/service.ftl", params));
            result.put("service_impl_code", FtlTool.processString(freemarkerConfig, "/framework/tool/codegen-module/service_impl.ftl", params));
            result.put("mapper_code", FtlTool.processString(freemarkerConfig, "/framework/tool/codegen-module/mapper.ftl", params));
            result.put("mapper_xml_code", FtlTool.processString(freemarkerConfig, "/framework/tool/codegen-module/mapper_xml.ftl", params));
            result.put("entity_code", FtlTool.processString(freemarkerConfig, "/framework/tool/codegen-module/entity.ftl", params));
            result.put("page_code", FtlTool.processString(freemarkerConfig, "/framework/tool/codegen-module/page.ftl", params));
            return Response.ofSuccess(result);
        } catch (IOException | TemplateException e) {
            logger.error(e.getMessage(), e);
            return Response.ofFail("代码生成失败");
        }
    }

    @Override
    public Response<String> synchDb(String tableName) {
        List<Codegen> list = codegenMapper.pageList(tableName, null, 0, 1);
        if (list == null || list.isEmpty()) return Response.ofFail("表不存在");
        List<DbTableColumn> cols = dbTableMapper.listDbTableColumn(tableName);
        if (cols == null || cols.isEmpty()) return Response.ofFail("数据库表字段为空");
        codegenFieldMapper.deleteByCodegenIds(List.of((int) list.get(0).getId()));
        for (int i = 0; i < cols.size(); i++) {
            codegenFieldMapper.insert(buildField(list.get(0).getId(), cols.get(i), i));
        }
        return Response.ofSuccess();
    }

    @Override
    public String genCodeZip(String tableName) { return "generated"; }

    private CodegenField buildField(long codegenId, DbTableColumn col, int sort) {
        CodegenField f = new CodegenField();
        f.setCodegenId(codegenId); f.setColumnName(col.getColumnName());
        f.setColumnComment(col.getColumnComment()); f.setColumnType(col.getColumnType());
        f.setJavaField(toCamelCase(col.getColumnName()));
        f.setJavaType(mapToJavaType(col.getColumnType()));
        if ("PRI".equalsIgnoreCase(col.getColumnKey())) {
            f.setIsPk("1");
            if (col.getExtra() != null && col.getExtra().contains("auto_increment")) f.setIsIncrement("1");
        }
        f.setIsInsert("1"); f.setIsEdit("1"); f.setIsList("1"); f.setIsQuery("0");
        f.setQueryType("EQ"); f.setSort(sort + 1);
        return f;
    }

    private String mapToJavaType(String type) {
        String t = type.toLowerCase();
        if (t.startsWith("varchar") || t.startsWith("char") || t.startsWith("text")) return "String";
        if (t.startsWith("bigint")) return "Long";
        if (t.startsWith("int") || t.startsWith("tinyint") || t.startsWith("smallint")) return "Integer";
        if (t.startsWith("decimal") || t.startsWith("double") || t.startsWith("float")) return "BigDecimal";
        if (t.startsWith("datetime") || t.startsWith("timestamp") || t.startsWith("date")) return "Date";
        if (t.startsWith("blob")) return "byte[]";
        return "String";
    }

    private String toCamelCase(String name) {
        StringBuilder sb = new StringBuilder();
        boolean next = false;
        for (char c : name.toCharArray()) {
            if (c == '_') { next = true; }
            else if (next) { sb.append(Character.toUpperCase(c)); next = false; }
            else { sb.append(Character.toLowerCase(c)); }
        }
        return sb.toString();
    }

    private String toPascalCase(String name) {
        String s = toCamelCase(name);
        return Character.toUpperCase(s.charAt(0)) + s.substring(1);
    }

    private ClassInfo toClassInfo(Codegen codegen, List<CodegenField> fields) {
        ClassInfo ci = new ClassInfo();
        ci.setTableName(codegen.getTableName()); ci.setClassComment(codegen.getTableComment());
        ci.setClassName(codegen.getClassName()); ci.setPackageName(codegen.getPackageName());
        ci.setAuthor(codegen.getFunctionAuthor());
        List<FieldInfo> fl = new ArrayList<>();
        for (CodegenField f : fields) {
            FieldInfo fi = new FieldInfo();
            fi.setColumnName(f.getColumnName()); fi.setFieldName(f.getJavaField());
            fi.setFieldClass(f.getJavaType()); fi.setFieldComment(f.getColumnComment());
            fl.add(fi);
        }
        ci.setFieldList(fl);
        return ci;
    }
}
