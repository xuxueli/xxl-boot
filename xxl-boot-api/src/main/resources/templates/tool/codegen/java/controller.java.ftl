package ${codegen.packageName}.${codegen.moduleName}.${codegen.businessName?lower_case}.controller;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import jakarta.annotation.Resource;

import com.xxl.tool.response.Response;
import com.xxl.tool.response.PageModel;
import com.xxl.sso.core.annotation.XxlSso;

import ${codegen.packageName}.${codegen.moduleName}.${codegen.businessName?lower_case}.model.${codegen.businessName};
import ${codegen.packageName}.${codegen.moduleName}.${codegen.businessName?lower_case}.service.${codegen.businessName}Service;

<#assign cn = codegen.businessName />
<#assign cnLower = cn?uncap_first />

/**
* ${codegen.functionName} Controller
*
* Created by ${codegen.functionAuthor} on '${.now?string('yyyy-MM-dd HH:mm:ss')}'.
*/
@RestController
@RequestMapping("/${codegen.moduleName}/${cnLower}")
public class ${cn}Controller {

    @Resource
    private ${cn}Service ${cnLower}Service;

    /**
    * 分页查询
    */
    @RequestMapping("/pageList")
    @XxlSso
    public Response<PageModel<${cn}>> pageList(@RequestParam(required = false, defaultValue = "0") int offset,
                                               @RequestParam(required = false, defaultValue = "10") int pagesize) {
        PageModel<${cn}> pageModel = ${cnLower}Service.pageList(offset, pagesize);
        return Response.ofSuccess(pageModel);
    }

    /**
    * Load查询
    */
    @RequestMapping("/load")
    @XxlSso
    public Response<${cn}> load(int id) {
        return ${cnLower}Service.load(id);
    }

    /**
    * 新增
    */
    @RequestMapping("/insert")
    @XxlSso
    public Response<String> insert(@RequestBody ${cn} ${cnLower}) {
        return ${cnLower}Service.insert(${cnLower});
    }

    /**
    * 删除
    */
    @RequestMapping("/delete")
    @XxlSso
    public Response<String> delete(@RequestParam("ids[]") List<Integer> ids) {
        return ${cnLower}Service.delete(ids);
    }

    /**
    * 更新
    */
    @RequestMapping("/update")
    @XxlSso
    public Response<String> update(@RequestBody ${cn} ${cnLower}) {
        return ${cnLower}Service.update(${cnLower});
    }

}
