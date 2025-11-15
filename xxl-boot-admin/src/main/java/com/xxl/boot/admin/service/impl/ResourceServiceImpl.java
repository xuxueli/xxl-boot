package com.xxl.boot.admin.service.impl;

import com.xxl.boot.admin.constant.enums.ResourceStatuEnum;
import com.xxl.boot.admin.constant.enums.ResourceTypeEnum;
import com.xxl.boot.admin.mapper.ResourceMapper;
import com.xxl.boot.admin.model.dto.XxlBootResourceDTO;
import com.xxl.boot.admin.model.entity.XxlBootResource;
import com.xxl.boot.admin.service.ResourceService;
import com.xxl.tool.core.CollectionTool;
import com.xxl.tool.response.PageModel;
import com.xxl.tool.response.Response;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
* XxlBootResource Service Impl
*
* Created by xuxueli on '2024-07-28 12:52:39'.
*/
@Service
public class ResourceServiceImpl implements ResourceService {

	@Resource
	private ResourceMapper resourceMapper;

	/**
    * 新增
    */
	@Override
	public Response<String> insert(XxlBootResource xxlBootResource) {

		// valid
		if (xxlBootResource == null) {
			return Response.ofFail("必要参数缺失");
        }

		// limit： 按钮只能是叶子节点 + 资源类型不能变化；
		if (xxlBootResource.getParentId() > 0) {
			XxlBootResource resource = resourceMapper.load(xxlBootResource.getParentId());
			if (resource == null) {
				return Response.ofFail("操作失败，parentId非法");
			}
			if (ResourceTypeEnum.BUTTOM.getValue() == resource.getType()) {
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

		List<XxlBootResource> resourceList = resourceMapper.queryByParentIds(ids);
		if (CollectionTool.isNotEmpty(resourceList)) {
			return Response.ofFail("删除失败，已关联子资源");
		}

		int ret = resourceMapper.delete(ids);
		return ret>0? Response.ofSuccess() : Response.ofFail();
	}

	/**
	 * 更新
	 */
	@Override
	public Response<String> update(XxlBootResource xxlBootResource) {
		int ret = resourceMapper.update(xxlBootResource);
		return ret>0? Response.ofSuccess() : Response.ofFail();
	}

	/**
	* Load查询
	*/
	@Override
	public Response<XxlBootResource> load(int id) {
		XxlBootResource record = resourceMapper.load(id);
		return Response.ofSuccess(record);
	}

	/**
	* 分页查询
	*/
	@Override
	public PageModel<XxlBootResource> pageList(int offset, int pagesize) {

		List<XxlBootResource> pageList = resourceMapper.pageList(offset, pagesize);
		int totalCount = resourceMapper.pageListCount(offset, pagesize);

		// result
		PageModel<XxlBootResource> pageModel = new PageModel<XxlBootResource>();
		pageModel.setData(pageList);
		pageModel.setTotal(totalCount);

		return pageModel;
	}

	@Override
	public List<XxlBootResourceDTO> treeList(String name, int status) {
		List<XxlBootResource> resourceList = resourceMapper.queryResource(name, status);
		//return generateTreeList(resourceList);
		return resourceList.stream().map(resource -> new XxlBootResourceDTO(resource, null)).toList();
	}

	@Override
	public List<XxlBootResourceDTO> simpleTreeList(String name, int status) {
		List<XxlBootResource> resourceList = resourceMapper.queryResource(name, status);
		List<XxlBootResourceDTO> result = new ArrayList<>();

		for (XxlBootResource resource : resourceList) {
			XxlBootResourceDTO resourceDTO = new XxlBootResourceDTO(resource, null);
			resourceDTO.setUrl(null);
			resourceDTO.setIcon(null);
			result.add(resourceDTO);
		}
		return result;
	}

	@Override
	public List<XxlBootResourceDTO> treeListByUserId(int userId) {
		List<XxlBootResource> resourceList = resourceMapper.queryResourceByUserId(userId, ResourceStatuEnum.NORMAL.getValue());
		return generateTreeList(resourceList);
	}

	/**
	 * build resource tree
	 */
	private List<XxlBootResourceDTO> generateTreeList(List<XxlBootResource> resourceList) {
		List<XxlBootResourceDTO> resultList = new ArrayList<>();
		if (CollectionTool.isEmpty(resourceList)) {
			return resultList;
		}

		// collect children data
		Map<Integer, List<XxlBootResourceDTO>> parentMap = new HashMap<>();;
		for (XxlBootResource resource : resourceList) {
			int pId = resource.getParentId();

			List<XxlBootResourceDTO> sameLevelData = parentMap.containsKey(pId)?parentMap.get(pId) :new ArrayList<>();
			sameLevelData.add(new XxlBootResourceDTO(resource, null));

			parentMap.put(pId, sameLevelData);
		}

		// fill chindren
		List<XxlBootResourceDTO> toFillParent = parentMap.get(0);
		while (CollectionTool.isNotEmpty(toFillParent)) {
			List<XxlBootResourceDTO> toFillParentTmp = new ArrayList<>();
			for (XxlBootResourceDTO resource : toFillParent) {
				List<XxlBootResourceDTO> children = parentMap.get(resource.getId());
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
