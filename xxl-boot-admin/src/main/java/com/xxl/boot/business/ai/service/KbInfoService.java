package com.xxl.boot.business.ai.service;

import java.util.List;

import com.xxl.boot.business.ai.model.KbInfo;
import com.xxl.tool.response.Response;
import com.xxl.tool.response.PageModel;

/**
* KbInfo Service
*
* Created by xuxueli on '2026-03-08 09:39:11'.
*/
public interface KbInfoService {

    /**
    * 新增
    */
    public Response<String> insert(KbInfo kbInfo);

    /**
    * 删除
    */
    public Response<String> delete(List<Integer> ids);

    /**
    * 更新
    */
    public Response<String> update(KbInfo kbInfo);

    /**
    * Load查询
    */
    public Response<KbInfo> load(long id);

    /**
    * 分页查询
    */
    public PageModel<KbInfo> pageList(String kbName, int offset, int pagesize);

}
