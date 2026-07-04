package com.xxl.boot.api.framework.service;

import java.util.List;

import com.xxl.boot.api.framework.model.dto.XxlBootConfigDTO;
import com.xxl.boot.api.framework.model.entity.XxlBootConfig;
import com.xxl.tool.response.Response;
import com.xxl.tool.response.PageModel;

public interface ConfigService {

    public Response<String> insert(XxlBootConfig xxlBootConfig);

    public Response<String> delete(List<Integer> ids);

    public Response<String> update(XxlBootConfig xxlBootConfig);

    public Response<XxlBootConfig> load(int id);

    public PageModel<XxlBootConfigDTO> pageList(int status, String name, String key, int offset, int pagesize);

}
