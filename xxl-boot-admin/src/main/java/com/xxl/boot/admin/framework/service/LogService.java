package com.xxl.boot.admin.framework.service;

import java.util.List;

import com.xxl.boot.admin.framework.model.dto.LogDTO;
import com.xxl.boot.admin.framework.model.entity.Log;
import com.xxl.tool.response.Response;
import com.xxl.tool.response.PageModel;

/**
 * 日志 Service 接口，定义日志的增删改查方法
 *
 * @author xuxueli 2024-01-01
 */
public interface LogService {

    /**
     * 新增日志
     */
    Response<String> insert(Log xxlBootLog);

    /**
     * 批量删除日志
     */
    Response<String> delete(List<Integer> ids);

    /**
     * 更新日志
     */
    Response<String> update(Log xxlBootLog);

    /**
     * 根据 ID 查询日志
     */
    Response<Log> load(int id);

    /**
     * 分页查询日志列表
     */
    PageModel<LogDTO> pageList(int type, int module, String title, int offset, int pagesize);
}
