package ${codegen.packageName}.service;

import java.util.List;

import com.xxl.tool.response.Response;
import com.xxl.tool.response.PageModel;

import ${codegen.packageName}.model.${codegen.businessName};

<#assign cn = codegen.businessName />
<#assign cnLower = cn?uncap_first />

/**
* ${cn} Service
*
* Created by ${codegen.functionAuthor} on '${.now?string('yyyy-MM-dd HH:mm:ss')}'.
*/
public interface ${cn}Service {

    public Response<String> insert(${cn} ${cnLower});
    public Response<String> delete(List<Integer> ids);
    public Response<String> update(${cn} ${cnLower});
    public Response<${cn}> load(int id);
    public PageModel<${cn}> pageList(int offset, int pagesize);

}
