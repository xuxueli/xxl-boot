package com.xxl.boot.api.framework.controller.system;

import com.xxl.boot.api.framework.model.dto.DictDTO;
import com.xxl.boot.api.framework.model.dto.DictItemDTO;
import com.xxl.boot.api.framework.model.entity.Dict;
import com.xxl.boot.api.framework.model.entity.DictItem;
import com.xxl.boot.api.framework.service.DictService;
import com.xxl.boot.api.framework.util.EnumTool;
import com.xxl.sso.core.annotation.XxlSso;
import com.xxl.tool.core.CollectionTool;
import com.xxl.tool.response.PageModel;
import com.xxl.tool.response.Response;
import jakarta.annotation.Resource;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 字典管理 Controller
 *
 * @author xuxueli 2024-11-03
 */
@RestController
@RequestMapping("/system/dict")
public class DictController {

    @Resource
    private DictService dictService;

    /**
     * 分页查询字典列表
     *
     * @param offset   分页偏移量
     * @param pagesize 每页条数
     * @param status   状态（-1 全部、0 正常、1 停用）
     * @param name     字典名称（模糊匹配）
     * @param code     字典标识（模糊匹配）
     */
    @RequestMapping("/pageList")
    @XxlSso
    public Response<PageModel<DictDTO>> pageList(@RequestParam(required = false, defaultValue = "0") int offset,
                                                 @RequestParam(required = false, defaultValue = "10") int pagesize,
                                                 @RequestParam(required = false, defaultValue = "-1") int status,
                                                 String name,
                                                 String code) {
        PageModel<DictDTO> pageModel = dictService.pageList(name, code, status, offset, pagesize);
        return Response.ofSuccess(pageModel);
    }

    /**
     * Load查询（按ID查询单条字典）
     *
     * @param id 字典ID
     */
    @RequestMapping("/load")
    @XxlSso
    public Response<Dict> load(int id) {
        return dictService.load(id);
    }

    /**
     * 新增字典
     *
     * @param xxlBootDict 字典实体（JSON请求体）
     */
    @RequestMapping("/insert")
    @XxlSso
    public Response<String> insert(@RequestBody(required = false) Dict xxlBootDict) {
        return dictService.insert(xxlBootDict);
    }

    /**
     * 批量删除字典
     *
     * @param ids 字典ID列表
     */
    @RequestMapping("/delete")
    @XxlSso
    public Response<String> delete(@RequestParam("ids[]") List<Integer> ids) {
        return dictService.delete(ids);
    }

    /**
     * 更新字典
     *
     * @param xxlBootDict 字典实体（JSON请求体）
     */
    @RequestMapping("/update")
    @XxlSso
    public Response<String> update(@RequestBody(required = false) Dict xxlBootDict) {
        return dictService.update(xxlBootDict);
    }

    /**
     * 分页查询字典项列表
     *
     * @param offset   分页偏移量
     * @param pagesize 每页条数
     * @param dictId   字典ID
     */
    @RequestMapping("/itemPageList")
    @XxlSso
    public Response<PageModel<DictItemDTO>> itemPageList(@RequestParam(required = false, defaultValue = "0") int offset,
                                                         @RequestParam(required = false, defaultValue = "10") int pagesize,
                                                         long dictId) {
        PageModel<DictItemDTO> pageModel = dictService.itemPageList(dictId, offset, pagesize);
        return Response.ofSuccess(pageModel);
    }

    /**
     * Load查询（按ID查询单条字典项）
     *
     * @param id 字典项ID
     */
    @RequestMapping("/itemLoad")
    @XxlSso
    public Response<DictItem> itemLoad(int id) {
        return dictService.loadItem(id);
    }

    /**
     * 新增字典项
     *
     * @param xxlBootDictItem 字典项实体（JSON请求体）
     */
    @RequestMapping("/itemInsert")
    @XxlSso
    public Response<String> itemInsert(@RequestBody(required = false) DictItem xxlBootDictItem) {
        return dictService.insertItem(xxlBootDictItem);
    }

    /**
     * 批量删除字典项
     *
     * @param ids 字典项ID列表
     */
    @RequestMapping("/itemDelete")
    @XxlSso
    public Response<String> itemDelete(@RequestParam("ids[]") List<Integer> ids) {
        return dictService.deleteItem(ids);
    }

    /**
     * 更新字典项
     *
     * @param xxlBootDictItem 字典项实体（JSON请求体）
     */
    @RequestMapping("/itemUpdate")
    @XxlSso
    public Response<String> itemUpdate(@RequestBody(required = false) DictItem xxlBootDictItem) {
        return dictService.updateItem(xxlBootDictItem);
    }


    // ---------------------- 字典、枚举 查询 ----------------------

    /**
     * 查询全部字典（供代码生成等场景的下拉选项使用）
     */
    @RequestMapping("/queryDictList")
    @XxlSso
    public Response<List<Dict>> queryDictList() {
        return dictService.queryDictList();
    }

    /**
     * 按字典标识查询字典项列表（供下拉选项、回显使用）
     *
     * @param dictCode 字典标识
     */
    @RequestMapping("/loadDictItem")
    @XxlSso
    public Response<List<DictItem>> loadDictItem(String dictCode) {
        return dictService.getDictItemsByCode(dictCode);
    }

    /**
     * 按枚举Name查询枚举项数据
     *
     * @param enumName 枚举类名
     */
    @RequestMapping("/loadEnumItem")
    @XxlSso
    public Response<List<EnumTool.EnumItemVO>> loadEnum(String enumName) {
        List<EnumTool.EnumItemVO> list = EnumTool.getEnumItemList(List.of("com.xxl.boot.api.framework.constant.enums"), enumName);
        return CollectionTool.isNotEmpty(list) ?
                Response.ofSuccess(list) :
                Response.ofFail("枚举不存在: " + enumName);
    }

}
