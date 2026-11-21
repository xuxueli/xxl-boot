<#function tsType javaType>
  <#local t = (javaType!"")?string />
  <#if t == "String"><#return "string" /></#if>
  <#if t == "Integer" || t == "int" || t == "Long" || t == "long" || t == "Short" || t == "Byte" || t == "Double" || t == "double" || t == "Float" || t == "BigDecimal" || t == "Character"><#return "number" /></#if>
  <#if t == "Boolean" || t == "boolean"><#return "boolean" /></#if>
  <#if t == "Date" || t == "LocalDate" || t == "LocalDateTime" || t == "LocalTime"><#return "string" /></#if>
  <#return "any" />
</#function>
/**
 * @fileoverview ${codegen.functionName} API
 * @description ${codegen.functionName}接口，方法名与后端 ${codegen.businessName}Controller 对齐
 * @author ${codegen.functionAuthor} ${.now?string('yyyy-MM-dd')}
 * 放置路径：src/modules/business/${codegen.moduleName}/${codegen.businessName?lower_case}/api/index.ts
 */
import { request } from '@/utils/request';

/** ${codegen.functionName} API，调用方式：${codegen.businessName?uncap_first}Api.pageList(...) */
export const ${codegen.businessName?uncap_first}Api = {
  /**
   * 分页查询${codegen.functionName}
   *
   * @param params 分页与查询条件（current/pageSize<#if fields?? && fields?size gt 0><#list fields as field><#if field.isQuery == "1">/${field.javaField}</#if></#list></#if>）
   * @returns ${codegen.functionName}分页结果
   */
  pageList(params: {
    current?: number;
    pageSize?: number;
<#if fields?? && fields?size gt 0>
<#list fields as field>
<#if field.isQuery == "1">
    /** ${field.columnComment!field.javaField} */
    ${field.javaField}?: ${tsType(field.javaType)};
</#if>
</#list>
</#if>
  }) {
    const { current = 1, pageSize = 10, ...rest } = params || {};
    return request<API.Response<API.PageModel<API.${codegen.businessName}>>>(
      '/${codegen.moduleName}/${codegen.businessName?uncap_first}/pageList',
      {
        method: 'GET',
        params: {
          offset: (current - 1) * pageSize,
          pagesize: pageSize,
          ...rest,
        },
      },
    );
  },

  /**
   * 查询${codegen.functionName}详情
   *
   * @param id 主键
   * @returns 详情数据
   */
  load(id: number) {
    return request<API.Response<API.${codegen.businessName}>>(
      '/${codegen.moduleName}/${codegen.businessName?uncap_first}/load',
      { method: 'GET', params: { id } },
    );
  },

  /**
   * 新增${codegen.functionName}
   *
   * @param data 表单数据
   * @returns 保存结果
   */
  insert(data: API.${codegen.businessName}) {
    return request<API.Response<unknown>>(
      '/${codegen.moduleName}/${codegen.businessName?uncap_first}/insert',
      { method: 'POST', data },
    );
  },

  /**
   * 删除${codegen.functionName}（支持单条/批量）
   *
   * @param ids 主键或主键数组
   * @returns 删除结果
   */
  delete(ids: number | number[]) {
    return request<API.Response<unknown>>(
      '/${codegen.moduleName}/${codegen.businessName?uncap_first}/delete',
      { method: 'POST', data: Array.isArray(ids) ? ids : [ids] },
    );
  },

  /**
   * 更新${codegen.functionName}
   *
   * @param data 表单数据（含主键）
   * @returns 保存结果
   */
  update(data: API.${codegen.businessName}) {
    return request<API.Response<unknown>>(
      '/${codegen.moduleName}/${codegen.businessName?uncap_first}/update',
      { method: 'POST', data },
    );
  },
};
