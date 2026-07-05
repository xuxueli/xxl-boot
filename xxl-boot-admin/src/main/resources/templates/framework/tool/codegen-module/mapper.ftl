package ${classInfo.packageName}.mapper;

import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

<#assign classNameLower = classInfo.className?uncap_first />

/**
* ${classInfo.className} Mapper
*
* Created by ${classInfo.author} on '${.now?string('yyyy-MM-dd HH:mm:ss')}'.
*/
@Mapper
public interface ${classInfo.className}Mapper {

    /**
    * 新增
    */
    public int insert(@Param("${classNameLower}") ${classInfo.className} ${classNameLower});

    /**
    * 删除
    */
    public int delete(@Param("ids") List<Integer> ids);

    /**
    * 更新
    */
    public int update(@Param("${classNameLower}") ${classInfo.className} ${classNameLower});

    /**
    * Load查询
    */
    public ${classInfo.className} load(@Param("id") int id);

    /**
    * 分页查询Data
    */
	public List<${classInfo.className}> pageList(@Param("offset") int offset, @Param("pagesize") int pagesize);

    /**
    * 分页查询Count
    */
    public int pageListCount(@Param("offset") int offset, @Param("pagesize") int pagesize);

}
