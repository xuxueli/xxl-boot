package com.xxl.boot.admin.framework.model.adaptor;

import com.xxl.boot.admin.framework.model.dto.XxlBootLogDTO;
import com.xxl.boot.admin.framework.model.dto.XxlBootMessageDTO;
import com.xxl.boot.admin.framework.model.entity.XxlBootLog;
import com.xxl.boot.admin.framework.model.entity.XxlBootMessage;
import com.xxl.boot.admin.framework.util.Ip2regionUtil;
import com.xxl.tool.core.CollectionTool;
import com.xxl.tool.core.DateTool;
import com.xxl.tool.response.PageModel;

import java.util.ArrayList;
import java.util.List;

public class XxlBootMesssageAdaptor {


    public static List<XxlBootMessageDTO> adaptor(List<XxlBootMessage> entityList) {

        if (CollectionTool.isEmpty(entityList)) {
            return new ArrayList<>();
        }

        List<XxlBootMessageDTO> dtoList = new ArrayList<>();
        for (XxlBootMessage entity : entityList) {
            XxlBootMessageDTO dto = new XxlBootMessageDTO();
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
