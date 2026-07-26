package ${codegen.packageName}.mapper;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

import ${codegen.packageName}.model.${codegen.businessName};

<#assign cn = codegen.businessName />
<#assign cnLower = cn?uncap_first />

/**
* ${codegen.functionName} Mapper
*
* Created by ${codegen.functionAuthor} on '${.now?string('yyyy-MM-dd HH:mm:ss')}'.
*/
@Mapper
public interface ${cn}Mapper {

    /**
    * 新增
    */
    public int insert(@Param("${cnLower}") ${cn} ${cnLower});

    /**
    * 删除
    */
    public int delete(@Param("ids") List<Integer> ids);

    /**
    * 更新
    */
    public int update(@Param("${cnLower}") ${cn} ${cnLower});

    /**
    * 根据 ID 查询
    */
    public ${cn} load(@Param("id") int id);

    /**
    * 分页列表
    */
    public List<${cn}> pageList(@Param("offset") int offset, @Param("pagesize") int pagesize);

    /**
    * 分页计数
    */
    public int pageListCount(@Param("offset") int offset, @Param("pagesize") int pagesize);

}
