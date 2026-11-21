/**
 * @fileoverview Resource API
 * @description 资源管理接口，方法名与后端 ResourceController 对齐
 * @author xuxueli 2026-11-21
 */
import { request } from '@/utils/request'
import type { Resource, ResourceQuery } from '../types'
import type { Response } from '@/types'

/** 资源 API，调用方式：resourceApi.treeList(...) */
export const resourceApi = {
  /**
   * 查询资源树列表（扁平数据，由前端转树）
   *
   * @param query 查询参数（name/status）
   * @returns 资源列表
   */
  treeList(query: ResourceQuery): Promise<Response<Resource[]>> {
    return request({
      url: '/authz/resource/treeList',
      method: 'get',
      params: query
    })
  },

  /**
   * 查询资源详情
   *
   * @param id 资源主键
   * @returns 资源详情
   */
  load(id: number): Promise<Response<Resource>> {
    return request({
      url: '/authz/resource/load',
      method: 'get',
      params: { id }
    })
  },

  /**
   * 新增资源
   *
   * @param data 资源数据
   * @returns 保存结果
   */
  insert(data: Resource): Promise<Response<unknown>> {
    return request({
      url: '/authz/resource/insert',
      method: 'post',
      data
    })
  },

  /**
   * 删除资源（支持单条/批量）
   *
   * @param ids 资源主键或主键数组
   * @returns 删除结果
   */
  delete(ids: number | number[]): Promise<Response<unknown>> {
    return request({
      url: '/authz/resource/delete',
      method: 'post',
      data: Array.isArray(ids) ? ids : [ids]
    })
  },

  /**
   * 更新资源
   *
   * @param data 资源数据
   * @returns 保存结果
   */
  update(data: Resource): Promise<Response<unknown>> {
    return request({
      url: '/authz/resource/update',
      method: 'post',
      data
    })
  },

  /**
   * 批量更新资源排序
   *
   * @param ids 资源主键列表
   * @param orders 排序值列表（与 ids 一一对应）
   * @returns 保存结果
   */
  updateSort(ids: number[], orders: number[]): Promise<Response<unknown>> {
    return request({
      url: '/authz/resource/updateSort',
      method: 'post',
      data: { ids, orders }
    })
  }
}
