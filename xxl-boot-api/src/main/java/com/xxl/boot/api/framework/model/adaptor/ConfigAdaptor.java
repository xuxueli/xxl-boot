package com.xxl.boot.api.framework.model.adaptor;

import com.xxl.boot.api.framework.model.dto.ConfigDTO;
import com.xxl.boot.api.framework.model.entity.Config;
import com.xxl.tool.core.CollectionTool;
import com.xxl.tool.core.DateTool;

import java.util.ArrayList;
import java.util.List;

/**
 * 配置实体转 DTO 适配器
 *
 * @author xuxueli 2024-11-03
 */
public class ConfigAdaptor {

    /**
     * 配置实体列表转 DTO 列表（时间格式化为字符串）
     */
    public static List<ConfigDTO> adaptor(List<Config> entityList) {

        // 空列表直接返回空集合
        if (CollectionTool.isEmpty(entityList)) {
            return new ArrayList<>();
        }

        // 逐条拷贝字段
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
