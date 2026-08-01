package com.xxl.boot.api.framework.model.adaptor;

import com.xxl.boot.api.framework.model.dto.MessageDTO;
import com.xxl.boot.api.framework.model.entity.Message;
import com.xxl.tool.core.CollectionTool;
import com.xxl.tool.core.DateTool;

import java.util.ArrayList;
import java.util.List;

/**
 * 消息实体转 DTO 适配器
 *
 * @author xuxueli 2024-11-03
 */
public class MesssageAdaptor {

    /**
     * 消息实体列表转 DTO 列表（时间格式化为字符串）
     */
    public static List<MessageDTO> adaptor(List<Message> entityList) {

        // 空列表直接返回空集合
        if (CollectionTool.isEmpty(entityList)) {
            return new ArrayList<>();
        }

        // 逐条拷贝字段
        List<MessageDTO> dtoList = new ArrayList<>();
        for (Message entity : entityList) {
            MessageDTO dto = new MessageDTO();
            dto.setId(entity.getId());
            dto.setCategory(entity.getCategory());
            dto.setTitle(entity.getTitle());
            dto.setContent(entity.getContent());
            dto.setSender(entity.getSender());
            dto.setStatus(entity.getStatus());
            dto.setAddTime(DateTool.formatDateTime(entity.getAddTime()));
            dto.setUpdateTime(DateTool.formatDateTime(entity.getUpdateTime()));

            dtoList.add(dto);
        }

        return dtoList;
    }

}
