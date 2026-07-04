package com.xxl.boot.api.framework.model.adaptor;

import com.xxl.boot.api.framework.model.dto.XxlBootDictDTO;
import com.xxl.boot.api.framework.model.entity.XxlBootDict;
import com.xxl.tool.core.CollectionTool;
import com.xxl.tool.core.DateTool;

import java.util.ArrayList;
import java.util.List;

public class XxlBootDictAdaptor {

    public static List<XxlBootDictDTO> adaptor(List<XxlBootDict> entityList) {

        if (CollectionTool.isEmpty(entityList)) {
            return new ArrayList<>();
        }

        List<XxlBootDictDTO> dtoList = new ArrayList<>();
        for (XxlBootDict entity : entityList) {
            XxlBootDictDTO dto = new XxlBootDictDTO();
            dto.setId(entity.getId());
            dto.setName(entity.getName());
            dto.setCode(entity.getCode());
            dto.setStatus(entity.getStatus());
            dto.setRemark(entity.getRemark());
            dto.setAddTime(DateTool.formatDateTime(entity.getAddTime()));
            dto.setUpdateTime(DateTool.formatDateTime(entity.getUpdateTime()));

            dtoList.add(dto);
        }

        return dtoList;
    }

}
