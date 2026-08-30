import { request } from '@/utils/request'
import type { Log, LogListQuery } from '@/types/api'
import type { PageModel, Response } from '@/types'

/**
 * 名称：日志 API
 * 功能：提供日志查询、删除接口
 */

/**
 * 分页查询日志列表。
 * @param query 查询参数（type/module/title/offset/pagesize）。
 * @returns 日志分页列表。
 */
export function pageList(query: LogListQuery): Promise<Response<PageModel<Log>>> {
  return request({
    url: '/system/log/pageList',
    method: 'get',
    params: query
  })
}

/**
 * 删除日志。
 * @param ids 日志ID或日志ID数组。
 * @returns 删除结果。
 */
export function delOperlog(ids: number | number[]): Promise<Response<unknown>> {
  return request({
    url: '/system/log/delete',
    method: 'post',
    params: { ids: Array.isArray(ids) ? ids : [ids] }
  })
}
