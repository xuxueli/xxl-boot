package com.xxl.boot.admin.framework.model.adaptor;

import com.xxl.boot.admin.framework.model.dto.LogDTO;
import com.xxl.boot.admin.framework.model.entity.Log;
import com.xxl.boot.admin.framework.util.Ip2regionUtil;
import com.xxl.tool.core.DateTool;

import java.util.ArrayList;
import java.util.List;

/**
 * 日志实体转 DTO 适配器，补充 IP 地理位置信息
 *
 * @author xuxueli 2024-01-01
 */
public class LogAdaptor {

    /**
     * 将日志实体列表转换为 DTO 列表
     *
     * @param pageList 日志实体列表
     * @return DTO 列表（含 ipAddress 地理位置）
     */
    public static List<LogDTO> adaptor(List<Log> pageList) {
        List<LogDTO> dtoList = new ArrayList<LogDTO>();
        for (Log log : pageList) {
            LogDTO dto = new LogDTO();
            dto.setId(log.getId());
            dto.setType(log.getType());
            dto.setModule(log.getModule());
            dto.setTitle(log.getTitle());
            dto.setContent(log.getContent());
            dto.setOperator(log.getOperator());
            dto.setIp(log.getIp());
            dto.setAddTime(DateTool.formatDateTime(log.getAddTime()));

            // 根据 IP 查询地理位置
            Ip2regionUtil.RegionInfo cityInfo = Ip2regionUtil.getRegionInfo(log.getIp());
            if (cityInfo != null) {
                dto.setIpAddress(cityInfo.getSearchIpInfo());
            }

            dtoList.add(dto);
        }
        return dtoList;
    }
}
