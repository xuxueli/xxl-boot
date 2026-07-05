package com.xxl.boot.admin.framework.service;

import com.xxl.boot.admin.framework.model.dto.DictDTO;
import com.xxl.boot.admin.framework.model.dto.DictItemDTO;
import com.xxl.boot.admin.framework.model.entity.Dict;
import com.xxl.boot.admin.framework.model.entity.DictItem;
import com.xxl.tool.response.PageModel;
import com.xxl.tool.response.Response;

import java.util.List;

public interface DictService {

    public Response<String> insert(Dict xxlBootDict);

    public Response<String> delete(List<Integer> ids);

    public Response<String> update(Dict xxlBootDict);

    public Response<Dict> load(int id);

    public PageModel<DictDTO> pageList(String name, String code, int status, int offset, int pagesize);

    public Response<String> insertItem(DictItem xxlBootDictItem);

    public Response<String> deleteItem(List<Integer> ids);

    public Response<String> updateItem(DictItem xxlBootDictItem);

    public Response<DictItem> loadItem(int id);

    public PageModel<DictItemDTO> itemPageList(long dictId, int offset, int pagesize);

}
