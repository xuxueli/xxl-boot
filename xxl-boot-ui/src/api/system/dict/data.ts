import { request } from '@/utils/request'
import type { DictItem } from '@/types/api'
import type { EnumOption, PageModel, Response } from '@/types'

/**
 * 名称：字典数据 API
 * 能力：提供字典项查询、维护、按字典标识查询与枚举查询接口。
 */

/**
 * 分页查询字典项列表。
 * @param query 查询参数（dictId/offset/pagesize）。
 * @returns 字典项分页列表。
 */
export function listData(query: object): Promise<Response<PageModel<DictItem>>> {
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
    params: { 'ids[]': id }
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
