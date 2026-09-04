import { request } from '@/utils/request'
import type { CodegenField, CodegenTable } from '../types'
import type { PageModel, Response } from '@/types'

/**
 * 名称：代码生成 API
 * 能力：提供生成表查询、导入创建、预览生成、同步与删除等接口。
 */

/**
 * 查询生成表列表。
 * @param query 查询参数。
 * @returns 生成表列表。
 */
export function listTable(query: object): Promise<Response<PageModel<CodegenTable>>> {
  return request({
    url: '/tool/codegen/pageList',
    method: 'get',
    params: query
  })
}

/**
 * 查询生成表详情。
 * @param tableId 表 ID。
 * @returns 表详细信息。
 */
export function getGenTable(tableId: number): Promise<Response<CodegenTable>> {
  return request({
    url: '/tool/codegen/detail',
    method: 'get',
    params: { id: tableId }
  })
}

/**
 * 修改代码生成信息。
 * @param data 生成配置数据。
 * @returns 修改结果。
 */
export function updateGenTable(data: CodegenTable): Promise<Response<unknown>> {
  return request({
    url: '/tool/codegen/update',
    method: 'post',
    data: data
  })
}

/**
 * 在数据库中创建表。
 * @param data 建表参数。
 * @returns 创建结果。
 */
export function createTable(data: object): Promise<Response<unknown>> {
  return request({
    url: '/tool/codegen/createTable',
    method: 'post',
    params: data
  })
}

/**
 * 预览生成代码。
 * @param tableId 表 ID。
 * @returns 预览结果。
 */
export function previewTable(tableId: number): Promise<Response<Record<string, string>>> {
  return request({
    url: '/tool/codegen/preview',
    method: 'get',
    params: { id: tableId }
  })
}

/**
 * 删除生成表数据。
 * @param tableId 表 ID。
 * @returns 删除结果。
 */
export function delTable(tableId: number | number[]): Promise<Response<unknown>> {
  return request({
    url: '/tool/codegen/delete',
    method: 'post',
    params: { ids: tableId }
  })
}
