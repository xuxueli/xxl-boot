/**
 * 名称：字典管理 API
 * 能力：提供字典类型、字典项、枚举加载相关接口。
 */
import { request } from '@umijs/max';

// ==================== 字典类型 ====================

/**
 * 分页查询字典类型列表。
 * @param params 查询参数（current/pageSize/name/type/status）
 */
export async function listType(params: {
  current?: number;
  pageSize?: number;
  name?: string;
  type?: string;
  status?: number;
}) {
  const { current = 1, pageSize = 10, ...rest } = params || {};
  return request<API.Response<API.PageModel<API.Dict>>>('/system/dict/pageList', {
    method: 'GET',
    params: {
      offset: (current - 1) * pageSize,
      pagesize: pageSize,
      ...rest,
    },
  });
}

/**
 * 加载字典类型详情。
 * @param id 字典类型 ID
 */
export async function getType(id: number) {
  return request<API.Response<API.Dict>>('/system/dict/load', {
    method: 'GET',
    params: { id },
  });
}

/**
 * 新增字典类型（JSON 请求体）。
 * @param data 字典类型数据
 */
export async function addType(data: API.Dict) {
  return request<API.Response<unknown>>('/system/dict/insert', {
    method: 'POST',
    data,
  });
}

/**
 * 修改字典类型（JSON 请求体）。
 * @param data 字典类型数据
 */
export async function updateType(data: API.Dict) {
  return request<API.Response<unknown>>('/system/dict/update', {
    method: 'POST',
    data,
  });
}

/**
 * 删除字典类型。
 * @param ids 字典类型 ID 数组
 */
export async function delType(ids: number[]) {
  return request<API.Response<unknown>>('/system/dict/delete', {
    method: 'POST',
    params: { 'ids[]': ids },
  });
}

/**
 * 查询全部字典类型（用于下拉选择）。
 */
export async function queryDictList() {
  return request<API.Response<API.Dict[]>>('/system/dict/queryDictList', {
    method: 'GET',
  });
}

// ==================== 字典项 ====================

/**
 * 分页查询字典项列表。
 * @param params 查询参数（current/pageSize/dictId）
 */
export async function listData(params: {
  current?: number;
  pageSize?: number;
  dictId?: number;
}) {
  const { current = 1, pageSize = 10, ...rest } = params || {};
  const query: Record<string, any> = {
    offset: (current - 1) * pageSize,
    pagesize: pageSize,
  };
  if (rest.dictId != null) {
    query.dictId = rest.dictId;
  }
  return request<API.Response<API.PageModel<API.DictItem>>>(
    '/system/dict/itemPageList',
    {
      method: 'GET',
      params: query,
    },
  );
}

/**
 * 加载字典项详情。
 * @param id 字典项 ID
 */
export async function getData(id: number) {
  return request<API.Response<API.DictItem>>('/system/dict/itemLoad', {
    method: 'GET',
    params: { id },
  });
}

/**
 * 按字典 type 加载字典项（下拉用）。
 * @param type 字典类型
 */
export async function loadDictItem(type: string) {
  return request<API.Response<API.DictItemOption[]>>('/system/dict/loadDictItem', {
    method: 'GET',
    params: { type },
  });
}

/**
 * 新增字典项（JSON 请求体）。
 * @param data 字典项数据
 */
export async function addData(data: API.DictItem) {
  return request<API.Response<unknown>>('/system/dict/itemInsert', {
    method: 'POST',
    data,
  });
}

/**
 * 修改字典项（JSON 请求体）。
 * @param data 字典项数据
 */
export async function updateData(data: API.DictItem) {
  return request<API.Response<unknown>>('/system/dict/itemUpdate', {
    method: 'POST',
    data,
  });
}

/**
 * 删除字典项。
 * @param ids 字典项 ID 数组
 */
export async function delData(ids: number[]) {
  return request<API.Response<unknown>>('/system/dict/itemDelete', {
    method: 'POST',
    params: { 'ids[]': ids },
  });
}

/**
 * 加载后端枚举项（下拉用）。
 * @param enumName 枚举类名，如 UserStatuEnum
 */
export async function loadEnumItem(enumName: string) {
  return request<API.Response<API.EnumItem[]>>('/system/dict/loadEnumItem', {
    method: 'GET',
    params: { enumName },
  });
}
