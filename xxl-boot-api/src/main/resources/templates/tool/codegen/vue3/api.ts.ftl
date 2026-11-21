/**
 * @fileoverview ${codegen.functionName} API
 * @description ${codegen.functionName}接口，方法名与后端 Controller 对齐
 * @author ${codegen.functionAuthor} ${.now?string('yyyy-MM-dd')}
 */
import { request } from '@/utils/request'
import type { ${codegen.businessName}, ${codegen.businessName}Form, ${codegen.businessName}ListQuery } from '../types'
import type { PageModel, Response } from '@/types'

/** ${codegen.functionName} API，调用方式：${codegen.businessName?uncap_first}Api.pageList(...) */
export const ${codegen.businessName?uncap_first}Api = {
  /**
   * 分页查询${codegen.functionName}
   *
   * @param query 分页与查询条件（offset/pagesize 形态）
   * @returns 分页结果
   */
  pageList(query: ${codegen.businessName}ListQuery): Promise<Response<PageModel<${codegen.businessName}>>> {
    return request({
      url: '/${codegen.moduleName}/${codegen.businessName?lower_case}/pageList',
      method: 'get',
      params: query
    })
  },

  /**
   * 查询${codegen.functionName}详情
   *
   * @param id 主键
   * @returns 详情数据
   */
  load(id: number): Promise<Response<${codegen.businessName}>> {
    return request({
      url: '/${codegen.moduleName}/${codegen.businessName?lower_case}/load',
      method: 'get',
      params: { id }
    })
  },

  /**
   * 新增${codegen.functionName}
   *
   * @param data 表单数据
   * @returns 保存结果
   */
  insert(data: ${codegen.businessName}Form): Promise<Response<unknown>> {
    return request({
      url: '/${codegen.moduleName}/${codegen.businessName?lower_case}/insert',
      method: 'post',
      data
    })
  },

  /**
   * 删除${codegen.functionName}（支持单条/批量）
   *
   * @param ids 单个主键或主键数组
   * @returns 删除结果
   */
  delete(ids: number | number[]): Promise<Response<unknown>> {
    return request({
      url: '/${codegen.moduleName}/${codegen.businessName?lower_case}/delete',
      method: 'post',
      data: Array.isArray(ids) ? ids : [ids]
    })
  },

  /**
   * 更新${codegen.functionName}
   *
   * @param data 表单数据（含主键）
   * @returns 保存结果
   */
  update(data: ${codegen.businessName}Form): Promise<Response<unknown>> {
    return request({
      url: '/${codegen.moduleName}/${codegen.businessName?lower_case}/update',
      method: 'post',
      data
    })
  },

  /**
   * 导出${codegen.functionName}
   *
   * @param query 查询条件
   * @returns 导出结果
   */
  export(query: ${codegen.businessName}ListQuery): Promise<Response<unknown>> {
    return request({
      url: '/${codegen.moduleName}/${codegen.businessName?lower_case}/export',
      method: 'post',
      data: query
    })
  }
}
