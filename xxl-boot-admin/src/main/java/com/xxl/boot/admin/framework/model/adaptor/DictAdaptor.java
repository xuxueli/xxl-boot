package com.xxl.boot.admin.framework.model.adaptor;

import com.xxl.boot.admin.framework.model.dto.DictDTO;
import com.xxl.boot.admin.framework.model.entity.Dict;
import com.xxl.tool.core.CollectionTool;
import com.xxl.tool.core.DateTool;

import java.util.ArrayList;
import java.util.List;

public class DictAdaptor {

    public static List<DictDTO> adaptor(List<Dict> entityList) {

        if (CollectionTool.isEmpty(entityList)) {
            return new ArrayList<>();
        }

        List<DictDTO> dtoList = new ArrayList<>();
        for (Dict entity : entityList) {
            DictDTO dto = new DictDTO();
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
