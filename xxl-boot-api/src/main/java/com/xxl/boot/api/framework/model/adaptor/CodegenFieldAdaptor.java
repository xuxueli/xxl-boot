package com.xxl.boot.api.framework.model.adaptor;

import com.xxl.boot.api.framework.model.dto.CodegenFieldDTO;
import com.xxl.boot.api.framework.model.entity.CodegenField;
import com.xxl.tool.core.CollectionTool;
import com.xxl.tool.core.DateTool;

import java.util.ArrayList;
import java.util.List;

/**
 * 代码生成字段 - Entity 转 DTO
 * 
 * @author xuxueli 2024-01-01
 */
public class CodegenFieldAdaptor {

    /**
     * 将字段实体列表转换为 DTO 列表
     *
     * @param entityList 字段实体列表
     * @return DTO 列表
     */
    public static List<CodegenFieldDTO> adaptor(List<CodegenField> entityList) {
        if (CollectionTool.isEmpty(entityList)) {
            return new ArrayList<>();
        }

        List<CodegenFieldDTO> dtoList = new ArrayList<>();
        for (CodegenField entity : entityList) {
            CodegenFieldDTO dto = new CodegenFieldDTO();
            dto.setId(entity.getId());
            dto.setCodegenId(entity.getCodegenId());
            dto.setColumnName(entity.getColumnName());
            dto.setColumnComment(entity.getColumnComment());
            dto.setJavaType(entity.getJavaType());
            dto.setJavaField(entity.getJavaField());
            dto.setIsInsert(entity.getIsInsert());
            dto.setIsEdit(entity.getIsEdit());
            dto.setIsList(entity.getIsList());
            dto.setIsQuery(entity.getIsQuery());
            dto.setQueryType(entity.getQueryType());
            dto.setIsRequired(entity.getIsRequired());
            dto.setHtmlType(entity.getHtmlType());
            dto.setDictType(entity.getDictType());
            dto.setSort(entity.getSort());
            dto.setAddTime(DateTool.formatDateTime(entity.getAddTime()));
            dto.setUpdateTime(DateTool.formatDateTime(entity.getUpdateTime()));

            dtoList.add(dto);
        }

        return dtoList;
    }

}
