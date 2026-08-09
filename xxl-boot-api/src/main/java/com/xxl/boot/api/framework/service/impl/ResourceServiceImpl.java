package com.xxl.boot.api.framework.service.impl;

import com.xxl.boot.api.framework.constant.enums.ResourceStatuEnum;
import com.xxl.boot.api.framework.constant.enums.ResourceTypeEnum;
import com.xxl.boot.api.framework.mapper.authz.ResourceMapper;
import com.xxl.boot.api.framework.mapper.authz.RoleResMapper;
import com.xxl.boot.api.framework.model.dto.ResourceDTO;
import com.xxl.boot.api.framework.model.entity.Resource;
import com.xxl.boot.api.framework.service.ResourceService;
import com.xxl.tool.core.CollectionTool;
import com.xxl.tool.response.PageModel;
import com.xxl.tool.response.Response;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
* Resource Service Impl
*
* Created by xuxueli on '2024-07-28 12:52:39'.
*/
@Service
public class ResourceServiceImpl implements ResourceService {

	@jakarta.annotation.Resource
	private ResourceMapper resourceMapper;

	@jakarta.annotation.Resource
	private RoleResMapper roleResMapper;

	/**
    * 新增
    */
	@Override
	public Response<String> insert(Resource xxlBootResource) {

		// valid
		if (xxlBootResource == null) {
			return Response.ofFail("必要参数缺失");
        }

		// limit： 按钮只能是叶子节点 + 资源类型不能变化；
		if (xxlBootResource.getParentId() > 0) {
			Resource resource = resourceMapper.load(xxlBootResource.getParentId());
			if (resource == null) {
				return Response.ofFail("操作失败，parentId非法");
			}
			if (ResourceTypeEnum.BUTTOM.getCode() == resource.getType()) {
				return Response.ofFail("操作失败，按钮无法添加子资源");
			}
		}

		resourceMapper.insert(xxlBootResource);
		return Response.ofSuccess();
	}

	/**
	* 删除
	*/
	@Override
	public Response<String> delete(List<Integer> ids) {

		List<Resource> resourceList = resourceMapper.queryByParentIds(ids);
		if (CollectionTool.isNotEmpty(resourceList)) {
			return Response.ofFail("删除失败，已关联子资源");
		}

		// 校验资源是否被角色关联，关联则不允许删除
		int roleResCount = roleResMapper.countByResIds(ids);
		if (roleResCount > 0) {
			return Response.ofFail("删除失败，资源已关联角色，不允许删除");
		}

		int ret = resourceMapper.delete(ids);
		return ret>0? Response.ofSuccess() : Response.ofFail();
	}

	/**
	* 更新
	*/
	@Override
	public Response<String> update(Resource xxlBootResource) {

		if (xxlBootResource.getParentId() == xxlBootResource.getId()) {
			return Response.ofFail("操作失败，父资源不能设置为自己");
		}

		int ret = resourceMapper.update(xxlBootResource);
		return ret>0? Response.ofSuccess() : Response.ofFail();
	}

	/**
	 * 批量更新排序
	 */
	@Override
	public Response<String> updateSort(List<Integer> ids, List<Integer> orders) {

		// valid：id 与 排序值 列表均非空且长度一致
		if (CollectionTool.isEmpty(ids) || CollectionTool.isEmpty(orders) || ids.size() != orders.size()) {
			return Response.ofFail("必要参数缺失");
		}

		int ret = resourceMapper.updateSort(ids, orders);
		return ret>0? Response.ofSuccess() : Response.ofFail();
	}

	/**
	* Load查询
	*/
	@Override
	public Response<Resource> load(int id) {
		Resource record = resourceMapper.load(id);
		return Response.ofSuccess(record);
	}

	/**
	* 分页查询
	*/
	@Override
	public PageModel<Resource> pageList(int offset, int pagesize) {

		List<Resource> pageList = resourceMapper.pageList(offset, pagesize);
		int totalCount = resourceMapper.pageListCount(offset, pagesize);

		// result
		PageModel<Resource> pageModel = new PageModel<Resource>();
		pageModel.setData(pageList);
		pageModel.setTotal(totalCount);

		return pageModel;
	}

	@Override
	public List<ResourceDTO> treeList(String name, int status) {
		List<Resource> resourceList = resourceMapper.queryResource(name, status);
		//return generateTreeList(resourceList);
		return resourceList.stream().map(resource -> new ResourceDTO(resource, null)).toList();
	}

	/*@Override
	public List<XxlBootResourceDTO> treeListByUserId(int userId) {
		List<XxlBootResource> resourceList = resourceMapper.queryResourceByUserId(userId, ResourceStatuEnum.NORMAL.getCode());
		return generateTreeList(resourceList);
	}*/

	@Override
	public List<Resource> queryResourceByUserid(int userId, int visible) {
        return resourceMapper.queryResourceByUserId(userId, ResourceStatuEnum.NORMAL.getCode(), visible);
	}

	/**
	 * build resource tree
	 */
	private List<ResourceDTO> generateTreeList(List<Resource> resourceList) {
		List<ResourceDTO> resultList = new ArrayList<>();
		if (CollectionTool.isEmpty(resourceList)) {
			return resultList;
		}

		// collect children data
		Map<Integer, List<ResourceDTO>> parentMap = new HashMap<>();;
		for (Resource resource : resourceList) {
			int pId = resource.getParentId();

			List<ResourceDTO> sameLevelData = parentMap.containsKey(pId)?parentMap.get(pId) :new ArrayList<>();
			sameLevelData.add(new ResourceDTO(resource, null));

			parentMap.put(pId, sameLevelData);
		}

		// fill chindren
		List<ResourceDTO> toFillParent = parentMap.get(0);
		while (CollectionTool.isNotEmpty(toFillParent)) {
			List<ResourceDTO> toFillParentTmp = new ArrayList<>();
			for (ResourceDTO resource : toFillParent) {
				List<ResourceDTO> children = parentMap.get(resource.getId());
				if (CollectionTool.isNotEmpty(children)) {
					resource.setChildren(children);
					toFillParentTmp.addAll(children);
				}
			}
			toFillParent = toFillParentTmp;
		}

		return parentMap.get(0);
	}

}
