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
* ${cn} Service Impl
*
* Created by ${codegen.functionAuthor} on '${.now?string('yyyy-MM-dd HH:mm:ss')}'.
*/
@Service
public class ${cn}ServiceImpl implements ${cn}Service {

	@Resource
	private ${cn}Mapper ${cnLower}Mapper;

	@Override
	public Response<String> insert(${cn} ${cnLower}) {
		if (${cnLower} == null) return Response.ofFail("必要参数缺失");
		${cnLower}Mapper.insert(${cnLower});
		return Response.ofSuccess();
	}

	@Override
	public Response<String> delete(List<Integer> ids) {
		return ${cnLower}Mapper.delete(ids) > 0 ? Response.ofSuccess() : Response.ofFail();
	}

	@Override
	public Response<String> update(${cn} ${cnLower}) {
		return ${cnLower}Mapper.update(${cnLower}) > 0 ? Response.ofSuccess() : Response.ofFail();
	}

	@Override
	public Response<${cn}> load(int id) {
		return Response.ofSuccess(${cnLower}Mapper.load(id));
	}

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
