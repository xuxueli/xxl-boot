package ${codegen.packageName}.mapper;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

import ${codegen.packageName}.model.${codegen.businessName};

<#assign cn = codegen.businessName />
<#assign cnLower = cn?uncap_first />

/**
* ${cn} Mapper
*
* Created by ${codegen.functionAuthor} on '${.now?string('yyyy-MM-dd HH:mm:ss')}'.
*/
@Mapper
public interface ${cn}Mapper {

    public int insert(@Param("${cnLower}") ${cn} ${cnLower});
    public int delete(@Param("ids") List<Integer> ids);
    public int update(@Param("${cnLower}") ${cn} ${cnLower});
    public ${cn} load(@Param("id") int id);
    public List<${cn}> pageList(@Param("offset") int offset, @Param("pagesize") int pagesize);
    public int pageListCount(@Param("offset") int offset, @Param("pagesize") int pagesize);

}
