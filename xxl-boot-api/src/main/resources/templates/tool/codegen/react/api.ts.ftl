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
 * 放置路径：src/modules/business/${codegen.moduleName}/${codegen.businessName?lower_case}/api/index.ts
 */
import { request } from '@/utils/request';

/**
 * 分页查询${codegen.functionName}列表。
 * @param params 查询参数（current/pageSize/查询字段）
 */
export async function list${codegen.businessName}(params: {
  current?: number;
  pageSize?: number;
<#if fields?? && fields?size gt 0>
<#list fields as field>
<#if field.isQuery == "1">
  ${field.javaField}?: ${tsType(field.javaType)};
</#if>
</#list>
</#if>
}) {
  const { current = 1, pageSize = 10, ...rest } = params || {};
  return request<API.Response<API.PageModel<API.${codegen.businessName}>>>(
    '/${codegen.moduleName}/${codegen.businessName?lower_case}/pageList',
    {
      method: 'GET',
      params: {
        offset: (current - 1) * pageSize,
        pagesize: pageSize,
        ...rest,
      },
    },
  );
}

/**
 * 加载${codegen.functionName}详情。
 * @param id 记录 ID
 */
export async function get${codegen.businessName}(id: number) {
  return request<API.Response<API.${codegen.businessName}>>(
    '/${codegen.moduleName}/${codegen.businessName?lower_case}/load',
    { method: 'GET', params: { id } },
  );
}

/**
 * 新增${codegen.functionName}。
 * @param data 表单数据
 */
export async function add${codegen.businessName}(data: API.${codegen.businessName}) {
  return request<API.Response<unknown>>(
    '/${codegen.moduleName}/${codegen.businessName?lower_case}/insert',
    { method: 'POST', data },
  );
}

/**
 * 修改${codegen.functionName}。
 * @param data 表单数据
 */
export async function update${codegen.businessName}(data: API.${codegen.businessName}) {
  return request<API.Response<unknown>>(
    '/${codegen.moduleName}/${codegen.businessName?lower_case}/update',
    { method: 'POST', data },
  );
}

/**
 * 删除${codegen.functionName}。
 * @param ids 记录 ID 数组
 */
export async function del${codegen.businessName}(ids: number[]) {
  return request<API.Response<unknown>>(
    '/${codegen.moduleName}/${codegen.businessName?lower_case}/delete',
    { method: 'POST', params: { ids } },
  );
}