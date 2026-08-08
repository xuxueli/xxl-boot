package ${codegen.packageName}.${codegen.moduleName}.service;

import java.util.List;

import com.xxl.tool.response.Response;
import com.xxl.tool.response.PageModel;

import ${codegen.packageName}.${codegen.moduleName}.model.${codegen.businessName};

<#assign cn = codegen.businessName />
<#assign cnLower = cn?uncap_first />

/**
* ${codegen.functionName} Service
*
* Created by ${codegen.functionAuthor} on '${.now?string('yyyy-MM-dd HH:mm:ss')}'.
*/
public interface ${cn}Service {

    /**
    * 新增
    */
    public Response<String> insert(${cn} ${cnLower});

    /**
    * 删除
    */
    public Response<String> delete(List<Integer> ids);

    /**
    * 更新
    */
    public Response<String> update(${cn} ${cnLower});

    /**
    * 根据 ID 查询
    */
    public Response<${cn}> load(int id);

    /**
    * 分页查询
    */
    public PageModel<${cn}> pageList(int offset, int pagesize);

}
