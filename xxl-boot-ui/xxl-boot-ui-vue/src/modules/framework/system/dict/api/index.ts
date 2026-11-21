/**
 * @fileoverview Dict API
 * @description 字典类型与字典项接口，方法名与后端 DictController 对齐
 * @author xuxueli 2026-11-21
 */
import { request } from '@/utils/request'
import type { Dict, DictItem, DictForm, DictItemForm, DictSelectOption, DictItemQuery, DictQuery } from '../types'
import type { EnumOption, PageModel, Response } from '@/types'

/** 字典 API，调用方式：dictApi.pageList(...) */
export const dictApi = {
  /**
   * 分页查询字典类型
   *
   * @param query 页面查询条件
   * @returns 字典类型分页结果
   */
  pageList(query: DictQuery): Promise<Response<PageModel<Dict>>> {
    // 前端分页参数 pageNum/pageSize 转换为后端约定的 offset/pagesize
    const { pageNum, pageSize, ...search } = query
    return request({
      url: '/system/dict/pageList',
      method: 'get',
      params: {
        offset: (pageNum - 1) * pageSize,
        pagesize: pageSize,
        ...search
      }
    })
  },

  /**
   * 查询字典类型详情
   *
   * @param id 字典主键
   * @returns 字典类型详情
   */
  load(id: number): Promise<Response<Dict>> {
    return request({
      url: '/system/dict/load',
      method: 'get',
      params: { id }
    })
  },

  /**
   * 分页查询字典项
   *
   * @param query 页面查询条件（dictId + pageNum/pageSize）
   * @returns 字典项分页结果
   */
  itemPageList(query: DictItemQuery): Promise<Response<PageModel<DictItem>>> {
    const { pageNum, pageSize, ...search } = query
    return request({
      url: '/system/dict/itemPageList',
      method: 'get',
      params: {
        offset: (pageNum - 1) * pageSize,
        pagesize: pageSize,
        ...search
      }
    })
  },

  /**
   * 查询字典项详情
   *
   * @param id 字典项主键
   * @returns 字典项详情
   */
  itemLoad(id: number): Promise<Response<DictItem>> {
    return request({
      url: '/system/dict/itemLoad',
      method: 'get',
      params: { id }
    })
  },

  /**
   * 查询全部字典（下拉选项）
   *
   * @returns 下拉选项列表
   */
  queryDictList(): Promise<Response<DictSelectOption[]>> {
    return request<Dict[]>({
      url: '/system/dict/queryDictList',
      method: 'get'
    }).then((response) => ({
      ...response,
      // 后端字段（id/name/type）转换为前端通用结构（dictId/dictName/dictType）
      data: (response.data ?? []).map((item) => ({
        dictId: item.id,
        dictName: item.name,
        dictType: item.type
      }))
    }))
  },

  /**
   * 按字典标识查询字典项列表
   *
   * @param type 字典标识
   * @returns 字典项列表
   */
  loadDictItem(type: string): Promise<Response<DictItem[]>> {
    return request({
      url: '/system/dict/loadDictItem',
      method: 'get',
      params: { type }
    })
  },

  /**
   * 查询枚举列表
   *
   * @param enumName 枚举类名
   * @returns 枚举项列表（code/title）
   */
  loadEnum(enumName: string): Promise<Response<EnumOption[]>> {
    return request({
      url: '/system/dict/loadEnumItem',
      method: 'get',
      params: { enumName }
    })
  },

  /**
   * 新增字典类型
   *
   * @param data 表单数据
   * @returns 保存结果
   */
  insert(data: DictForm): Promise<Response<unknown>> {
    return request({
      url: '/system/dict/insert',
      method: 'post',
      data
    })
  },

  /**
   * 删除字典类型（支持单条/批量）
   *
   * @param ids 单个主键或主键数组
   * @returns 删除结果
   */
  delete(ids: number | number[]): Promise<Response<unknown>> {
    return request({
      url: '/system/dict/delete',
      method: 'post',
      data: Array.isArray(ids) ? ids : [ids]
    })
  },

  /**
   * 更新字典类型
   *
   * @param data 表单数据（含主键）
   * @returns 保存结果
   */
  update(data: DictForm): Promise<Response<unknown>> {
    return request({
      url: '/system/dict/update',
      method: 'post',
      data
    })
  },

  /**
   * 新增字典项
   *
   * @param data 表单数据
   * @returns 保存结果
   */
  itemInsert(data: DictItemForm): Promise<Response<unknown>> {
    return request({
      url: '/system/dict/itemInsert',
      method: 'post',
      data
    })
  },

  /**
   * 删除字典项（支持单条/批量）
   *
   * @param ids 单个主键或主键数组
   * @returns 删除结果
   */
  itemDelete(ids: number | number[]): Promise<Response<unknown>> {
    return request({
      url: '/system/dict/itemDelete',
      method: 'post',
      data: Array.isArray(ids) ? ids : [ids]
    })
  },

  /**
   * 更新字典项
   *
   * @param data 表单数据（含主键）
   * @returns 保存结果
   */
  itemUpdate(data: DictItemForm): Promise<Response<unknown>> {
    return request({
      url: '/system/dict/itemUpdate',
      method: 'post',
      data
    })
  }
}
