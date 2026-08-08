import { request } from '@/utils/request'
import type { Config, ConfigListQuery } from '@/types/api'
import type { PageModel, Response } from '@/types'

/**
 * 名称：系统配置 API
 * 能力：提供系统配置查询、维护接口。
 */

/**
 * 分页查询配置列表。
 * @param query 查询参数（name/key/status/offset/pagesize）。
 * @returns 配置分页列表。
 */
export function listConfig(query: ConfigListQuery): Promise<Response<PageModel<Config>>> {
  return request({
    url: '/system/config/pageList',
    method: 'get',
    params: query
  })
}

/**
 * 查询单条配置详情。
 * @param id 配置ID。
 * @returns 配置详情。
 */
export function getConfig(id: number): Promise<Response<Config>> {
  return request({
    url: '/system/config/load',
    method: 'get',
    params: { id }
  })
}

/**
 * 按配置Key查询配置。
 * @param key 配置Key。
 * @returns 配置详情。
 */
export function getConfigKey(key: string): Promise<Response<Config>> {
  return request({
    url: '/system/config/loadByKey',
    method: 'get',
    params: { key }
  })
}

/**
 * 新增配置。
 * @param data 配置数据。
 * @returns 新增结果。
 */
export function addConfig(data: Config): Promise<Response<unknown>> {
  return request({
    url: '/system/config/insert',
    method: 'post',
    data: data
  })
}

/**
 * 更新配置。
 * @param data 配置数据。
 * @returns 更新结果。
 */
export function updateConfig(data: Config): Promise<Response<unknown>> {
  return request({
    url: '/system/config/update',
    method: 'post',
    data: data
  })
}

/**
 * 删除配置。
 * @param id 配置ID或配置ID数组。
 * @returns 删除结果。
 */
export function delConfig(id: number | number[]): Promise<Response<unknown>> {
  return request({
    url: '/system/config/delete',
    method: 'post',
    params: { 'ids[]': id }
  })
}
