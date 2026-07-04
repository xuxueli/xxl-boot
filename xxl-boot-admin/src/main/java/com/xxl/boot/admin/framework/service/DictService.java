package com.xxl.boot.admin.framework.service;

import com.xxl.boot.admin.framework.model.dto.XxlBootDictDTO;
import com.xxl.boot.admin.framework.model.dto.XxlBootDictItemDTO;
import com.xxl.boot.admin.framework.model.entity.XxlBootDict;
import com.xxl.boot.admin.framework.model.entity.XxlBootDictItem;
import com.xxl.tool.response.PageModel;
import com.xxl.tool.response.Response;

import java.util.List;

public interface DictService {

    public Response<String> insert(XxlBootDict xxlBootDict);

    public Response<String> delete(List<Integer> ids);

    public Response<String> update(XxlBootDict xxlBootDict);

    public Response<XxlBootDict> load(int id);

    public PageModel<XxlBootDictDTO> pageList(String name, String code, int status, int offset, int pagesize);

    public Response<String> insertItem(XxlBootDictItem xxlBootDictItem);

    public Response<String> deleteItem(List<Integer> ids);

    public Response<String> updateItem(XxlBootDictItem xxlBootDictItem);

    public Response<XxlBootDictItem> loadItem(int id);

    public PageModel<XxlBootDictItemDTO> itemPageList(long dictId, int offset, int pagesize);

}
