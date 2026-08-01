package com.xxl.boot.api.framework.controller.system;

import com.xxl.boot.api.framework.constant.enums.DictStatusEnum;
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

@RestController
@RequestMapping("/system/dict")
public class DictController {

    @Resource
    private DictService dictService;

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

    @RequestMapping("/load")
    @XxlSso
    public Response<Dict> load(int id) {
        return dictService.load(id);
    }

    @RequestMapping("/insert")
    @XxlSso
    public Response<String> insert(@RequestBody(required = false) Dict xxlBootDict) {
        return dictService.insert(xxlBootDict);
    }

    @RequestMapping("/delete")
    @XxlSso
    public Response<String> delete(@RequestParam("ids[]") List<Integer> ids) {
        return dictService.delete(ids);
    }

    @RequestMapping("/update")
    @XxlSso
    public Response<String> update(@RequestBody(required = false) Dict xxlBootDict) {
        return dictService.update(xxlBootDict);
    }

    @RequestMapping("/itemPageList")
    @XxlSso
    public Response<PageModel<DictItemDTO>> itemPageList(@RequestParam(required = false, defaultValue = "0") int offset,
                                                                @RequestParam(required = false, defaultValue = "10") int pagesize,
                                                                long dictId) {
        PageModel<DictItemDTO> pageModel = dictService.itemPageList(dictId, offset, pagesize);
        return Response.ofSuccess(pageModel);
    }

    @RequestMapping("/itemLoad")
    @XxlSso
    public Response<DictItem> itemLoad(int id) {
        return dictService.loadItem(id);
    }

    @RequestMapping("/itemInsert")
    @XxlSso
    public Response<String> itemInsert(@RequestBody(required = false) DictItem xxlBootDictItem) {
        return dictService.insertItem(xxlBootDictItem);
    }

    @RequestMapping("/itemDelete")
    @XxlSso
    public Response<String> itemDelete(@RequestParam("ids[]") List<Integer> ids) {
        return dictService.deleteItem(ids);
    }

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
     */
    @RequestMapping("/loadDictItem")
    @XxlSso
    public Response<List<DictItem>> loadDictItem(String dictCode) {
        return dictService.getDictItemsByCode(dictCode);
    }

    /**
     * 按枚举Name查询枚举项数据
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
