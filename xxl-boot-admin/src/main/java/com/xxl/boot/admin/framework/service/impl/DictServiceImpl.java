package com.xxl.boot.admin.framework.service.impl;

import com.xxl.boot.admin.framework.mapper.DictItemMapper;
import com.xxl.boot.admin.framework.mapper.DictMapper;
import com.xxl.boot.admin.framework.model.adaptor.DictAdaptor;
import com.xxl.boot.admin.framework.model.adaptor.DictItemAdaptor;
import com.xxl.boot.admin.framework.model.dto.DictDTO;
import com.xxl.boot.admin.framework.model.dto.DictItemDTO;
import com.xxl.boot.admin.framework.model.entity.Dict;
import com.xxl.boot.admin.framework.model.entity.DictItem;
import com.xxl.boot.admin.framework.service.DictService;
import com.xxl.tool.core.StringTool;
import com.xxl.tool.response.PageModel;
import com.xxl.tool.response.Response;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DictServiceImpl implements DictService {

    @Resource
    private DictMapper dictMapper;

    @Resource
    private DictItemMapper dictItemMapper;

    @Override
    public Response<String> insert(Dict xxlBootDict) {
        if (xxlBootDict == null) {
            return Response.ofFail("必要参数缺失");
        }
        if (StringTool.isBlank(xxlBootDict.getName())) {
            return Response.ofFail("请输入字典名称");
        }
        if (StringTool.isBlank(xxlBootDict.getType())) {
            return Response.ofFail("请输入字典Type");
        }
        dictMapper.insert(xxlBootDict);
        return Response.ofSuccess();
    }

    @Override
    public Response<String> delete(List<Integer> ids) {
        dictItemMapper.deleteByDictIds(ids);
        int ret = dictMapper.delete(ids);
        return ret > 0 ? Response.ofSuccess() : Response.ofFail();
    }

    @Override
    public Response<String> update(Dict xxlBootDict) {
        int ret = dictMapper.update(xxlBootDict);
        return ret > 0 ? Response.ofSuccess() : Response.ofFail();
    }

    @Override
    public Response<Dict> load(int id) {
        Dict record = dictMapper.load(id);
        return Response.ofSuccess(record);
    }

    @Override
    public PageModel<DictDTO> pageList(String name, String type, int status, int offset, int pagesize) {
        List<Dict> pageList = dictMapper.pageList(name, type, status, offset, pagesize);
        int totalCount = dictMapper.pageListCount(name, type, status, offset, pagesize);

        List<DictDTO> dtoList = DictAdaptor.adaptor(pageList);

        PageModel<DictDTO> pageModel = new PageModel<DictDTO>();
        pageModel.setData(dtoList);
        pageModel.setTotal(totalCount);

        return pageModel;
    }

    @Override
    public Response<String> insertItem(DictItem xxlBootDictItem) {
        if (xxlBootDictItem == null) {
            return Response.ofFail("必要参数缺失");
        }
        if (StringTool.isBlank(xxlBootDictItem.getName())) {
            return Response.ofFail("请输入字典项名称");
        }
        if (xxlBootDictItem.getCode() < 1 || xxlBootDictItem.getCode() > 10000000) {
            return Response.ofFail("字典项Code需在1-10000000之间");
        }
        dictItemMapper.insert(xxlBootDictItem);
        return Response.ofSuccess();
    }

    @Override
    public Response<String> deleteItem(List<Integer> ids) {
        int ret = dictItemMapper.delete(ids);
        return ret > 0 ? Response.ofSuccess() : Response.ofFail();
    }

    @Override
    public Response<String> updateItem(DictItem xxlBootDictItem) {
        int ret = dictItemMapper.update(xxlBootDictItem);
        return ret > 0 ? Response.ofSuccess() : Response.ofFail();
    }

    @Override
    public Response<DictItem> loadItem(int id) {
        DictItem record = dictItemMapper.load(id);
        return Response.ofSuccess(record);
    }

    @Override
    public PageModel<DictItemDTO> itemPageList(long dictId, int offset, int pagesize) {
        List<DictItem> pageList = dictItemMapper.pageList(dictId, offset, pagesize);
        int totalCount = dictItemMapper.pageListCount(dictId, offset, pagesize);

        List<DictItemDTO> dtoList = DictItemAdaptor.adaptor(pageList);

        PageModel<DictItemDTO> pageModel = new PageModel<DictItemDTO>();
        pageModel.setData(dtoList);
        pageModel.setTotal(totalCount);

        return pageModel;
    }

}
