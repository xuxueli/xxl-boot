package com.xxl.boot.api.framework.service;

import com.xxl.boot.api.framework.model.dto.CodegenDTO;
import com.xxl.boot.api.framework.model.dto.CodegenFieldDTO;
import com.xxl.boot.api.framework.model.entity.Codegen;
import com.xxl.boot.api.framework.model.entity.CodegenField;
import com.xxl.boot.api.framework.model.entity.DbTable;
import com.xxl.tool.response.PageModel;
import com.xxl.tool.response.Response;

import java.util.List;
import java.util.Map;

/**
 * 代码生成 Service 接口
 */
public interface CodegenService {

    Response<String> insert(Codegen xxlBootCodegen);
    Response<String> delete(List<Integer> ids);
    Response<String> update(Codegen xxlBootCodegen);
    Response<Codegen> load(int id);
    PageModel<CodegenDTO> pageList(String tableName, String tableComment, int offset, int pagesize);

    Response<String> insertField(CodegenField xxlBootCodegenField);
    Response<String> deleteField(List<Integer> ids);
    Response<String> updateField(CodegenField xxlBootCodegenField);
    Response<CodegenField> loadField(int id);
    PageModel<CodegenFieldDTO> fieldPageList(long codegenId, int offset, int pagesize);
    List<CodegenField> findFieldsByCodegenId(long codegenId);

    PageModel<DbTable> dbPageList(String tableName, int offset, int pagesize);
    Response<String> importTable(String tableName);
    Response<String> createTable(String tableSql);
    Response<Map<String, String>> preview(int id);
    Response<String> synchDb(String tableName);
    byte[] downloadCode(String[] tableNames);
}
