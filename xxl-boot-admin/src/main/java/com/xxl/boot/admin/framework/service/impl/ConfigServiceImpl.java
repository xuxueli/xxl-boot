package com.xxl.boot.admin.framework.service.impl;

import com.xxl.boot.admin.framework.mapper.ConfigMapper;
import com.xxl.boot.admin.framework.model.adaptor.ConfigAdaptor;
import com.xxl.boot.admin.framework.model.dto.ConfigDTO;
import com.xxl.boot.admin.framework.model.entity.Config;
import com.xxl.boot.admin.framework.service.ConfigService;
import com.xxl.boot.admin.framework.util.I18nUtil;
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
 * @author xuxueli 2026-11-22
 */
@Service
public class ConfigServiceImpl implements ConfigService {

    @Resource
    private ConfigMapper configMapper;

    @Override
    public Response<String> insert(Config xxlBootConfig) {

        // 参数校验：实体及必填字段不能为空
        if (xxlBootConfig == null
                || StringTool.isBlank(xxlBootConfig.getName())
                || StringTool.isBlank(xxlBootConfig.getKey())
                || StringTool.isBlank(xxlBootConfig.getValue())) {
            return Response.ofFail(I18nUtil.getString("system_param_empty"));
        }
        // 配置Key格式校验：小写字母开头，由小写字母、数字和点组成
        if (!RegexTool.matches("^[a-z][a-z0-9.]*$", xxlBootConfig.getKey())) {
            return Response.ofFail(I18nUtil.getString("config_key_valid"));
        }
        // 配置Key长度校验：4-100
        if (xxlBootConfig.getKey().length() < 4 || xxlBootConfig.getKey().length() > 100) {
            return Response.ofFail(I18nUtil.getString("config_key_length"));
        }
        // 配置Key唯一性校验：数据库唯一索引，代码层友好提示
        if (configMapper.loadByKey(xxlBootConfig.getKey()) != null) {
            return Response.ofFail(I18nUtil.getString("config_key_repeat"));
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
        // 参数校验：主键与必填字段不能为空
        if (xxlBootConfig == null
                || xxlBootConfig.getId() <= 0
                || StringTool.isBlank(xxlBootConfig.getName())
                || StringTool.isBlank(xxlBootConfig.getKey())
                || StringTool.isBlank(xxlBootConfig.getValue())) {
            return Response.ofFail(I18nUtil.getString("system_param_empty"));
        }
        // 配置Key创建后不可修改，避免业务按 Key 读取的配置失效
        Config existConfig = configMapper.load((int) xxlBootConfig.getId());
        if (existConfig == null) {
            return Response.ofFail(I18nUtil.getString("system_param_empty"));
        }
        if (!existConfig.getKey().equals(xxlBootConfig.getKey())) {
            return Response.ofFail(I18nUtil.getString("config_key_update_limit"));
        }

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
