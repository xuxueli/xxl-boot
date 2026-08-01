package com.xxl.boot.api.framework.controller.system;

import com.xxl.boot.api.framework.model.dto.ConfigDTO;
import com.xxl.boot.api.framework.model.entity.Config;
import com.xxl.boot.api.framework.service.ConfigService;
import com.xxl.sso.core.annotation.XxlSso;
import com.xxl.tool.response.PageModel;
import com.xxl.tool.response.Response;
import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 配置管理 Controller
 *
 * @author xuxueli 2024-11-03
 */
@RestController
@RequestMapping("/system/config")
public class ConfigController {

    @Resource
    private ConfigService configService;

    /**
     * 分页查询配置列表
     *
     * @param offset   分页偏移量
     * @param pagesize 每页条数
     * @param status   状态（-1 全部、0 正常、1 停用）
     * @param name     配置名称（模糊匹配）
     * @param key      配置Key（模糊匹配）
     */
    @RequestMapping("/pageList")
    @XxlSso
    public Response<PageModel<ConfigDTO>> pageList(@RequestParam(required = false, defaultValue = "0") int offset,
                                                   @RequestParam(required = false, defaultValue = "10") int pagesize,
                                                   @RequestParam(required = false, defaultValue = "-1") int status,
                                                   String name,
                                                   String key) {
        PageModel<ConfigDTO> pageModel = configService.pageList(status, name, key, offset, pagesize);
        return Response.ofSuccess(pageModel);
    }

    /**
     * Load查询（按ID查询单条配置）
     *
     * @param id 配置ID
     */
    @RequestMapping("/load")
    @XxlSso
    public Response<Config> load(int id){
        return configService.load(id);
    }

    /**
     * 按配置Key查询
     *
     * @param key 配置Key
     */
    @RequestMapping("/loadByKey")
    @XxlSso
    public Response<Config> loadByKey(String key){
        return configService.loadByKey(key);
    }

    /**
     * 新增配置
     *
     * @param xxlBootConfig 配置实体（JSON请求体）
     */
    @RequestMapping("/insert")
    @XxlSso
    public Response<String> insert(@RequestBody(required = false) Config xxlBootConfig){
        return configService.insert(xxlBootConfig);
    }

    /**
     * 批量删除配置
     *
     * @param ids 配置ID列表
     */
    @RequestMapping("/delete")
    @XxlSso
    public Response<String> delete(@RequestParam("ids[]") List<Integer> ids){
        return configService.delete(ids);
    }

    /**
     * 更新配置
     *
     * @param xxlBootConfig 配置实体（JSON请求体）
     */
    @RequestMapping("/update")
    @XxlSso
    public Response<String> update(@RequestBody(required = false) Config xxlBootConfig){
        return configService.update(xxlBootConfig);
    }

}
