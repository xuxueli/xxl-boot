import { request } from '@/utils/request'
import type { Dict } from '@/types/api'
import type { PageModel, Response } from '@/types'

/**
 * 名称：字典类型 API
 * 能力：提供字典类型（字典）查询与维护接口。
 */

/**
 * 分页查询字典类型列表。
 * @param query 查询参数（name/code/status/offset/pagesize）。
 * @returns 字典类型分页列表。
 */
export function listType(query: object): Promise<Response<PageModel<Dict>>> {
  return request({
    url: '/system/dict/pageList',
    method: 'get',
    params: query
  })
}

/**
 * 查询单条字典类型详情。
 * @param id 字典ID。
 * @returns 字典类型详情。
 */
export function getType(id: number): Promise<Response<Dict>> {
  return request({
    url: '/system/dict/load',
    method: 'get',
    params: { id }
  })
}

/**
 * 新增字典类型。
 * @param data 字典类型数据。
 * @returns 新增结果。
 */
export function addType(data: Dict): Promise<Response<unknown>> {
  return request({
    url: '/system/dict/insert',
    method: 'post',
    data: data
  })
}

/**
 * 更新字典类型。
 * @param data 字典类型数据。
 * @returns 更新结果。
 */
export function updateType(data: Dict): Promise<Response<unknown>> {
  return request({
    url: '/system/dict/update',
    method: 'post',
    data: data
  })
}

/**
 * 删除字典类型。
 * @param id 字典ID或字典ID数组。
 * @returns 删除结果。
 */
export function delType(id: number | number[]): Promise<Response<unknown>> {
  return request({
    url: '/system/dict/delete',
    method: 'post',
    params: { 'ids[]': id }
  })
}

/** 字典下拉选项（queryDictList 返回结构） */
export interface DictSelectOption {
  dictId: number
  dictName: string
  dictType: string
}

/**
 * 查询全部字典（下拉选项）。
 * @returns 下拉选项列表（{dictId, dictName, dictType}）。
 */
export function queryDictList(): Promise<Response<DictSelectOption[]>> {
  return request<Dict[]>({
    url: '/system/dict/queryDictList',
    method: 'get'
  }).then(response => {
    // 后端 dict 字段（id/name/code）→ 前端通用结构（dictId/dictName/dictType）
    response.data = (response.data || []).map(item => ({
      dictId: item.id,
      dictName: item.name,
      dictType: item.type
    }))
    return response as unknown as Response<DictSelectOption[]>
  })
}
