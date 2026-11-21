/**
 * @fileoverview Log API
 * @description 操作日志接口，方法名与后端 LogController 对齐
 * @author xuxueli 2026-11-21
 */
import { request } from '@/utils/request'
import type { Log, LogListQuery } from '../types'
import type { PageModel, Response } from '@/types'

/** 日志 API，调用方式：logApi.pageList(...) */
export const logApi = {
  /**
   * 分页查询日志
   *
   * @param query 分页与查询条件（offset/pagesize 形态）
   * @returns 日志分页结果
   */
  pageList(query: LogListQuery): Promise<Response<PageModel<Log>>> {
    return request({
      url: '/system/log/pageList',
      method: 'get',
      params: query
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
