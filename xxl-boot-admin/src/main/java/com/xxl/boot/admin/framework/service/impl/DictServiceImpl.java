package com.xxl.boot.admin.framework.service.impl;

import com.xxl.boot.admin.framework.mapper.DictItemMapper;
import com.xxl.boot.admin.framework.mapper.DictMapper;
import com.xxl.boot.admin.framework.model.adaptor.XxlBootDictAdaptor;
import com.xxl.boot.admin.framework.model.adaptor.XxlBootDictItemAdaptor;
import com.xxl.boot.admin.framework.model.dto.XxlBootDictDTO;
import com.xxl.boot.admin.framework.model.dto.XxlBootDictItemDTO;
import com.xxl.boot.admin.framework.model.entity.XxlBootDict;
import com.xxl.boot.admin.framework.model.entity.XxlBootDictItem;
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
    public Response<String> insert(XxlBootDict xxlBootDict) {
        if (xxlBootDict == null) {
            return Response.ofFail("必要参数缺失");
        }
        if (StringTool.isBlank(xxlBootDict.getName())) {
            return Response.ofFail("请输入字典名称");
        }
        if (StringTool.isBlank(xxlBootDict.getCode())) {
            return Response.ofFail("请输入字典标识");
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
    public Response<String> update(XxlBootDict xxlBootDict) {
        int ret = dictMapper.update(xxlBootDict);
        return ret > 0 ? Response.ofSuccess() : Response.ofFail();
    }

    @Override
    public Response<XxlBootDict> load(int id) {
        XxlBootDict record = dictMapper.load(id);
        return Response.ofSuccess(record);
    }

    @Override
    public PageModel<XxlBootDictDTO> pageList(String name, String code, int status, int offset, int pagesize) {
        List<XxlBootDict> pageList = dictMapper.pageList(name, code, status, offset, pagesize);
        int totalCount = dictMapper.pageListCount(name, code, status, offset, pagesize);

        List<XxlBootDictDTO> dtoList = XxlBootDictAdaptor.adaptor(pageList);

        PageModel<XxlBootDictDTO> pageModel = new PageModel<XxlBootDictDTO>();
        pageModel.setData(dtoList);
        pageModel.setTotal(totalCount);

        return pageModel;
    }

    @Override
    public Response<String> insertItem(XxlBootDictItem xxlBootDictItem) {
        if (xxlBootDictItem == null) {
            return Response.ofFail("必要参数缺失");
        }
        if (StringTool.isBlank(xxlBootDictItem.getItemName())) {
            return Response.ofFail("请输入字典项名称");
        }
        if (StringTool.isBlank(xxlBootDictItem.getItemCode())) {
            return Response.ofFail("请输入字典项标识");
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
    public Response<String> updateItem(XxlBootDictItem xxlBootDictItem) {
        int ret = dictItemMapper.update(xxlBootDictItem);
        return ret > 0 ? Response.ofSuccess() : Response.ofFail();
    }

    @Override
    public Response<XxlBootDictItem> loadItem(int id) {
        XxlBootDictItem record = dictItemMapper.load(id);
        return Response.ofSuccess(record);
    }

    @Override
    public PageModel<XxlBootDictItemDTO> itemPageList(long dictId, int offset, int pagesize) {
        List<XxlBootDictItem> pageList = dictItemMapper.pageList(dictId, offset, pagesize);
        int totalCount = dictItemMapper.pageListCount(dictId, offset, pagesize);

        List<XxlBootDictItemDTO> dtoList = XxlBootDictItemAdaptor.adaptor(pageList);

        PageModel<XxlBootDictItemDTO> pageModel = new PageModel<XxlBootDictItemDTO>();
        pageModel.setData(dtoList);
        pageModel.setTotal(totalCount);

        return pageModel;
    }

}
