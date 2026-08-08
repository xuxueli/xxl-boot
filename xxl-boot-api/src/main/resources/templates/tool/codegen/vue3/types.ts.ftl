<#function tsType javaType>
  <#local t = (javaType!"")?string />
  <#if t == "String"><#return "string" /></#if>
  <#if t == "Integer" || t == "int" || t == "Long" || t == "long" || t == "Short" || t == "Byte" || t == "Double" || t == "double" || t == "Float" || t == "BigDecimal" || t == "Character"><#return "number" /></#if>
  <#if t == "Boolean" || t == "boolean"><#return "boolean" /></#if>
  <#if t == "Date" || t == "LocalDate" || t == "LocalDateTime" || t == "LocalTime"><#return "string" /></#if>
  <#return "any" />
</#function>
/**
 * ${codegen.functionName} 类型定义
 * Created by ${codegen.functionAuthor} on '${.now?string('yyyy-MM-dd HH:mm:ss')}'.
 */
import type { ListQuery } from '@/types'

/** ${codegen.functionName}实体 */
export interface ${codegen.businessName} {
<#if fields?? && fields?size gt 0>
<#list fields as field>
  /** ${field.columnComment!field.javaField} */
  ${field.javaField}?: ${tsType(field.javaType)}
</#list>
</#if>
}

/** ${codegen.functionName}分页查询参数（搜索栏表单形态） */
export interface ${codegen.businessName}Query {
  pageNum: number
  pageSize: number
<#if fields?? && fields?size gt 0>
<#list fields as field>
<#if field.isQuery == "1">
  /** ${field.columnComment!field.javaField} */
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
  /** ${field.columnComment!field.javaField} */
  ${field.javaField}?: ${tsType(field.javaType)}
</#if>
</#list>
</#if>
<#if !hasIdField>
  /** 编号 */
  id?: number
</#if>
}

/** ${codegen.functionName}列表请求参数（请求形态：offset/pagesize，供 api 使用） */
export type ${codegen.businessName}ListQuery = ListQuery<${codegen.businessName}Query>
