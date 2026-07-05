package com.xxl.boot.api.framework.service;

import com.xxl.boot.api.framework.model.dto.ConfigDTO;
import com.xxl.boot.api.framework.model.entity.Config;
import com.xxl.tool.response.PageModel;
import com.xxl.tool.response.Response;

import java.util.List;

public interface ConfigService {

    public Response<String> insert(Config xxlBootConfig);

    public Response<String> delete(List<Integer> ids);

    public Response<String> update(Config xxlBootConfig);

    public Response<Config> load(int id);

    public PageModel<ConfigDTO> pageList(int status, String name, String key, int offset, int pagesize);

}
