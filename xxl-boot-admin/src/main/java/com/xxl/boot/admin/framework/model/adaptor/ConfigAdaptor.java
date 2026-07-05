package com.xxl.boot.admin.framework.model.adaptor;

import com.xxl.boot.admin.framework.model.dto.ConfigDTO;
import com.xxl.boot.admin.framework.model.entity.Config;
import com.xxl.tool.core.CollectionTool;
import com.xxl.tool.core.DateTool;

import java.util.ArrayList;
import java.util.List;

public class ConfigAdaptor {

    public static List<ConfigDTO> adaptor(List<Config> entityList) {

        if (CollectionTool.isEmpty(entityList)) {
            return new ArrayList<>();
        }

        List<ConfigDTO> dtoList = new ArrayList<>();
        for (Config entity : entityList) {
            ConfigDTO dto = new ConfigDTO();
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
