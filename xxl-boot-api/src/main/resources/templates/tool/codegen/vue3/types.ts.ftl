<#function tsType javaType>
  <#local t = (javaType!"")?string />
  <#if t == "String"><#return "string" /></#if>
  <#if t == "Integer" || t == "int" || t == "Long" || t == "long" || t == "Short" || t == "Byte" || t == "Double" || t == "double" || t == "Float" || t == "BigDecimal" || t == "Character"><#return "number" /></#if>
  <#if t == "Boolean" || t == "boolean"><#return "boolean" /></#if>
  <#if t == "Date" || t == "LocalDate" || t == "LocalDateTime" || t == "LocalTime"><#return "string" /></#if>
  <#return "any" />
</#function>
/**
 * @fileoverview ${codegen.functionName} 类型定义
 * @description 实体、查询与表单类型，对应后端 ${codegen.businessName}.java
 * @author ${codegen.functionAuthor} ${.now?string('yyyy-MM-dd')}
 */

/** ${codegen.functionName}实体 */
export interface ${codegen.businessName} {
<#if fields?? && fields?size gt 0>
<#list fields as field>
  /** ${field.columnComment!field.javaField} */
  ${field.javaField}?: ${tsType(field.javaType)}
</#list>
</#if>
}

/** ${codegen.functionName}搜索栏查询参数（含分页，前端表单形态） */
export interface ${codegen.businessName}Query {
  /** 当前页码 */
  pageNum: number
  /** 每页条数 */
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

/** ${codegen.functionName}新增/修改表单：复用实体的可编辑字段 */
export type ${codegen.businessName}Form = Pick<
  ${codegen.businessName},
  | 'id'
<#if fields?? && fields?size gt 0>
<#list fields as field>
<#if (field.isInsert == "1" || field.isEdit == "1") && field.javaField != "id">
  | '${field.javaField}'
</#if>
</#list>
</#if>
>
