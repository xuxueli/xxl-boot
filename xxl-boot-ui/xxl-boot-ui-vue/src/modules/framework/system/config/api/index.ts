/**
 * @fileoverview Config API
 * @description 系统配置接口，方法名与后端 ConfigController 对齐
 * @author xuxueli 2026-11-21
 */
import { request } from '@/utils/request'
import type { Config, ConfigForm, ConfigListQuery } from '../types'
import type { PageModel, Response } from '@/types'

/** 系统配置 API，调用方式：configApi.pageList(...) */
export const configApi = {
  /**
   * 分页查询配置
   *
   * @param query 分页与查询条件（offset/pagesize 形态）
   * @returns 配置分页结果
   */
  pageList(query: ConfigListQuery): Promise<Response<PageModel<Config>>> {
    return request({
      url: '/system/config/pageList',
      method: 'get',
      params: query
    })
  },

  /**
   * 查询配置详情
   *
   * @param id 配置主键
   * @returns 配置详情
   */
  load(id: number): Promise<Response<Config>> {
    return request({
      url: '/system/config/load',
      method: 'get',
      params: { id }
    })
  },

  /**
   * 按 Key 查询配置
   *
   * 平台能力接口：供其他模块按 Key 读取配置，列表页本身不使用。
   *
   * @param key 配置 Key
   * @returns 配置详情
   */
  loadByKey(key: string): Promise<Response<Config>> {
    return request({
      url: '/system/config/loadByKey',
      method: 'get',
      params: { key }
    })
  },

  /**
   * 新增配置
   *
   * @param data 表单数据
   * @returns 保存结果
   */
  insert(data: ConfigForm): Promise<Response<unknown>> {
    return request({
      url: '/system/config/insert',
      method: 'post',
      data
    })
  },

  /**
   * 删除配置（支持单条/批量）
   *
   * @param ids 单个主键或主键数组
   * @returns 删除结果
   */
  delete(ids: number | number[]): Promise<Response<unknown>> {
    return request({
      url: '/system/config/delete',
      method: 'post',
      data: Array.isArray(ids) ? ids : [ids]
    })
  },

  /**
   * 更新配置
   *
   * @param data 表单数据（含主键）
   * @returns 保存结果
   */
  update(data: ConfigForm): Promise<Response<unknown>> {
    return request({
      url: '/system/config/update',
      method: 'post',
      data
    })
  }
}
