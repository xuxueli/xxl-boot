package com.xxl.boot.api.framework.service;

import com.xxl.boot.api.framework.model.dto.ConfigDTO;
import com.xxl.boot.api.framework.model.entity.Config;
import com.xxl.tool.response.PageModel;
import com.xxl.tool.response.Response;

import java.util.List;

/**
 * 配置管理 Service
 *
 * @author xuxueli 2024-11-03
 */
public interface ConfigService {

    /**
     * 新增配置
     *
     * @param xxlBootConfig 配置实体
     */
    Response<String> insert(Config xxlBootConfig);

    /**
     * 批量删除配置
     *
     * @param ids 配置ID列表
     */
    Response<String> delete(List<Integer> ids);

    /**
     * 更新配置
     *
     * @param xxlBootConfig 配置实体
     */
    Response<String> update(Config xxlBootConfig);

    /**
     * Load查询（按ID查询单条配置）
     *
     * @param id 配置ID
     */
    Response<Config> load(int id);

    /**
     * 按配置Key查询
     *
     * @param key 配置Key
     */
    Response<Config> loadByKey(String key);

    /**
     * 分页查询配置列表
     *
     * @param status   状态（-1 全部、0 正常、1 停用）
     * @param name     配置名称（模糊匹配）
     * @param key      配置Key（模糊匹配）
     * @param offset   分页偏移量
     * @param pagesize 每页条数
     */
    PageModel<ConfigDTO> pageList(int status, String name, String key, int offset, int pagesize);

}
