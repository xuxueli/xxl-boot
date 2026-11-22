/**
 * @fileoverview ${codegen.functionName} API
 * @description ${codegen.functionName}接口，方法名与后端 Controller 对齐
 * @author ${codegen.functionAuthor} ${.now?string('yyyy-MM-dd')}
 */
import { request } from '@/utils/request'
import type { ${codegen.businessName}, ${codegen.businessName}Form, ${codegen.businessName}Query } from '../types'
import type { PageModel, Response } from '@/types'

/** ${codegen.functionName} API，调用方式：${codegen.businessName?uncap_first}Api.pageList(...) */
export const ${codegen.businessName?uncap_first}Api = {
<#if codegen.tplCategory == "tree">
  /**
   * 查询${codegen.functionName}树形列表
   *
   * @param name 名称模糊搜索（可选）
   * @returns 树形结果
   */
  treeList(name?: string): Promise<Response<${codegen.businessName}[]>> {
    return request({
      url: '/${codegen.moduleName}/${codegen.businessName?uncap_first}/treeList',
      method: 'get',
      params: { name }
    })
  },

</#if>
  /**
   * 分页查询${codegen.functionName}
   *
   * 入参为页面查询对象（pageNum/pageSize + 筛选项），在此过滤前端分页字段，
   * 替换为后端约定的 offset/pagesize。
   *
   * @param query 页面查询条件
   * @returns 分页结果
   */
  pageList(query: ${codegen.businessName}Query): Promise<Response<PageModel<${codegen.businessName}>>> {
    const { pageNum, pageSize, ...search } = query
    return request({
      url: '/${codegen.moduleName}/${codegen.businessName?uncap_first}/pageList',
      method: 'get',
      params: {
        offset: (pageNum - 1) * pageSize,
        pagesize: pageSize,
        ...search
      }
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
      url: '/${codegen.moduleName}/${codegen.businessName?uncap_first}/load',
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
      url: '/${codegen.moduleName}/${codegen.businessName?uncap_first}/insert',
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
      url: '/${codegen.moduleName}/${codegen.businessName?uncap_first}/delete',
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
      url: '/${codegen.moduleName}/${codegen.businessName?uncap_first}/update',
      method: 'post',
      data
    })
  }
}
