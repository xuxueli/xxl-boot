/**
 * @fileoverview Log API
 * @description 操作日志接口，方法名与后端 LogController 对齐
 * @author xuxueli 2026-11-21
 */
import { request } from '@/utils/request'
import type { Log, LogQuery } from '../types'
import type { PageModel, Response } from '@/types'

/** 日志 API，调用方式：logApi.pageList(...) */
export const logApi = {
  /**
   * 分页查询日志
   *
   * @param query 页面查询条件
   * @returns 日志分页结果
   */
  pageList(query: LogQuery): Promise<Response<PageModel<Log>>> {
    // 前端分页参数 pageNum/pageSize 转换为后端约定的 offset/pagesize
    const { pageNum, pageSize, ...search } = query
    return request({
      url: '/system/log/pageList',
      method: 'get',
      params: {
        offset: (pageNum - 1) * pageSize,
        pagesize: pageSize,
        ...search
      }
    })
  },

  /**
   * 删除日志（支持单条/批量）
   *
   * @param ids 日志主键或主键数组
   * @returns 删除结果
   */
  delete(ids: number | number[]): Promise<Response<unknown>> {
    return request({
      url: '/system/log/delete',
      method: 'post',
      data: Array.isArray(ids) ? ids : [ids]
    })
  }
}
