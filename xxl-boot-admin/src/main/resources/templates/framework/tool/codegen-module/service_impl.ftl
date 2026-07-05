package ${classInfo.packageName}.service;

import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import com.xxl.tool.response.Response;
import com.xxl.tool.response.PageModel;

<#assign classNameLower = classInfo.className?uncap_first />

/**
* ${classInfo.className} Service Impl
*
* Created by ${classInfo.author} on '${.now?string('yyyy-MM-dd HH:mm:ss')}'.
*/
@Service
public class ${classInfo.className}ServiceImpl implements ${classInfo.className}Service {

	@Resource
	private ${classInfo.className}Mapper ${classNameLower}Mapper;

	/**
    * 新增
    */
	@Override
	public Response<String> insert(${classInfo.className} ${classNameLower}) {

		// valid
		if (${classNameLower} == null) {
			return Response.ofFail("必要参数缺失");
        }

		${classNameLower}Mapper.insert(${classNameLower});
		return Response.ofSuccess();
	}

	/**
	* 删除
	*/
	@Override
	public Response<String> delete(List<Integer> ids) {
		int ret = ${classNameLower}Mapper.delete(ids);
			return ret>0? Response.ofSuccess() : Response.ofFail() ;
	}

	/**
	* 更新
	*/
	@Override
	public Response<String> update(${classInfo.className} ${classNameLower}) {
		int ret = ${classNameLower}Mapper.update(${classNameLower});
		return ret>0? Response.ofSuccess() : Response.ofFail() ;
	}

	/**
	* Load查询
	*/
	@Override
	public Response<${classInfo.className}> load(int id) {
		${classInfo.className} record = ${classNameLower}Mapper.load(id);
		return Response.ofSuccess(record);
	}

	/**
	* 分页查询
	*/
	@Override
	public PageModel<${classInfo.className}> pageList(int offset, int pagesize) {

		List<${classInfo.className}> pageList = ${classNameLower}Mapper.pageList(offset, pagesize);
		int totalCount = ${classNameLower}Mapper.pageListCount(offset, pagesize);

		// result
		PageModel<${classInfo.className}> pageModel = new PageModel<${classInfo.className}>();
		pageModel.setData(pageList);
		pageModel.setTotal(totalCount);

		return pageModel;
	}

}
