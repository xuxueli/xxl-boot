package com.xxl.boot.api.framework.service.impl;

import com.xxl.boot.api.framework.mapper.ConfigMapper;
import com.xxl.boot.api.framework.model.adaptor.ConfigAdaptor;
import com.xxl.boot.api.framework.model.dto.ConfigDTO;
import com.xxl.boot.api.framework.model.entity.Config;
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
    public Response<String> insert(Config xxlBootConfig) {

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
    public Response<String> update(Config xxlBootConfig) {
        int ret = configMapper.update(xxlBootConfig);
        return ret>0? Response.ofSuccess() : Response.ofFail();
    }

    @Override
    public Response<Config> load(int id) {
        Config record = configMapper.load(id);
        return Response.ofSuccess(record);
    }

    @Override
    public PageModel<ConfigDTO> pageList(int status, String name, String key, int offset, int pagesize) {

        List<Config> pageList = configMapper.pageList(status, name, key, offset, pagesize);
        int totalCount = configMapper.pageListCount(status, name, key, offset, pagesize);

        List<ConfigDTO> dtoList = ConfigAdaptor.adaptor(pageList);

        PageModel<ConfigDTO> pageModel = new PageModel<>();
        pageModel.setData(dtoList);
        pageModel.setTotal(totalCount);

        return pageModel;
    }

}
