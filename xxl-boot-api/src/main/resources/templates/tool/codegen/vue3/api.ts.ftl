/**
 * ${codegen.functionName} API
 * Created by ${codegen.functionAuthor} on '${.now?string('yyyy-MM-dd HH:mm:ss')}'.
 */
import { request } from '@/utils/request'
import type { ${codegen.businessName}, ${codegen.businessName}Form, ${codegen.businessName}ListQuery } from '@/types/${codegen.moduleName}/${codegen.businessName?lower_case}'
import type { PageModel, Response } from '@/types'

// 查询${codegen.functionName}列表
export function list${codegen.businessName}(query: ${codegen.businessName}ListQuery): Promise<Response<PageModel<${codegen.businessName}>>> {
  return request({
    url: '/${codegen.moduleName}/${codegen.businessName?lower_case}/pageList',
    method: 'get',
    params: query
  })
}

// 查询${codegen.functionName}详情
export function get${codegen.businessName}(id: number): Promise<Response<${codegen.businessName}>> {
  return request({
    url: '/${codegen.moduleName}/${codegen.businessName?lower_case}/load',
    method: 'get',
    params: { id }
  })
}

// 新增${codegen.functionName}
export function add${codegen.businessName}(data: ${codegen.businessName}Form): Promise<Response<unknown>> {
  return request({
    url: '/${codegen.moduleName}/${codegen.businessName?lower_case}/insert',
    method: 'post',
    data
  })
}

// 修改${codegen.functionName}
export function update${codegen.businessName}(data: ${codegen.businessName}Form): Promise<Response<unknown>> {
  return request({
    url: '/${codegen.moduleName}/${codegen.businessName?lower_case}/update',
    method: 'post',
    data
  })
}

// 删除${codegen.functionName}
export function del${codegen.businessName}(id: number | number[]): Promise<Response<unknown>> {
  return request({
    url: '/${codegen.moduleName}/${codegen.businessName?lower_case}/delete',
    method: 'post',
    params: { ids: id }
  })
}

// 导出${codegen.functionName}
export function export${codegen.businessName}(query: ${codegen.businessName}ListQuery): Promise<Response<unknown>> {
  return request({
    url: '/${codegen.moduleName}/${codegen.businessName?lower_case}/export',
    method: 'get',
    params: query
  })
}
