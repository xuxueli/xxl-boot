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
 * @description 实体、查询、表单与列表查询类型
 * @author ${codegen.functionAuthor} ${.now?string('yyyy-MM-dd')}
 * 放置路径：src/modules/business/${codegen.moduleName}/${codegen.businessName?lower_case}/types/index.d.ts
 */
declare namespace API {
  /** ${codegen.functionName}实体 */
  type ${codegen.businessName} = {
    /** 编号 */
    id?: number;
<#if fields?? && fields?size gt 0>
<#list fields as field>
<#if field.javaField != "id" && field.javaField != "addTime" && field.javaField != "updateTime">
    /** ${field.columnComment!field.javaField} */
    ${field.javaField}?: ${tsType(field.javaType)};
</#if>
</#list>
</#if>
<#if codegen.tplCategory == "tree">
    /** 子节点（树形结构） */
    children?: API.${codegen.businessName}[];
</#if>
  };
}