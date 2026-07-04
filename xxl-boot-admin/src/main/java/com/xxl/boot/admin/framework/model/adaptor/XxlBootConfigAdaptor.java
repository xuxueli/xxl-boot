package com.xxl.boot.admin.framework.model.adaptor;

import com.xxl.boot.admin.framework.model.dto.XxlBootConfigDTO;
import com.xxl.boot.admin.framework.model.entity.XxlBootConfig;
import com.xxl.tool.core.CollectionTool;
import com.xxl.tool.core.DateTool;

import java.util.ArrayList;
import java.util.List;

public class XxlBootConfigAdaptor {

    public static List<XxlBootConfigDTO> adaptor(List<XxlBootConfig> entityList) {

        if (CollectionTool.isEmpty(entityList)) {
            return new ArrayList<>();
        }

        List<XxlBootConfigDTO> dtoList = new ArrayList<>();
        for (XxlBootConfig entity : entityList) {
            XxlBootConfigDTO dto = new XxlBootConfigDTO();
            dto.setId(entity.getId());
            dto.setName(entity.getName());
            dto.setKey(entity.getKey());
            dto.setValue(entity.getValue());
            dto.setStatus(entity.getStatus());
            dto.setRemark(entity.getRemark());
            dto.setAddTime(DateTool.formatDateTime(entity.getAddTime()));
            dto.setUpdateTime(DateTool.formatDateTime(entity.getUpdateTime()));

            dtoList.add(dto);
        }

        return dtoList;
    }

}
