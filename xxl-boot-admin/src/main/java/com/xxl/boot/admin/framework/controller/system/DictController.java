package com.xxl.boot.admin.framework.controller.system;

import com.xxl.boot.admin.framework.constant.enums.DictStatusEnum;
import com.xxl.boot.admin.framework.model.dto.DictDTO;
import com.xxl.boot.admin.framework.model.dto.DictItemDTO;
import com.xxl.boot.admin.framework.model.entity.Dict;
import com.xxl.boot.admin.framework.model.entity.DictItem;
import com.xxl.boot.admin.framework.service.DictService;
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
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.ArrayList;
import java.util.List;

@Controller
@RequestMapping("/system/dict")
public class DictController {
    private static final Logger logger = LoggerFactory.getLogger(DictController.class);


    @Resource
    private DictService dictService;

    @RequestMapping
    @XxlSso
    public String index(Model model) {
        model.addAttribute("DictStatusEnum", DictStatusEnum.values());
        return "/framework/system/dict";
    }

    @RequestMapping("/pageList")
    @ResponseBody
    @XxlSso
    public Response<PageModel<DictDTO>> pageList(@RequestParam(required = false, defaultValue = "0") int offset,
                                                 @RequestParam(required = false, defaultValue = "10") int pagesize,
                                                 @RequestParam(required = false, defaultValue = "-1") int status,
                                                 String name,
                                                 String type) {
        PageModel<DictDTO> pageModel = dictService.pageList(name, type, status, offset, pagesize);
        return Response.ofSuccess(pageModel);
    }

    @RequestMapping("/load")
    @ResponseBody
    @XxlSso
    public Response<Dict> load(int id) {
        return dictService.load(id);
    }

    @RequestMapping("/insert")
    @ResponseBody
    @XxlSso
    public Response<String> insert(Dict xxlBootDict) {
        return dictService.insert(xxlBootDict);
    }

    @RequestMapping("/delete")
    @ResponseBody
    @XxlSso
    public Response<String> delete(@RequestParam("ids[]") List<Integer> ids) {
        return dictService.delete(ids);
    }

    @RequestMapping("/update")
    @ResponseBody
    @XxlSso
    public Response<String> update(Dict xxlBootDict) {
        return dictService.update(xxlBootDict);
    }

    @RequestMapping("/itemPageList")
    @ResponseBody
    @XxlSso
    public Response<PageModel<DictItemDTO>> itemPageList(@RequestParam(required = false, defaultValue = "0") int offset,
                                                                @RequestParam(required = false, defaultValue = "10") int pagesize,
                                                                @RequestParam(required = false, defaultValue = "-1") int status,
                                                                long dictId,
                                                                String name) {
        PageModel<DictItemDTO> pageModel = dictService.itemPageList(dictId, name, status, offset, pagesize);
        return Response.ofSuccess(pageModel);
    }

    @RequestMapping("/itemLoad")
    @ResponseBody
    @XxlSso
    public Response<DictItem> itemLoad(int id) {
        return dictService.loadItem(id);
    }

    @RequestMapping("/itemInsert")
    @ResponseBody
    @XxlSso
    public Response<String> itemInsert(DictItem xxlBootDictItem) {
        return dictService.insertItem(xxlBootDictItem);
    }

    @RequestMapping("/itemDelete")
    @ResponseBody
    @XxlSso
    public Response<String> itemDelete(@RequestParam("ids[]") List<Integer> ids) {
        return dictService.deleteItem(ids);
    }

    @RequestMapping("/itemUpdate")
    @ResponseBody
    @XxlSso
    public Response<String> itemUpdate(DictItem xxlBootDictItem) {
        return dictService.updateItem(xxlBootDictItem);
    }

    /**
     * 通用枚举查询
     */
    @RequestMapping("/loadEnumItem")
    @ResponseBody
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
