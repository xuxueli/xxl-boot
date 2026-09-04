package com.xxl.boot.api.framework.controller.system;

import com.xxl.boot.api.framework.model.dto.DictDTO;
import com.xxl.boot.api.framework.model.dto.DictItemDTO;
import com.xxl.boot.api.framework.model.entity.Dict;
import com.xxl.boot.api.framework.model.entity.DictItem;
import com.xxl.boot.api.framework.service.DictService;
import com.xxl.sso.core.annotation.XxlSso;
import com.xxl.tool.core.CollectionTool;
import com.xxl.tool.core.EnumTool;
import com.xxl.tool.response.PageModel;
import com.xxl.tool.response.Response;
import jakarta.annotation.Resource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.config.BeanDefinition;
import org.springframework.context.annotation.ClassPathScanningCandidateComponentProvider;
import org.springframework.core.type.filter.AssignableTypeFilter;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

/**
 * 字典管理 Controller
 *
 * @author xuxueli 2024-11-03
 */
@RestController
@RequestMapping("/system/dict")
public class DictController {
    private static final Logger logger = LoggerFactory.getLogger(DictController.class);


    @Resource
    private DictService dictService;

    /**
     * 分页查询字典列表
     *
     * @param offset   分页偏移量
     * @param pagesize 每页条数
     * @param status   状态（-1 全部、0 正常、1 停用）
     * @param name     字典名称（模糊匹配）
     * @param type     字典Type（模糊匹配）
     */
    @RequestMapping("/pageList")
    @XxlSso
    public Response<PageModel<DictDTO>> pageList(@RequestParam(required = false, defaultValue = "0") int offset,
                                                 @RequestParam(required = false, defaultValue = "10") int pagesize,
                                                 @RequestParam(required = false, defaultValue = "-1") int status,
                                                 String name,
                                                 String type) {
        PageModel<DictDTO> pageModel = dictService.pageList(name, type, status, offset, pagesize);
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
                                                         @RequestParam(required = false, defaultValue = "0") long dictId) {
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
     * 按字典Type查询字典项列表（供下拉选项、回显使用）
     *
     * @param type 字典Type
     */
    @RequestMapping("/loadDictItem")
    @XxlSso
    public Response<List<DictItem>> loadDictItem(String type) {
        return dictService.getDictItemsByType(type);
    }

    /**
     * 按枚举Name查询枚举项数据
     *
     * @param enumName 枚举类名
     */
    @RequestMapping("/loadEnumItem")
    @XxlSso
    public Response<List<EnumTool.EnumItemVO>> loadEnum(String enumName) {
        // 动态收集平台包 + 业务枚举包
        List<EnumTool.EnumItemVO> list = EnumTool.getEnumItemList(businessEnumPackages(), enumName);
        return CollectionTool.isNotEmpty(list) ?
                Response.ofSuccess(list) :
                Response.ofFail("枚举不存在: " + enumName);
    }

    /**
     * 业务模块根包：业务枚举随动态 module 落位（business/任意子包），动态扫描收集
     */
    private static final String BIZ_ROOT_PACKAGE = "com.xxl.boot";

    /**
     * 业务枚举包列表缓存：business 根包下「包含 IEnum 枚举」的包名
     */
    private static volatile List<String> bizEnumPackageList;

    /**
     * 动态收集业务枚举包：扫描 business 根包内实现 EnumTool.IEnum 的枚举，收集其所在包，
     * 一次扫描后缓存，命中与未命中都走缓存，避免反复全包扫描。
     */
    private static List<String> businessEnumPackages() {
        if (bizEnumPackageList != null) {
            return bizEnumPackageList;
        }
        synchronized (DictController.class) {
            if (bizEnumPackageList == null) {
                List<String> packageList = new ArrayList<>();
                ClassPathScanningCandidateComponentProvider scanner =
                        new ClassPathScanningCandidateComponentProvider(false);
                scanner.addIncludeFilter(new AssignableTypeFilter(EnumTool.IEnum.class));
                for (BeanDefinition beanDefinition : scanner.findCandidateComponents(BIZ_ROOT_PACKAGE)) {
                    try {
                        Class<?> clazz = Class.forName(beanDefinition.getBeanClassName());
                        if (clazz.isEnum() && EnumTool.IEnum.class.isAssignableFrom(clazz)) {
                            String enumPackage = clazz.getPackage().getName();
                            if (!packageList.contains(enumPackage)) {
                                packageList.add(enumPackage);
                            }
                        }
                    } catch (ClassNotFoundException ignored) {
                        logger.debug("DictController.businessEnumPackages error, class invalid:{}", BIZ_ROOT_PACKAGE, ignored);
                    }
                }
                logger.info("DictController scanned business enum packages, count={}, packages={}",
                        packageList.size(), packageList);
                bizEnumPackageList = packageList;
            }
        }
        return bizEnumPackageList;
    }

}
