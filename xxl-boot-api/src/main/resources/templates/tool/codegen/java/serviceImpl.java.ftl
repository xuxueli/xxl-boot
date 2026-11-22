package ${codegen.packageName}.${codegen.moduleName}.${codegen.businessName?lower_case}.service.impl;

import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import java.util.List;
<#if codegen.tplCategory == "tree">
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
</#if>

import com.xxl.tool.response.Response;
import com.xxl.tool.response.PageModel;

import ${codegen.packageName}.${codegen.moduleName}.${codegen.businessName?lower_case}.model.${codegen.businessName};
import ${codegen.packageName}.${codegen.moduleName}.${codegen.businessName?lower_case}.mapper.${codegen.businessName}Mapper;
import ${codegen.packageName}.${codegen.moduleName}.${codegen.businessName?lower_case}.service.${codegen.businessName}Service;

<#assign cn = codegen.businessName />
<#assign cnLower = cn?uncap_first />

/**
* ${codegen.functionName} Service Impl
*
* @author ${codegen.functionAuthor} ${.now?string('yyyy-MM-dd')}
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

<#if codegen.tplCategory == "tree">
    /**
    * 树形列表：父节点不存在的节点视为根节点，其余挂到父节点 children 下
    */
    @Override
    public List<${cn}> treeList(String name) {
        List<${cn}> list = ${cnLower}Mapper.queryList(name);

        // 按主键索引，便于查找父节点（统一转 long，避免包装类型不一致导致匹配失败）
        Map<Long, ${cn}> idMap = new HashMap<>();
        for (${cn} item : list) {
            idMap.put(((Number) item.getId()).longValue(), item);
        }

        List<${cn}> tree = new ArrayList<>();
        for (${cn} item : list) {
            Object parentId = item.getParentId();
            ${cn} parent = parentId == null ? null : idMap.get(((Number) parentId).longValue());
            if (parent == null) {
                tree.add(item);
            } else {
                parent.getChildren().add(item);
            }
        }
        return tree;
    }

</#if>
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
