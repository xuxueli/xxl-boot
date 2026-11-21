/**
 * @fileoverview Org API
 * @description 组织管理接口，方法名与后端 OrgController 对齐
 * @author xuxueli 2026-11-21
 */
import { request } from '@/utils/request'
import type { Org, OrgQuery } from '../types'
import type { Response } from '@/types'

/** 组织 API，调用方式：orgApi.treeList(...) */
export const orgApi = {
  /**
   * 查询组织树列表（扁平数组，前端需 handleTree 组装）
   *
   * @param query 查询参数（name/status，status 默认 -1 全部）
   * @returns 组织列表
   */
  treeList(query: OrgQuery): Promise<Response<Org[]>> {
    return request({
      url: '/authz/org/treeList',
      method: 'get',
      params: query
    })
  },

  /**
   * 查询组织详情
   *
   * @param id 组织主键
   * @returns 组织详情
   */
  load(id: number): Promise<Response<Org>> {
    return request({
      url: '/authz/org/load',
      method: 'get',
      params: { id }
    })
  },

  /**
   * 新增组织
   *
   * @param data 组织数据
   * @returns 保存结果
   */
  insert(data: Org): Promise<Response<unknown>> {
    return request({
      url: '/authz/org/insert',
      method: 'post',
      data
    })
  },

  /**
   * 删除组织（支持单条/批量）
   *
   * @param ids 组织主键或主键数组
   * @returns 删除结果
   */
  delete(ids: number | number[]): Promise<Response<unknown>> {
    return request({
      url: '/authz/org/delete',
      method: 'post',
      data: Array.isArray(ids) ? ids : [ids]
    })
  },

  /**
   * 更新组织
   *
   * @param data 组织数据
   * @returns 保存结果
   */
  update(data: Org): Promise<Response<unknown>> {
    return request({
      url: '/authz/org/update',
      method: 'post',
      data
    })
  },

  /**
   * 保存组织排序
   *
   * @param data 排序数据（ids 与 orders 一一对应）
   * @returns 保存结果
   */
  updateSort(data: { ids: number[]; orders: number[] }): Promise<Response<unknown>> {
    return request({
      url: '/authz/org/updateSort',
      method: 'post',
      data: { ids: data.ids, orders: data.orders }
    })
  }
}
