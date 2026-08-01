package com.xxl.boot.api.framework.model.adaptor;

import com.xxl.boot.api.framework.model.dto.DictItemDTO;
import com.xxl.boot.api.framework.model.entity.DictItem;
import com.xxl.tool.core.CollectionTool;
import com.xxl.tool.core.DateTool;

import java.util.ArrayList;
import java.util.List;

/**
 * 字典项实体转 DTO 适配器
 *
 * @author xuxueli 2024-11-03
 */
public class DictItemAdaptor {

    /**
     * 字典项实体列表转 DTO 列表（时间格式化为字符串）
     */
    public static List<DictItemDTO> adaptor(List<DictItem> entityList) {

        // 空列表直接返回空集合
        if (CollectionTool.isEmpty(entityList)) {
            return new ArrayList<>();
        }

        // 逐条拷贝字段
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
