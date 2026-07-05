package com.xxl.boot.api.framework.model.adaptor;

import com.xxl.boot.api.framework.model.dto.LogDTO;
import com.xxl.boot.api.framework.model.entity.Log;
import com.xxl.boot.api.framework.util.Ip2regionUtil;
import com.xxl.tool.core.DateTool;

import java.util.ArrayList;
import java.util.List;

public class LogAdaptor {


    public static List<LogDTO> adaptor(List<Log> pageList) {
        List<LogDTO> dtoList = new ArrayList<LogDTO>();
        for (Log xxlBootLog : pageList) {
            // adaptor
            LogDTO dto = new LogDTO();
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
