package com.xxl.boot.admin.plugin.ai.service;

import java.util.Map;
import java.util.List;

import com.xxl.boot.admin.plugin.ai.model.KbDocument;
import com.xxl.tool.response.Response;
import com.xxl.tool.response.PageModel;

/**
* KbDocument Service
*
* Created by xuxueli on '2026-03-08 10:57:39'.
*/
public interface KbDocumentService {

    /**
    * 新增
    */
    public Response<String> insert(KbDocument kbDocument);

    /**
    * 删除
    */
    public Response<String> delete(List<Integer> ids);

    /**
    * 更新
    */
    public Response<String> update(KbDocument kbDocument);

    /**
    * Load查询
    */
    public Response<KbDocument> load(int id);

    /**
    * 分页查询
    */
    public PageModel<KbDocument> pageList(String docName, int offset, int pagesize);

}
