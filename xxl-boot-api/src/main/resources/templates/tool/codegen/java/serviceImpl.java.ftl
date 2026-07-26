package ${codegen.packageName}.service;

import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import java.util.List;

import com.xxl.tool.response.Response;
import com.xxl.tool.response.PageModel;

import ${codegen.packageName}.model.${codegen.businessName};
import ${codegen.packageName}.mapper.${codegen.businessName}Mapper;

<#assign cn = codegen.businessName />
<#assign cnLower = cn?uncap_first />

/**
* ${codegen.functionName} Service Impl
*
* Created by ${codegen.functionAuthor} on '${.now?string('yyyy-MM-dd HH:mm:ss')}'.
*/
@Service
public class ${cn}ServiceImpl implements ${cn}Service {

    @Resource
    private ${cn}Mapper ${cnLower}Mapper;

    /**
    * 新增
    */
    @Override
    public Response<String> insert(${cn} ${cnLower}) {
        if (${cnLower} == null) {
            return Response.ofFail("必要参数缺失");
        }
        ${cnLower}Mapper.insert(${cnLower});
        return Response.ofSuccess();
    }

    /**
    * 删除
    */
    @Override
    public Response<String> delete(List<Integer> ids) {
        int ret = ${cnLower}Mapper.delete(ids);
        return ret > 0 ? Response.ofSuccess() : Response.ofFail();
    }

    /**
    * 更新
    */
    @Override
    public Response<String> update(${cn} ${cnLower}) {
        int ret = ${cnLower}Mapper.update(${cnLower});
        return ret > 0 ? Response.ofSuccess() : Response.ofFail();
    }

    /**
    * 根据 ID 查询
    */
    @Override
    public Response<${cn}> load(int id) {
        ${cn} record = ${cnLower}Mapper.load(id);
        return Response.ofSuccess(record);
    }

    /**
    * 分页查询
    */
    @Override
    public PageModel<${cn}> pageList(int offset, int pagesize) {
        List<${cn}> list = ${cnLower}Mapper.pageList(offset, pagesize);
        int total = ${cnLower}Mapper.pageListCount(offset, pagesize);
        PageModel<${cn}> pm = new PageModel<>();
        pm.setData(list);
        pm.setTotal(total);
        return pm;
    }

}
