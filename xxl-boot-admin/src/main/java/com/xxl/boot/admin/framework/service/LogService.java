package com.xxl.boot.admin.framework.service;

import java.util.List;

import com.xxl.boot.admin.framework.model.dto.LogDTO;
import com.xxl.boot.admin.framework.model.entity.Log;
import com.xxl.tool.response.Response;
import com.xxl.tool.response.PageModel;

/**
 * 名称：LogService
 * 功能：日志 Service 接口
 */
public interface LogService {

    Response<String> insert(Log xxlBootLog);                          /* 新增 */

    Response<String> delete(List<Integer> ids);                       /* 批量删除 */

    Response<String> update(Log xxlBootLog);                         /* 更新 */

    Response<Log> load(int id);                                       /* 根据 ID 查询 */

    PageModel<LogDTO> pageList(int type, int module,                  /* 分页查询 */
                               String title, int offset, int pagesize);
}
