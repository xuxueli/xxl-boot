import { request } from '@/utils/request'
import type { Dict, DictItem, DataListQuery, DictListQuery } from '../types'
import type { EnumOption, PageModel, Response } from '@/types'

/**
 * 名称：字典 API
 * 能力：提供字典类型、字典项查询维护与字典/枚举查询接口。
 */

/* ---------------------- 字典项（数据） ---------------------- */

/**
 * 分页查询字典项列表。
 * @param query 查询参数（dictId/offset/pagesize）。
 * @returns 字典项分页列表。
 */
export function listData(query: DataListQuery): Promise<Response<PageModel<DictItem>>> {
  return request({
    url: '/system/dict/itemPageList',
    method: 'get',
    params: query
  })
}

/**
 * 查询单条字典项详情。
 * @param id 字典项ID。
 * @returns 字典项详情。
 */
export function getData(id: number): Promise<Response<DictItem>> {
  return request({
    url: '/system/dict/itemLoad',
    method: 'get',
    params: { id }
  })
}

/**
 * 按字典标识查询字典项列表（供下拉选项、回显使用）。
 * @param type 字典标识。
 * @returns 字典项列表。
 */
export function loadDictItem(type: string): Promise<Response<DictItem[]>> {
  return request({
    url: '/system/dict/loadDictItem',
    method: 'get',
    params: { type }
  })
}

/**
 * 新增字典项。
 * @param data 字典项数据。
 * @returns 新增结果。
 */
export function addData(data: DictItem): Promise<Response<unknown>> {
  return request({
    url: '/system/dict/itemInsert',
    method: 'post',
    data: data
  })
}

/**
 * 更新字典项。
 * @param data 字典项数据。
 * @returns 更新结果。
 */
export function updateData(data: DictItem): Promise<Response<unknown>> {
  return request({
    url: '/system/dict/itemUpdate',
    method: 'post',
    data: data
  })
}

/**
 * 删除字典项。
 * @param id 字典项ID或字典项ID数组。
 * @returns 删除结果。
 */
export function delData(id: number | number[]): Promise<Response<unknown>> {
  return request({
    url: '/system/dict/itemDelete',
    method: 'post',
    params: { ids: Array.isArray(id) ? id : [id] }
  })
}

/* ---------------------- 字典类型 ---------------------- */

/**
 * 分页查询字典类型列表。
 * @param query 查询参数（name/code/status/offset/pagesize）。
 * @returns 字典类型分页列表。
 */
export function listType(query: DictListQuery): Promise<Response<PageModel<Dict>>> {
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
    params: { ids: Array.isArray(id) ? id : [id] }
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
  }).then((response) => {
    // 后端 dict 字段（id/name/code）→ 前端通用结构（dictId/dictName/dictType）
    response.data = (response.data || []).map((item) => ({
      dictId: item.id,
      dictName: item.name,
      dictType: item.type
    }))
    return response as unknown as Response<DictSelectOption[]>
  })
}

/* ---------------------- 字典、枚举 查询 ---------------------- */

/**
 * 查询枚举列表。
 * @param enumName 枚举类名。
 * @returns 枚举项列表（{ code, title }）。
 */
export function loadEnumItem(enumName: string): Promise<Response<EnumOption[]>> {
  return request({
    url: '/system/dict/loadEnumItem',
    method: 'get',
    params: { enumName }
  })
}