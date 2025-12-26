package com.xxl.boot.admin.plugin.ai.service.impl;

import com.xxl.boot.admin.plugin.ai.constant.enums.ModelTypeEnum;
import com.xxl.boot.admin.plugin.ai.constant.enums.SupplierTypeEnum;
import com.xxl.boot.admin.plugin.ai.mapper.ModelMapper;
import com.xxl.boot.admin.plugin.ai.model.Model;
import com.xxl.boot.admin.plugin.ai.service.ModelService;
import com.xxl.tool.core.StringTool;
import org.springframework.stereotype.Service;

import jakarta.annotation.Resource;

import java.util.List;

import com.xxl.tool.response.Response;
import com.xxl.tool.response.PageModel;

/**
* Model Service Impl
*
* Created by xuxueli on '2025-12-21 16:13:29'.
*/
@Service
public class ModelServiceImpl implements ModelService {

	@Resource
	private ModelMapper modelMapper;

	/**
    * 新增
    */
	@Override
	public Response<String> insert(Model model) {

		// valid base
		if (model == null) {
			return Response.ofFail("必要参数缺失");
        }
		if (StringTool.isBlank(model.getName())) {
			return Response.ofFail("Model名称 不能为空");
		}
		ModelTypeEnum modelTypeEnum = ModelTypeEnum.getByValue(model.getModelType(), null);
		if (modelTypeEnum == null) {
			return Response.ofFail("Model类型 非法");
		}
		SupplierTypeEnum supplierTypeEnum = SupplierTypeEnum.getByValue(model.getSupplierType(), null);
		if (supplierTypeEnum == null) {
			return Response.ofFail("供应商类型 非法");
		}

		// valid: ModelType (Chat) + Supplier (Ollama)
		if (ModelTypeEnum.CHAT == modelTypeEnum && SupplierTypeEnum.OLLAMA == supplierTypeEnum) {
			if (StringTool.isBlank(model.getModel())) {
				return Response.ofFail("模型 不能为空");
			}
			if (StringTool.isBlank(model.getBaseUrl())) {
				return Response.ofFail("Base URL 不能为空");
			}
		}

		modelMapper.insert(model);
		return Response.ofSuccess();
	}

	/**
	* 删除
	*/
	@Override
	public Response<String> delete(List<Integer> ids) {
		int ret = modelMapper.delete(ids);
			return ret>0? Response.ofSuccess() : Response.ofFail() ;
	}

	/**
	* 更新
	*/
	@Override
	public Response<String> update(Model model) {

		// valid base
		if (model == null) {
			return Response.ofFail("必要参数缺失");
		}
		if (StringTool.isBlank(model.getName())) {
			return Response.ofFail("Model名称 不能为空");
		}
		ModelTypeEnum modelTypeEnum = ModelTypeEnum.getByValue(model.getModelType(), null);
		if (modelTypeEnum == null) {
			return Response.ofFail("Model类型 非法");
		}
		SupplierTypeEnum supplierTypeEnum = SupplierTypeEnum.getByValue(model.getSupplierType(), null);
		if (supplierTypeEnum == null) {
			return Response.ofFail("供应商类型 非法");
		}

		// valid: ModelType (Chat) + Supplier (Ollama)
		if (ModelTypeEnum.CHAT == modelTypeEnum && SupplierTypeEnum.OLLAMA == supplierTypeEnum) {
			if (StringTool.isBlank(model.getModel())) {
				return Response.ofFail("模型 不能为空");
			}
			if (StringTool.isBlank(model.getBaseUrl())) {
				return Response.ofFail("Base URL 不能为空");
			}
		}

		int ret = modelMapper.update(model);
		return ret>0? Response.ofSuccess() : Response.ofFail() ;
	}

	/**
	* Load查询
	*/
	@Override
	public Response<Model> load(int id) {
		Model record = modelMapper.load(id);
		return Response.ofSuccess(record);
	}

	/**
	* 分页查询
	*/
	@Override
	public PageModel<Model> pageList(int offset, int pagesize, int modelType, String name) {

		List<Model> pageList = modelMapper.pageList(offset, pagesize, modelType, name);
		int totalCount = modelMapper.pageListCount(offset, pagesize, modelType, name);

		// result
		PageModel<Model> pageModel = new PageModel<Model>();
		pageModel.setData(pageList);
		pageModel.setTotal(totalCount);

		return pageModel;
	}

	@Override
	public List<Model> queryAllModel() {
		return modelMapper.queryAllModel();
	}

}
