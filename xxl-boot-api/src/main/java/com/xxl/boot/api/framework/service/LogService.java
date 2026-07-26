package com.xxl.boot.api.framework.service;

import com.xxl.boot.api.framework.model.dto.LogDTO;
import com.xxl.boot.api.framework.model.entity.Log;
import com.xxl.tool.response.PageModel;
import com.xxl.tool.response.Response;

import java.util.List;

/**
 * 名称：LogService
 * 功能：日志 Service 接口
 */
public interface LogService {

    Response<String> insert(Log xxlBootLog);                            // 新增

    Response<String> delete(List<Integer> ids);                         // 批量删除

    Response<String> update(Log xxlBootLog);                            // 更新

    Response<Log> load(int id);                                         // 根据 ID 查询

    PageModel<LogDTO> pageList(int type, int module,                    // 分页查询
                               String title, int offset, int pagesize);
}
