/**
 * @fileoverview Log API
 * @description 审计日志接口，方法名与后端 LogController 对齐
 * @author xuxueli 2026-11-21
 */
import { request } from '@/utils/request';

/** 日志 API，调用方式：logApi.pageList(...) */
export const logApi = {
  /**
   * 分页查询日志
   *
   * @param query 页面查询条件（current/pageSize/type/module/title）
   * @returns 日志分页结果
   */
  pageList(query: API.LogQuery) {
    const { current = 1, pageSize = 10, ...search } = query;
    return request<API.Response<API.PageModel<API.Log>>>(
      '/system/log/pageList',
      {
        method: 'GET',
        params: {
          offset: (current - 1) * pageSize,
          pagesize: pageSize,
          ...search,
        },
      },
    );
  },

  /**
   * 删除日志（支持单条/批量）
   *
   * @param ids 日志主键或主键数组
   * @returns 删除结果
   */
  delete(ids: number | number[]) {
    return request<API.Response<unknown>>('/system/log/delete', {
      method: 'POST',
      data: Array.isArray(ids) ? ids : [ids],
    });
  },
};
