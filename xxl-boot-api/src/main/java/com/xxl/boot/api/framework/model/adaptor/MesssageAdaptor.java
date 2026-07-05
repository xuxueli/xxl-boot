package com.xxl.boot.api.framework.model.adaptor;

import com.xxl.boot.api.framework.model.dto.MessageDTO;
import com.xxl.boot.api.framework.model.entity.Message;
import com.xxl.tool.core.CollectionTool;
import com.xxl.tool.core.DateTool;

import java.util.ArrayList;
import java.util.List;

public class MesssageAdaptor {


    public static List<MessageDTO> adaptor(List<Message> entityList) {

        if (CollectionTool.isEmpty(entityList)) {
            return new ArrayList<>();
        }

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
