package com.xxl.boot.api.framework.service.impl;

import com.xxl.boot.api.framework.mapper.ConfigMapper;
import com.xxl.boot.api.framework.model.adaptor.XxlBootConfigAdaptor;
import com.xxl.boot.api.framework.model.dto.XxlBootConfigDTO;
import com.xxl.boot.api.framework.model.entity.XxlBootConfig;
import com.xxl.boot.api.framework.service.ConfigService;
import com.xxl.tool.response.PageModel;
import com.xxl.tool.response.Response;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ConfigServiceImpl implements ConfigService {

    @Resource
    private ConfigMapper configMapper;

    @Override
    public Response<String> insert(XxlBootConfig xxlBootConfig) {

        if (xxlBootConfig == null) {
            return Response.ofFail("必要参数缺失");
        }

        configMapper.insert(xxlBootConfig);
        return Response.ofSuccess();
    }

    @Override
    public Response<String> delete(List<Integer> ids) {
        int ret = configMapper.delete(ids);
        return ret>0? Response.ofSuccess() : Response.ofFail();
    }

    @Override
    public Response<String> update(XxlBootConfig xxlBootConfig) {
        int ret = configMapper.update(xxlBootConfig);
        return ret>0? Response.ofSuccess() : Response.ofFail();
    }

    @Override
    public Response<XxlBootConfig> load(int id) {
        XxlBootConfig record = configMapper.load(id);
        return Response.ofSuccess(record);
    }

    @Override
    public PageModel<XxlBootConfigDTO> pageList(int status, String name, String key, int offset, int pagesize) {

        List<XxlBootConfig> pageList = configMapper.pageList(status, name, key, offset, pagesize);
        int totalCount = configMapper.pageListCount(status, name, key, offset, pagesize);

        List<XxlBootConfigDTO> dtoList = XxlBootConfigAdaptor.adaptor(pageList);

        PageModel<XxlBootConfigDTO> pageModel = new PageModel<XxlBootConfigDTO>();
        pageModel.setData(dtoList);
        pageModel.setTotal(totalCount);

        return pageModel;
    }

}
