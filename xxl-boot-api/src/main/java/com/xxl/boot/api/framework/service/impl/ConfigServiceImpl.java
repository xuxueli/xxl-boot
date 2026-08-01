package com.xxl.boot.api.framework.service.impl;

import com.xxl.boot.api.framework.mapper.system.ConfigMapper;
import com.xxl.boot.api.framework.model.adaptor.ConfigAdaptor;
import com.xxl.boot.api.framework.model.dto.ConfigDTO;
import com.xxl.boot.api.framework.model.entity.Config;
import com.xxl.boot.api.framework.service.ConfigService;
import com.xxl.tool.core.RegexTool;
import com.xxl.tool.core.StringTool;
import com.xxl.tool.response.PageModel;
import com.xxl.tool.response.Response;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 配置管理 Service Impl
 *
 * @author xuxueli 2024-11-03
 */
@Service
public class ConfigServiceImpl implements ConfigService {

    @Resource
    private ConfigMapper configMapper;

    /**
     * 新增配置
     */
    @Override
    public Response<String> insert(Config xxlBootConfig) {

        // 参数校验：实体及必填字段不能为空
        if (xxlBootConfig == null
                || StringTool.isBlank(xxlBootConfig.getName())
                || StringTool.isBlank(xxlBootConfig.getKey())) {
            return Response.ofFail("必要参数缺失");
        }
        // 配置Key格式校验：小写字母开头，由小写字母、数字和点组成
        if (!RegexTool.matches("^[a-z][a-z0-9.]*$", xxlBootConfig.getKey())) {
            return Response.ofFail("配置Key格式不正确");
        }

        configMapper.insert(xxlBootConfig);
        return Response.ofSuccess();
    }

    /**
     * 批量删除配置
     */
    @Override
    public Response<String> delete(List<Integer> ids) {
        int ret = configMapper.delete(ids);
        return ret>0? Response.ofSuccess() : Response.ofFail();
    }

    /**
     * 更新配置
     */
    @Override
    public Response<String> update(Config xxlBootConfig) {
        int ret = configMapper.update(xxlBootConfig);
        return ret>0? Response.ofSuccess() : Response.ofFail();
    }

    /**
     * Load查询（按ID查询单条配置）
     */
    @Override
    public Response<Config> load(int id) {
        Config record = configMapper.load(id);
        return Response.ofSuccess(record);
    }

    /**
     * 按配置Key查询
     */
    @Override
    public Response<Config> loadByKey(String key) {
        Config record = configMapper.loadByKey(key);
        return Response.ofSuccess(record);
    }

    /**
     * 分页查询配置列表
     */
    @Override
    public PageModel<ConfigDTO> pageList(int status, String name, String key, int offset, int pagesize) {

        List<Config> pageList = configMapper.pageList(status, name, key, offset, pagesize);
        int totalCount = configMapper.pageListCount(status, name, key, offset, pagesize);

        // entity 转 DTO
        List<ConfigDTO> dtoList = ConfigAdaptor.adaptor(pageList);

        // 组装分页结果
        PageModel<ConfigDTO> pageModel = new PageModel<>();
        pageModel.setData(dtoList);
        pageModel.setTotal(totalCount);

        return pageModel;
    }

}
