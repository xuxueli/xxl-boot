package com.xxl.boot.admin.framework.model.adaptor;

import com.xxl.boot.admin.framework.model.dto.DictItemDTO;
import com.xxl.boot.admin.framework.model.entity.DictItem;
import com.xxl.tool.core.CollectionTool;
import com.xxl.tool.core.DateTool;

import java.util.ArrayList;
import java.util.List;

public class DictItemAdaptor {

    public static List<DictItemDTO> adaptor(List<DictItem> entityList) {

        if (CollectionTool.isEmpty(entityList)) {
            return new ArrayList<>();
        }

        List<DictItemDTO> dtoList = new ArrayList<>();
        for (DictItem entity : entityList) {
            DictItemDTO dto = new DictItemDTO();
            dto.setId(entity.getId());
            dto.setDictId(entity.getDictId());
            dto.setItemName(entity.getItemName());
            dto.setItemCode(entity.getItemCode());
            dto.setStatus(entity.getStatus());
            dto.setOrder(entity.getOrder());
            dto.setRemark(entity.getRemark());
            dto.setAddTime(DateTool.formatDateTime(entity.getAddTime()));
            dto.setUpdateTime(DateTool.formatDateTime(entity.getUpdateTime()));

            dtoList.add(dto);
        }

        return dtoList;
    }

}
