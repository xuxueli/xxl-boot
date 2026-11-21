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
   * @param query 分页与查询条件（offset/pagesize 形态）
   * @returns 配置分页结果
   */
  pageList(query: API.ConfigListQuery) {
    return request<API.Response<API.PageModel<API.Config>>>(
      '/system/config/pageList',
      {
        method: 'GET',
        params: query,
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
   * 平台能力接口：供其他模块按 Key 读取配置，列表页本身不使用。
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
   * @param data 表单数据
   * @returns 保存结果
   */
  insert(data: API.ConfigForm) {
    return request<API.Response<unknown>>('/system/config/insert', {
      method: 'POST',
      data,
    });
  },

  /**
   * 删除配置（支持单条/批量）
   *
   * @param ids 单个主键或主键数组
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
   * @param data 表单数据
   * @returns 保存结果
   */
  update(data: API.ConfigForm) {
    return request<API.Response<unknown>>('/system/config/update', {
      method: 'POST',
      data,
    });
  },
};
