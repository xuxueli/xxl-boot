package com.xxl.boot.api.framework.model.adaptor;

import com.xxl.boot.api.framework.model.dto.CodegenDTO;
import com.xxl.boot.api.framework.model.entity.Codegen;
import com.xxl.tool.core.CollectionTool;
import com.xxl.tool.core.DateTool;

import java.util.ArrayList;
import java.util.List;

/**
 * 代码生成业务表 - Entity 转 DTO
 */
public class CodegenAdaptor {

    public static List<CodegenDTO> adaptor(List<Codegen> entityList) {
        if (CollectionTool.isEmpty(entityList)) return new ArrayList<>();
        List<CodegenDTO> dtoList = new ArrayList<>();
        for (Codegen entity : entityList) {
            CodegenDTO dto = new CodegenDTO();
            dto.setId(entity.getId()); dto.setTableName(entity.getTableName());
            dto.setTableComment(entity.getTableComment()); dto.setSubTableName(entity.getSubTableName());
            dto.setSubTableFkName(entity.getSubTableFkName()); dto.setClassName(entity.getClassName());
            dto.setTplCategory(entity.getTplCategory()); dto.setTplWebType(entity.getTplWebType());
            dto.setPackageName(entity.getPackageName()); dto.setModuleName(entity.getModuleName());
            dto.setBusinessName(entity.getBusinessName()); dto.setFunctionName(entity.getFunctionName());
            dto.setFunctionAuthor(entity.getFunctionAuthor()); dto.setFormColNum(entity.getFormColNum());
            dto.setGenType(entity.getGenType()); dto.setGenPath(entity.getGenPath());
            dto.setOptions(entity.getOptions()); dto.setRemark(entity.getRemark());
            dto.setAddTime(DateTool.formatDateTime(entity.getAddTime()));
            dto.setUpdateTime(DateTool.formatDateTime(entity.getUpdateTime()));
            dtoList.add(dto);
        }
        return dtoList;
    }
}
