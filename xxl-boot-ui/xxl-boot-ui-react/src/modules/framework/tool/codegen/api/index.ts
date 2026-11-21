/**
 * @fileoverview Codegen API
 * @description 代码生成接口，方法名与后端 CodeGenController 对齐
 * @author xuxueli 2026-11-21
 */
import { request } from '@/utils/request';

/** 代码生成 API，调用方式：codegenApi.pageList(...) */
export const codegenApi = {
  /**
   * 分页查询生成表
   *
   * @param params 分页与查询条件（current/pageSize/tableName/tableComment）
   * @returns 生成表分页结果
   */
  pageList(params: API.CodegenQuery) {
    const { current = 1, pageSize = 10, ...rest } = params || {};
    // codegen 分页参数名固定为 pageSize，不对齐通用 pagesize
    return request<API.Response<API.PageModel<API.Codegen>>>(
      '/tool/codegen/pageList',
      {
        method: 'GET',
        params: {
          offset: (current - 1) * pageSize,
          pageSize,
          ...rest,
        },
      },
    );
  },

  /**
   * 查询生成表详情（含字段列表）
   *
   * @param id 生成表主键
   * @returns 生成表详情
   */
  detail(id: number) {
    return request<API.Response<API.Codegen>>('/tool/codegen/detail', {
      method: 'GET',
      params: { id },
    });
  },

  /**
   * 更新代码生成配置（含字段列表）
   *
   * @param data 生成表数据（含 fieldList）
   * @returns 保存结果
   */
  update(data: API.CodegenForm) {
    return request<API.Response<unknown>>('/tool/codegen/update', {
      method: 'POST',
      data,
    });
  },

  /**
   * 删除生成表数据（支持单条/批量）
   *
   * @param ids 生成表主键或主键数组
   * @returns 删除结果
   */
  delete(ids: number | number[]) {
    return request<API.Response<unknown>>('/tool/codegen/delete', {
      method: 'POST',
      data: Array.isArray(ids) ? ids : [ids],
    });
  },

  /**
   * 在数据库中创建表
   *
   * @param tableSql 建表 SQL
   * @param tplWebType 前端模板类型（antd-typescript / element-plus-typescript）
   * @returns 创建结果
   */
  createTable(tableSql: string, tplWebType: string) {
    return request<API.Response<unknown>>('/tool/codegen/createTable', {
      method: 'POST',
      data: { tableSql, tplWebType },
    });
  },

  /**
   * 预览生成代码
   *
   * @param id 生成表主键
   * @returns 文件名与代码内容的映射
   */
  preview(id: number) {
    return request<API.Response<Record<string, string>>>(
      '/tool/codegen/preview',
      {
        method: 'GET',
        params: { id },
      },
    );
  },
};
