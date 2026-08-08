<#function tsType javaType>
  <#local t = (javaType!"")?string />
  <#if t == "String"><#return "string" /></#if>
  <#if t == "Integer" || t == "int" || t == "Long" || t == "long" || t == "Short" || t == "Byte" || t == "Double" || t == "double" || t == "Float" || t == "BigDecimal" || t == "Character"><#return "number" /></#if>
  <#if t == "Boolean" || t == "boolean"><#return "boolean" /></#if>
  <#if t == "Date" || t == "LocalDate" || t == "LocalDateTime" || t == "LocalTime"><#return "string" /></#if>
  <#return "any" />
</#function>
/**
 * ${codegen.functionName} API
 * Created by ${codegen.functionAuthor} on '${.now?string('yyyy-MM-dd HH:mm:ss')}'.
 */
import { request } from '@/utils/request'
import type { PageModel, Response } from '@/types'

/** ${codegen.functionName}实体 */
export interface ${codegen.businessName} {
<#if fields?? && fields?size gt 0>
<#list fields as field>
  /** ${field.columnComment!field.javaField} */
  ${field.javaField}?: ${tsType(field.javaType)}
</#list>
</#if>
}

/** ${codegen.functionName}分页查询参数 */
export interface ${codegen.businessName}Query {
  pageNum?: number
  pageSize?: number
<#if fields?? && fields?size gt 0>
<#list fields as field>
<#if field.isQuery == "1">
  ${field.javaField}?: ${tsType(field.javaType)}
</#if>
</#list>
</#if>
}

<#assign hasIdField = false>
<#if fields?? && fields?size gt 0>
<#list fields as field>
<#if field.javaField == "id"><#assign hasIdField = true></#if>
</#list>
</#if>

/** ${codegen.functionName}表单（新增/修改入参） */
export interface ${codegen.businessName}Form {
<#if fields?? && fields?size gt 0>
<#list fields as field>
<#if field.isInsert == "1" || field.isEdit == "1">
  ${field.javaField}?: ${tsType(field.javaType)}
</#if>
</#list>
</#if>
<#if !hasIdField>
  id?: number
</#if>
}

// 查询${codegen.functionName}列表
export function list${codegen.businessName}(query: ${codegen.businessName}Query): Promise<Response<PageModel<${codegen.businessName}>>> {
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
export function export${codegen.businessName}(query: ${codegen.businessName}Query): Promise<Response<unknown>> {
  return request({
    url: '/${codegen.moduleName}/${codegen.businessName?lower_case}/export',
    method: 'get',
    params: query
  })
}
