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

/**
* ${classInfo.className} Controller
*
* Created by xuxueli on '${.now?string('yyyy-MM-dd HH:mm:ss')}'.
*/
@Controller
@RequestMapping("/${classInfo.className?uncap_first}")
public class ${classInfo.className}Controller {

    @Resource
    private ${classInfo.className}Service ${classInfo.className?uncap_first}Service;

    /**
    * 页面
    */
    @RequestMapping
    @XxlSso
    public String index(Model model) {
        return "${classInfo.className?uncap_first}";
    }

    /**
    * 分页查询
    */
    @RequestMapping("/pageList")
    @ResponseBody
    @XxlSso
    public Response<PageModel<${classInfo.className}>> pageList(@RequestParam(required = false, defaultValue = "0") int offset,
                    @RequestParam(required = false, defaultValue = "10") int pagesize) {
        PageModel<${classInfo.className}> pageModel = ${classInfo.className?uncap_first}Service.pageList(offset, pagesize);
        return Response.ofSuccess(pageModel);
    }

    /**
    * Load查询
    */
    @RequestMapping("/load")
    @ResponseBody
    @XxlSso
    public Response<${classInfo.className}> load(int id){
        return ${classInfo.className?uncap_first}Service.load(id);
    }

    /**
    * 新增
    */
    @RequestMapping("/insert")
    @ResponseBody
    @XxlSso
    public Response<String> insert(${classInfo.className} ${classInfo.className?uncap_first}){
        return ${classInfo.className?uncap_first}Service.insert(${classInfo.className?uncap_first});
    }

    /**
    * 删除
    */
    @RequestMapping("/delete")
    @ResponseBody
    @XxlSso
    public Response<String> delete(@RequestParam("ids[]") List<Integer> ids){
        return ${classInfo.className?uncap_first}Service.delete(ids);
    }

    /**
    * 更新
    */
    @RequestMapping("/update")
    @ResponseBody
    @XxlSso
    public Response<String> update(${classInfo.className} ${classInfo.className?uncap_first}){
        return ${classInfo.className?uncap_first}Service.update(${classInfo.className?uncap_first});
    }

}
