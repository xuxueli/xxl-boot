package com.xxl.boot.admin.service.impl;

import com.xxl.boot.admin.mapper.OrgMapper;
import com.xxl.boot.admin.model.dto.XxlBootOrgDTO;
import com.xxl.boot.admin.model.entity.XxlBootOrg;
import com.xxl.boot.admin.service.OrgService;
import com.xxl.tool.core.CollectionTool;
import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import java.util.*;

import com.xxl.tool.response.Response;
import com.xxl.tool.response.PageModel;

/**
* XxlBootOrg Service Impl
*
* Created by xuxueli on '2024-09-30 15:38:21'.
*/
@Service
public class OrgServiceImpl implements OrgService {

	@Resource
	private OrgMapper orgMapper;

	/**
    * 新增
    */
	@Override
	public Response<String> insert(XxlBootOrg xxlBootOrg) {

		// valid
		if (xxlBootOrg == null) {
			return Response.ofFail("必要参数缺失");
        }

		orgMapper.insert(xxlBootOrg);
		return Response.ofSuccess();
	}

	/**
	* 删除
	*/
	@Override
	public Response<String> delete(List<Integer> ids) {
		if (CollectionTool.isEmpty(ids)) {
			return Response.ofFail("请选择要删除的记录");
		}

		if (CollectionTool.isNotEmpty(orgMapper.queryByParentIds(ids))) {
			return Response.ofFail("存在子组织，禁止删除");
		}

		int ret = orgMapper.delete(ids);
		return ret>0? Response.ofSuccess() : Response.ofFail() ;
	}

	/**
	* 更新
	*/
	@Override
	public Response<String> update(XxlBootOrg xxlBootOrg) {
		int ret = orgMapper.update(xxlBootOrg);
		return ret>0? Response.ofSuccess() : Response.ofFail() ;
	}

	/**
	* Load查询
	*/
	@Override
	public Response<XxlBootOrg> load(int id) {
		XxlBootOrg record = orgMapper.load(id);
		return Response.ofSuccess(record);
	}

	/**
	* 分页查询
	*/
	@Override
	public PageModel<XxlBootOrg> pageList(int offset, int pagesize) {

		List<XxlBootOrg> pageList = orgMapper.pageList(offset, pagesize);
		int totalCount = orgMapper.pageListCount(offset, pagesize);

		// result
		PageModel<XxlBootOrg> pageModel = new PageModel<XxlBootOrg>();
		pageModel.setData(pageList);
		pageModel.setTotal(totalCount);

		return pageModel;
	}

	@Override
	public List<XxlBootOrgDTO> treeList(String name, int status) {
		List<XxlBootOrg> orgDTOList = orgMapper.queryOrg(name, status);
		//return generateTreeList(orgDTOList);
		return orgDTOList.stream().map(org -> new XxlBootOrgDTO(org, null)).toList();
	}

	private List<XxlBootOrgDTO> generateTreeList(List<XxlBootOrg> orgList) {
		List<XxlBootOrgDTO> resultList = new ArrayList<>();
		if (CollectionTool.isEmpty(orgList)) {
			return resultList;
		}

		// collect children data
		Map<Integer, List<XxlBootOrgDTO>> parentMap = new HashMap<>();;
		for (XxlBootOrg org : orgList) {
			int pId = org.getParentId();

			List<XxlBootOrgDTO> sameLevelData = parentMap.containsKey(pId)?parentMap.get(pId) :new ArrayList<>();
			sameLevelData.add(new XxlBootOrgDTO(org, null));

			parentMap.put(pId, sameLevelData);
		}

		// fill chindren
		List<XxlBootOrgDTO> toFillParent = parentMap.get(0);
		while (CollectionTool.isNotEmpty(toFillParent)) {
			List<XxlBootOrgDTO> toFillParentTmp = new ArrayList<>();
			for (XxlBootOrgDTO org : toFillParent) {
				List<XxlBootOrgDTO> children = parentMap.get(org.getId());
				if (CollectionTool.isNotEmpty(children)) {
					org.setChildren(children);
					toFillParentTmp.addAll(children);
				}
			}
			toFillParent = toFillParentTmp;
		}

		return parentMap.get(0);
	}

	@Override
	public List<XxlBootOrgDTO> simpleTreeList(String name, int status) {
		List<XxlBootOrg> orgList = orgMapper.queryOrg(name, status);
		List<XxlBootOrgDTO> result = new ArrayList<>();

		for (XxlBootOrg org : orgList) {
			XxlBootOrgDTO resourceDTO = new XxlBootOrgDTO(org, null);
			result.add(resourceDTO);
		}
		return result;
	}

}
