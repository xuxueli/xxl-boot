/**
 * @fileoverview Resource API
 * @description 资源（菜单/按钮）管理接口，方法名与后端 ResourceController 对齐
 * @author xuxueli 2026-11-21
 */
import { request } from '@/utils/request';

/** 资源 API，调用方式：resourceApi.treeList(...) */
export const resourceApi = {
  /**
   * 查询资源树列表
   *
   * @param query 查询条件（name/status），status 默认 -1 表示全部
   * @returns 资源树
   */
  treeList(query: API.ResourceQuery) {
    return request<API.Response<API.Resource[]>>('/authz/resource/treeList', {
      method: 'GET',
      params: { status: -1, ...query },
    });
  },

  /**
   * 查询资源详情
   *
   * @param id 资源主键
   * @returns 资源详情
   */
  load(id: number) {
    return request<API.Response<API.Resource>>('/authz/resource/load', {
      method: 'GET',
      params: { id },
    });
  },

  /**
   * 更新资源排序
   *
   * @param ids 资源主键数组
   * @param orders 排序值数组
   * @returns 保存结果
   */
  updateSort(ids: number[], orders: number[]) {
    return request<API.Response<unknown>>('/authz/resource/updateSort', {
      method: 'POST',
      data: { ids, orders },
    });
  },

  /**
   * 新增资源
   *
   * @param data 资源表单数据
   * @returns 保存结果
   */
  insert(data: API.ResourceForm) {
    return request<API.Response<unknown>>('/authz/resource/insert', {
      method: 'POST',
      data,
    });
  },

  /**
   * 删除资源（支持单条/批量）
   *
   * @param ids 资源主键或主键数组
   * @returns 删除结果
   */
  delete(ids: number | number[]) {
    return request<API.Response<unknown>>('/authz/resource/delete', {
      method: 'POST',
      data: Array.isArray(ids) ? ids : [ids],
    });
  },

  /**
   * 更新资源
   *
   * @param data 资源表单数据（含主键）
   * @returns 保存结果
   */
  update(data: API.ResourceForm) {
    return request<API.Response<unknown>>('/authz/resource/update', {
      method: 'POST',
      data,
    });
  },
};
