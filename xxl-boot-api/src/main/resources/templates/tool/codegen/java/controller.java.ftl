package ${codegen.packageName}.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.List;
import jakarta.annotation.Resource;

import com.xxl.tool.response.Response;
import com.xxl.tool.response.PageModel;
import com.xxl.sso.core.annotation.XxlSso;

import ${codegen.packageName}.model.${codegen.businessName};
import ${codegen.packageName}.service.${codegen.businessName}Service;

<#assign cn = codegen.businessName />
<#assign cnLower = cn?uncap_first />

/**
* ${codegen.functionName} Controller
*
* Created by ${codegen.functionAuthor} on '${.now?string('yyyy-MM-dd HH:mm:ss')}'.
*/
@Controller
@RequestMapping("/${cnLower}")
public class ${cn}Controller {

    @Resource
    private ${cn}Service ${cnLower}Service;

    /**
    * 页面
    */
    @RequestMapping
    @XxlSso
    public String index(Model model) {
        return "${cnLower}";
    }

    /**
    * 分页查询
    */
    @RequestMapping("/pageList")
    @ResponseBody
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
    @ResponseBody
    @XxlSso
    public Response<${cn}> load(int id) {
        return ${cnLower}Service.load(id);
    }

    /**
    * 新增
    */
    @RequestMapping("/insert")
    @ResponseBody
    @XxlSso
    public Response<String> insert(${cn} ${cnLower}) {
        return ${cnLower}Service.insert(${cnLower});
    }

    /**
    * 删除
    */
    @RequestMapping("/delete")
    @ResponseBody
    @XxlSso
    public Response<String> delete(@RequestParam("ids[]") List<Integer> ids) {
        return ${cnLower}Service.delete(ids);
    }

    /**
    * 更新
    */
    @RequestMapping("/update")
    @ResponseBody
    @XxlSso
    public Response<String> update(${cn} ${cnLower}) {
        return ${cnLower}Service.update(${cnLower});
    }

}
