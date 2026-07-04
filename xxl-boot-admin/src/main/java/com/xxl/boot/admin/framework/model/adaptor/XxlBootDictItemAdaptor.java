package com.xxl.boot.admin.framework.model.adaptor;

import com.xxl.boot.admin.framework.model.dto.XxlBootDictItemDTO;
import com.xxl.boot.admin.framework.model.entity.XxlBootDictItem;
import com.xxl.tool.core.CollectionTool;
import com.xxl.tool.core.DateTool;

import java.util.ArrayList;
import java.util.List;

public class XxlBootDictItemAdaptor {

    public static List<XxlBootDictItemDTO> adaptor(List<XxlBootDictItem> entityList) {

        if (CollectionTool.isEmpty(entityList)) {
            return new ArrayList<>();
        }

        List<XxlBootDictItemDTO> dtoList = new ArrayList<>();
        for (XxlBootDictItem entity : entityList) {
            XxlBootDictItemDTO dto = new XxlBootDictItemDTO();
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
