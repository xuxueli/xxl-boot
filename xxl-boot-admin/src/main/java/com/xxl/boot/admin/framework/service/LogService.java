package com.xxl.boot.admin.framework.service;

import java.util.List;

import com.xxl.boot.admin.framework.model.dto.XxlBootLogDTO;
import com.xxl.boot.admin.framework.model.entity.XxlBootLog;
import com.xxl.tool.response.Response;
import com.xxl.tool.response.PageModel;

/**
* XxlBootLog Service
*
* Created by xuxueli on '2024-10-27 12:19:06'.
*/
public interface LogService {

    /**
    * 新增
    */
    public Response<String> insert(XxlBootLog xxlBootLog);

    /**
    * 删除
    */
    public Response<String> delete(List<Integer> ids);

    /**
    * 更新
    */
    public Response<String> update(XxlBootLog xxlBootLog);

    /**
    * Load查询
    */
    public Response<XxlBootLog> load(int id);

    /**
    * 分页查询
    */
    public PageModel<XxlBootLogDTO> pageList(int type, String module, String title, int offset, int pagesize);

}
