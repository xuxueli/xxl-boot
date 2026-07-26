package com.xxl.boot.api.framework.service;

import com.xxl.boot.api.framework.model.dto.CodegenDTO;
import com.xxl.tool.response.PageModel;
import com.xxl.tool.response.Response;

import java.util.List;
import java.util.Map;

/**
 * 代码生成 Service 接口
 */
public interface CodegenService {

    /** 分页列表 */
    PageModel<CodegenDTO> pageList(String tableName, String tableComment, int offset, int pagesize);

    /** 批量删除 */
    Response<String> delete(List<Integer> ids);

    /** 更新（含字段） */
    Response<String> update(CodegenDTO dto);

    /** 查询表详情（含字段列表） */
    Response<CodegenDTO> loadDetail(int id);

    /** 通过 SQL 建表 */
    Response<String> createTable(String tableSql);

    /** 预览生成代码 */
    Response<Map<String, String>> preview(int id);

    /** 生成代码 zip */
    byte[] downloadCode(List<Integer> ids);
}
