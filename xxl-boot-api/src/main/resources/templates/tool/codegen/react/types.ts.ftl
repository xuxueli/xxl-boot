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
  };
}