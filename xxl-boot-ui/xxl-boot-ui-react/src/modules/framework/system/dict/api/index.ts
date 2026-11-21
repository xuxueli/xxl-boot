/**
 * @fileoverview Dict API
 * @description 字典类型、字典项与枚举加载接口，方法名与后端 DictController 对齐
 * @author xuxueli 2026-11-21
 */
import { request } from '@/utils/request';

/** 字典 API，调用方式：dictApi.pageList(...) */
export const dictApi = {
  /**
   * 分页查询字典类型
   *
   * @param params 分页与查询条件（current/pageSize/name/type/status）
   * @returns 字典类型分页结果
   */
  pageList(params: {
    current?: number;
    pageSize?: number;
    name?: string;
    type?: string;
    status?: number;
  }) {
    const { current = 1, pageSize = 10, ...rest } = params || {};
    return request<API.Response<API.PageModel<API.Dict>>>(
      '/system/dict/pageList',
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
   * 查询字典类型详情
   *
   * @param id 字典类型主键
   * @returns 字典类型详情
   */
  load(id: number) {
    return request<API.Response<API.Dict>>('/system/dict/load', {
      method: 'GET',
      params: { id },
    });
  },

  /**
   * 新增字典类型
   *
   * @param data 字典类型数据
   * @returns 保存结果
   */
  insert(data: API.Dict) {
    return request<API.Response<unknown>>('/system/dict/insert', {
      method: 'POST',
      data,
    });
  },

  /**
   * 删除字典类型（支持单条/批量）
   *
   * @param ids 字典类型主键或主键数组
   * @returns 删除结果
   */
  delete(ids: number | number[]) {
    return request<API.Response<unknown>>('/system/dict/delete', {
      method: 'POST',
      data: Array.isArray(ids) ? ids : [ids],
    });
  },

  /**
   * 更新字典类型
   *
   * @param data 字典类型数据（含主键）
   * @returns 保存结果
   */
  update(data: API.Dict) {
    return request<API.Response<unknown>>('/system/dict/update', {
      method: 'POST',
      data,
    });
  },

  /**
   * 分页查询字典项
   *
   * @param params 分页与查询条件（current/pageSize/dictId/name/status）
   * @returns 字典项分页结果
   */
  itemPageList(params: {
    current?: number;
    pageSize?: number;
    dictId?: number;
    name?: string;
    status?: number;
  }) {
    const { current = 1, pageSize = 10, ...rest } = params || {};
    const query: Record<string, unknown> = {
      offset: (current - 1) * pageSize,
      pagesize: pageSize,
    };
    if (rest.dictId != null) {
      query.dictId = rest.dictId;
    }
    if (rest.name != null && rest.name !== '') {
      query.name = rest.name;
    }
    if (rest.status != null && rest.status !== -1) {
      query.status = rest.status;
    }
    return request<API.Response<API.PageModel<API.DictItem>>>(
      '/system/dict/itemPageList',
      {
        method: 'GET',
        params: query,
      },
    );
  },

  /**
   * 查询字典项详情
   *
   * @param id 字典项主键
   * @returns 字典项详情
   */
  itemLoad(id: number) {
    return request<API.Response<API.DictItem>>('/system/dict/itemLoad', {
      method: 'GET',
      params: { id },
    });
  },

  /**
   * 新增字典项
   *
   * @param data 字典项数据
   * @returns 保存结果
   */
  itemInsert(data: API.DictItem) {
    return request<API.Response<unknown>>('/system/dict/itemInsert', {
      method: 'POST',
      data,
    });
  },

  /**
   * 删除字典项（支持单条/批量）
   *
   * @param ids 字典项主键或主键数组
   * @returns 删除结果
   */
  itemDelete(ids: number | number[]) {
    return request<API.Response<unknown>>('/system/dict/itemDelete', {
      method: 'POST',
      data: Array.isArray(ids) ? ids : [ids],
    });
  },

  /**
   * 更新字典项
   *
   * @param data 字典项数据（含主键）
   * @returns 保存结果
   */
  itemUpdate(data: API.DictItem) {
    return request<API.Response<unknown>>('/system/dict/itemUpdate', {
      method: 'POST',
      data,
    });
  },

  /**
   * 查询全部字典类型（下拉用）
   *
   * @returns 字典类型列表
   */
  queryDictList() {
    return request<API.Response<API.Dict[]>>('/system/dict/queryDictList', {
      method: 'GET',
    });
  },

  /**
   * 按字典标识查询字典项（下拉用）
   *
   * @param type 字典标识
   * @returns 字典项列表
   */
  loadDictItem(type: string) {
    return request<API.Response<API.DictItemOption[]>>(
      '/system/dict/loadDictItem',
      {
        method: 'GET',
        params: { type },
      },
    );
  },

  /**
   * 查询后端枚举项（下拉用）
   *
   * @param enumName 枚举类名，如 UserStatuEnum
   * @returns 枚举项列表
   */
  loadEnumItem(enumName: string) {
    return request<API.Response<API.EnumItem[]>>('/system/dict/loadEnumItem', {
      method: 'GET',
      params: { enumName },
    });
  },
};
