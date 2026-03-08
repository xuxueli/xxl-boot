package com.xxl.boot.admin.plugin.ai.service.impl;

import com.xxl.boot.admin.plugin.ai.constant.enums.KbDucumentStatusEnum;
import com.xxl.boot.admin.plugin.ai.mapper.KbDocumentMapper;
import com.xxl.boot.admin.plugin.ai.model.KbDocument;
import com.xxl.boot.admin.plugin.ai.service.KbDocumentService;
import com.xxl.tool.core.StringTool;
import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import com.xxl.tool.response.Response;
import com.xxl.tool.response.PageModel;

/**
* KbDocument Service Impl
*
* Created by xuxueli on '2026-03-08 10:57:39'.
*/
@Service
public class KbDocumentServiceImpl implements KbDocumentService {

	@Resource
	private KbDocumentMapper kbDocumentMapper;

	/**
    * 新增
    */
	@Override
	public Response<String> insert(KbDocument kbDocument) {

		// valid
		if (kbDocument == null) {
			return Response.ofFail("必要参数缺失");
        }

		if (StringTool.isBlank(kbDocument.getDocName())) {
			return Response.ofFail("文档名称不能为空");
		}
		if (StringTool.isBlank(kbDocument.getDocType())) {
			return Response.ofFail("文档类型不能为空");
		}
		if (StringTool.isBlank(kbDocument.getFileUrl())
				&& StringTool.isBlank(kbDocument.getContent())) {
			return Response.ofFail("文档内容或文件不能为空");
		}

		// process
		kbDocument.setStatus(KbDucumentStatusEnum.INIT_UNPROCESSED.getValue());
		kbDocumentMapper.insert(kbDocument);
		return Response.ofSuccess();
	}

	/**
	* 删除
	*/
	@Override
	public Response<String> delete(List<Integer> ids) {
		int ret = kbDocumentMapper.delete(ids);
			return ret>0? Response.ofSuccess() : Response.ofFail() ;
	}

	/**
	* 更新
	*/
	@Override
	public Response<String> update(KbDocument kbDocument) {

		// valid
		if (kbDocument == null || kbDocument.getId()<1) {
			return Response.ofFail("必要参数缺失");
		}

		if (StringTool.isBlank(kbDocument.getDocName())) {
			return Response.ofFail("文档名称不能为空");
		}
		if (StringTool.isBlank(kbDocument.getDocType())) {
			return Response.ofFail("文档类型不能为空");
		}
		if (StringTool.isBlank(kbDocument.getFileUrl())
				&& StringTool.isBlank(kbDocument.getContent())) {
			return Response.ofFail("文档内容或文件不能为空");
		}

		// process
		kbDocument.setStatus(KbDucumentStatusEnum.CHANGED_UNPROCESSED.getValue());
		int ret = kbDocumentMapper.update(kbDocument);
		return ret>0? Response.ofSuccess() : Response.ofFail() ;
	}

	/**
	* Load查询
	*/
	@Override
	public Response<KbDocument> load(int id) {
		KbDocument record = kbDocumentMapper.load(id);
		return Response.ofSuccess(record);
	}

	/**
	* 分页查询
	*/
	@Override
	public PageModel<KbDocument> pageList(String docName, int offset, int pagesize) {

		List<KbDocument> pageList = kbDocumentMapper.pageList(docName, offset, pagesize);
		int totalCount = kbDocumentMapper.pageListCount(docName, offset, pagesize);

		// result
		PageModel<KbDocument> pageModel = new PageModel<KbDocument>();
		pageModel.setData(pageList);
		pageModel.setTotal(totalCount);

		return pageModel;
	}

}
