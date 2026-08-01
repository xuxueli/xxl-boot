package com.xxl.boot.api.framework.service;

import com.xxl.boot.api.framework.model.dto.DictDTO;
import com.xxl.boot.api.framework.model.dto.DictItemDTO;
import com.xxl.boot.api.framework.model.entity.Dict;
import com.xxl.boot.api.framework.model.entity.DictItem;
import com.xxl.tool.response.PageModel;
import com.xxl.tool.response.Response;

import java.util.List;

/**
 * 字典管理 Service
 *
 * @author xuxueli 2024-11-03
 */
public interface DictService {

    /**
     * 新增字典
     *
     * @param xxlBootDict 字典实体
     */
    Response<String> insert(Dict xxlBootDict);

    /**
     * 批量删除字典（连带删除其字典项）
     *
     * @param ids 字典ID列表
     */
    Response<String> delete(List<Integer> ids);

    /**
     * 更新字典
     *
     * @param xxlBootDict 字典实体
     */
    Response<String> update(Dict xxlBootDict);

    /**
     * Load查询（按ID查询单条字典）
     *
     * @param id 字典ID
     */
    Response<Dict> load(int id);

    /**
     * 分页查询字典列表
     *
     * @param name     字典名称（模糊匹配）
     * @param code     字典标识（模糊匹配）
     * @param status   状态（-1 全部、0 正常、1 停用）
     * @param offset   分页偏移量
     * @param pagesize 每页条数
     */
    PageModel<DictDTO> pageList(String name, String code, int status, int offset, int pagesize);

    /**
     * 新增字典项
     *
     * @param xxlBootDictItem 字典项实体
     */
    Response<String> insertItem(DictItem xxlBootDictItem);

    /**
     * 批量删除字典项
     *
     * @param ids 字典项ID列表
     */
    Response<String> deleteItem(List<Integer> ids);

    /**
     * 更新字典项
     *
     * @param xxlBootDictItem 字典项实体
     */
    Response<String> updateItem(DictItem xxlBootDictItem);

    /**
     * Load查询（按ID查询单条字典项）
     *
     * @param id 字典项ID
     */
    Response<DictItem> loadItem(int id);

    /**
     * 分页查询字典项列表
     *
     * @param dictId   字典ID
     * @param offset   分页偏移量
     * @param pagesize 每页条数
     */
    PageModel<DictItemDTO> itemPageList(long dictId, int offset, int pagesize);

    /**
     * 按字典标识查询字典项列表
     *
     * @param code 字典标识
     */
    Response<List<DictItem>> getDictItemsByCode(String code);

    /**
     * 查询全部字典（供下拉选项使用）
     */
    Response<List<Dict>> queryDictList();

}
