package com.xxl.boot.api.framework.service.impl;

import com.xxl.boot.api.framework.mapper.system.DictItemMapper;
import com.xxl.boot.api.framework.mapper.system.DictMapper;
import com.xxl.boot.api.framework.model.adaptor.DictAdaptor;
import com.xxl.boot.api.framework.model.adaptor.DictItemAdaptor;
import com.xxl.boot.api.framework.model.dto.DictDTO;
import com.xxl.boot.api.framework.model.dto.DictItemDTO;
import com.xxl.boot.api.framework.model.entity.Dict;
import com.xxl.boot.api.framework.model.entity.DictItem;
import com.xxl.boot.api.framework.service.DictService;
import com.xxl.tool.core.RegexTool;
import com.xxl.tool.core.StringTool;
import com.xxl.tool.response.PageModel;
import com.xxl.tool.response.Response;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

/**
 * 字典管理 Service Impl
 *
 * @author xuxueli 2024-11-03
 */
@Service
public class DictServiceImpl implements DictService {

    @Resource
    private DictMapper dictMapper;

    @Resource
    private DictItemMapper dictItemMapper;

    /**
     * 新增字典
     */
    @Override
    public Response<String> insert(Dict xxlBootDict) {
        // 参数校验：实体及必填字段不能为空
        if (xxlBootDict == null) {
            return Response.ofFail("必要参数缺失");
        }
        if (StringTool.isBlank(xxlBootDict.getName())) {
            return Response.ofFail("请输入字典名称");
        }
        if (StringTool.isBlank(xxlBootDict.getCode())) {
            return Response.ofFail("请输入字典标识");
        }
        // 字典标识格式校验：小写字母开头，由字母和数字组成，长度2-100
        String code = xxlBootDict.getCode();
        if (code.length() < 2 || code.length() > 100 || !RegexTool.matches("^[a-z][a-zA-Z0-9]*$", code)) {
            return Response.ofFail("字典标识需以小写字母开头，由字母和数字组成，长度2-100");
        }
        // 字典标识唯一性校验：数据库唯一索引，代码层友好提示
        Dict existDict = dictMapper.loadByCode(xxlBootDict.getCode());
        if (existDict != null) {
            return Response.ofFail("字典标识已存在");
        }
        dictMapper.insert(xxlBootDict);
        return Response.ofSuccess();
    }

    /**
     * 批量删除字典（先删字典项，再删字典）
     */
    @Override
    public Response<String> delete(List<Integer> ids) {
        // 先删除字典下的字典项，再删除字典本身
        dictItemMapper.deleteByDictIds(ids);
        int ret = dictMapper.delete(ids);
        return ret > 0 ? Response.ofSuccess() : Response.ofFail();
    }

    /**
     * 更新字典
     */
    @Override
    public Response<String> update(Dict xxlBootDict) {
        int ret = dictMapper.update(xxlBootDict);
        return ret > 0 ? Response.ofSuccess() : Response.ofFail();
    }

    /**
     * Load查询（按ID查询单条字典）
     */
    @Override
    public Response<Dict> load(int id) {
        Dict record = dictMapper.load(id);
        return Response.ofSuccess(record);
    }

    /**
     * 分页查询字典列表
     */
    @Override
    public PageModel<DictDTO> pageList(String name, String code, int status, int offset, int pagesize) {
        List<Dict> pageList = dictMapper.pageList(name, code, status, offset, pagesize);
        int totalCount = dictMapper.pageListCount(name, code, status, offset, pagesize);

        // entity 转 DTO
        List<DictDTO> dtoList = DictAdaptor.adaptor(pageList);

        // 组装分页结果
        PageModel<DictDTO> pageModel = new PageModel<DictDTO>();
        pageModel.setData(dtoList);
        pageModel.setTotal(totalCount);

        return pageModel;
    }

    /**
     * 新增字典项
     */
    @Override
    public Response<String> insertItem(DictItem xxlBootDictItem) {
        // 参数校验：实体及必填字段不能为空
        if (xxlBootDictItem == null) {
            return Response.ofFail("必要参数缺失");
        }
        if (StringTool.isBlank(xxlBootDictItem.getItemName())) {
            return Response.ofFail("请输入字典项名称");
        }
        if (StringTool.isBlank(xxlBootDictItem.getItemCode())) {
            return Response.ofFail("请输入字典项标识");
        }
        // 字典项标识唯一性校验：同字典下不可重复（数据库联合唯一索引）
        DictItem existItem = dictItemMapper.findByDictIdAndCode(xxlBootDictItem.getDictId(), xxlBootDictItem.getItemCode());
        if (existItem != null) {
            return Response.ofFail("字典项标识已存在");
        }
        dictItemMapper.insert(xxlBootDictItem);
        return Response.ofSuccess();
    }

    /**
     * 批量删除字典项
     */
    @Override
    public Response<String> deleteItem(List<Integer> ids) {
        int ret = dictItemMapper.delete(ids);
        return ret > 0 ? Response.ofSuccess() : Response.ofFail();
    }

    /**
     * 更新字典项
     */
    @Override
    public Response<String> updateItem(DictItem xxlBootDictItem) {
        int ret = dictItemMapper.update(xxlBootDictItem);
        return ret > 0 ? Response.ofSuccess() : Response.ofFail();
    }

    /**
     * Load查询（按ID查询单条字典项）
     */
    @Override
    public Response<DictItem> loadItem(int id) {
        DictItem record = dictItemMapper.load(id);
        return Response.ofSuccess(record);
    }

    /**
     * 分页查询字典项列表
     */
    @Override
    public PageModel<DictItemDTO> itemPageList(long dictId, int offset, int pagesize) {
        List<DictItem> pageList = dictItemMapper.pageList(dictId, offset, pagesize);
        int totalCount = dictItemMapper.pageListCount(dictId, offset, pagesize);

        // entity 转 DTO
        List<DictItemDTO> dtoList = DictItemAdaptor.adaptor(pageList);

        // 组装分页结果
        PageModel<DictItemDTO> pageModel = new PageModel<DictItemDTO>();
        pageModel.setData(dtoList);
        pageModel.setTotal(totalCount);

        return pageModel;
    }

    /**
     * 按字典标识查询字典项列表
     */
    @Override
    public Response<List<DictItem>> getDictItemsByCode(String code) {
        // 按字典标识查询字典，不存在则返回空列表
        Dict dict = dictMapper.loadByCode(code);
        if (dict == null) {
            return Response.ofSuccess(new ArrayList<>());
        }
        // 查询字典下的字典项列表
        List<DictItem> itemList = dictItemMapper.findByDictId(dict.getId());
        return Response.ofSuccess(itemList);
    }

    /**
     * 查询全部字典（供下拉选项使用）
     */
    @Override
    public Response<List<Dict>> queryDictList() {
        // 查询全部字典列表
        return Response.ofSuccess(dictMapper.findAll());
    }

}
