/**
 * @fileoverview Org API
 * @description 组织管理接口，方法名与后端 OrgController 对齐
 * @author xuxueli 2026-11-21
 */
import { request } from '@/utils/request';

/** 组织 API，调用方式：orgApi.treeList(...) */
export const orgApi = {
  /**
   * 查询组织树列表
   *
   * @param query 查询条件（name/status），status 默认 -1 表示全部
   * @returns 组织树
   */
  treeList(query: API.OrgQuery) {
    return request<API.Response<API.Org[]>>('/authz/org/treeList', {
      method: 'GET',
      params: { status: -1, ...query },
    });
  },

  /**
   * 查询组织详情
   *
   * @param id 组织主键
   * @returns 组织详情
   */
  load(id: number) {
    return request<API.Response<API.Org>>('/authz/org/load', {
      method: 'GET',
      params: { id },
    });
  },

  /**
   * 更新组织排序
   *
   * @param ids 组织主键数组
   * @param orders 排序值数组
   * @returns 保存结果
   */
  updateSort(ids: number[], orders: number[]) {
    return request<API.Response<unknown>>('/authz/org/updateSort', {
      method: 'POST',
      data: { ids, orders },
    });
  },

  /**
   * 新增组织
   *
   * @param data 组织表单数据
   * @returns 保存结果
   */
  insert(data: API.OrgForm) {
    return request<API.Response<unknown>>('/authz/org/insert', {
      method: 'POST',
      data,
    });
  },

  /**
   * 删除组织（支持单条/批量）
   *
   * @param ids 组织主键或主键数组
   * @returns 删除结果
   */
  delete(ids: number | number[]) {
    return request<API.Response<unknown>>('/authz/org/delete', {
      method: 'POST',
      data: Array.isArray(ids) ? ids : [ids],
    });
  },

  /**
   * 更新组织
   *
   * @param data 组织表单数据（含主键）
   * @returns 保存结果
   */
  update(data: API.OrgForm) {
    return request<API.Response<unknown>>('/authz/org/update', {
      method: 'POST',
      data,
    });
  },
};
