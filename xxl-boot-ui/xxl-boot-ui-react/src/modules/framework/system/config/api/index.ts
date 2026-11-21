/**
 * @fileoverview Config API
 * @description 系统配置接口，方法名与后端 ConfigController 对齐
 * @author xuxueli 2026-11-21
 */
import { request } from '@/utils/request';

/** 配置 API，调用方式：configApi.pageList(...) */
export const configApi = {
  /**
   * 分页查询配置
   *
   * @param params 分页与查询条件（current/pageSize/name/key/status）
   * @returns 配置分页结果
   */
  pageList(params: {
    current?: number;
    pageSize?: number;
    name?: string;
    key?: string;
    status?: number;
  }) {
    const { current = 1, pageSize = 10, ...rest } = params || {};
    return request<API.Response<API.PageModel<API.Config>>>(
      '/system/config/pageList',
      {
        method: 'GET',
        params: {
          offset: (current - 1) * pageSize,
          pagesize: pageSize,
          ...rest,
        },
      },
    );
  },

  /**
   * 查询配置详情
   *
   * @param id 配置主键
   * @returns 配置详情
   */
  load(id: number) {
    return request<API.Response<API.Config>>('/system/config/load', {
      method: 'GET',
      params: { id },
    });
  },

  /**
   * 按配置 Key 查询配置
   *
   * @param key 配置 Key
   * @returns 配置详情
   */
  loadByKey(key: string) {
    return request<API.Response<API.Config>>('/system/config/loadByKey', {
      method: 'GET',
      params: { key },
    });
  },

  /**
   * 新增配置
   *
   * @param data 配置数据
   * @returns 保存结果
   */
  insert(data: API.Config) {
    return request<API.Response<unknown>>('/system/config/insert', {
      method: 'POST',
      data,
    });
  },

  /**
   * 删除配置（支持单条/批量）
   *
   * @param ids 配置主键或主键数组
   * @returns 删除结果
   */
  delete(ids: number | number[]) {
    return request<API.Response<unknown>>('/system/config/delete', {
      method: 'POST',
      data: Array.isArray(ids) ? ids : [ids],
    });
  },

  /**
   * 更新配置
   *
   * @param data 配置数据（含主键）
   * @returns 保存结果
   */
  update(data: API.Config) {
    return request<API.Response<unknown>>('/system/config/update', {
      method: 'POST',
      data,
    });
  },
};
