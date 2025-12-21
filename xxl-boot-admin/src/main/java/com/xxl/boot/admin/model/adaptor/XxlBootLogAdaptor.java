package com.xxl.boot.admin.model.adaptor;

import com.xxl.boot.admin.model.dto.XxlBootLogDTO;
import com.xxl.boot.admin.model.entity.XxlBootLog;
import com.xxl.boot.admin.util.Ip2regionUtil;
import com.xxl.tool.core.DateTool;

import java.util.ArrayList;
import java.util.List;

public class XxlBootLogAdaptor {


    public static List<XxlBootLogDTO> adaptor(List<XxlBootLog> pageList) {
        List<XxlBootLogDTO> dtoList = new ArrayList<XxlBootLogDTO>();
        for (XxlBootLog xxlBootLog : pageList) {
            // adaptor
            XxlBootLogDTO dto = new XxlBootLogDTO();
            dto.setId(xxlBootLog.getId());
            dto.setType(xxlBootLog.getType());
            dto.setModule(xxlBootLog.getModule());
            dto.setTitle(xxlBootLog.getTitle());
            dto.setContent(xxlBootLog.getContent());
            dto.setOperator(xxlBootLog.getOperator());
            dto.setIp(xxlBootLog.getIp());
            dto.setAddTime(DateTool.formatDateTime(xxlBootLog.getAddTime()));
            // ip
            Ip2regionUtil.RegionInfo cityInfo = Ip2regionUtil.getRegionInfo(xxlBootLog.getIp());
            if (cityInfo != null) {
                //String temp = String.format("%s%s%s", cityInfo.getCountry(), cityInfo.getProvince(), cityInfo.getCity());
                dto.setIpAddress(cityInfo.getSearchIpInfo());
            }

            // collect
            dtoList.add(dto);
        }
        return dtoList;
    }

}
