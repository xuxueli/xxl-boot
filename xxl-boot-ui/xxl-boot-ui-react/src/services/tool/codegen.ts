/**
 * 名称：代码生成 API
 * 能力：提供代码生成表分页、详情、更新、删除、建表、预览、生成接口。
 */
import { request } from '@/utils/request';

/**
 * 分页查询代码生成表列表。
 * @param params 查询参数（current/pageSize/tableName/tableComment）
 */
export async function listTable(params: {
  current?: number;
  pageSize?: number;
  tableName?: string;
  tableComment?: string;
}) {
  const { current = 1, pageSize = 10, ...rest } = params || {};
  // 注意：codegen 分页参数名为 pageSize（后端固定）
  return request<API.Response<API.PageModel<API.Codegen>>>(
    '/tool/codegen/pageList',
    {
      method: 'GET',
      params: {
        offset: (current - 1) * pageSize,
        pageSize,
        ...rest,
      },
    },
  );
}

/**
 * 加载代码生成表详情（含字段列表）。
 * @param id 表 ID
 */
export async function getGenTable(id: number) {
  return request<API.Response<API.Codegen>>('/tool/codegen/detail', {
    method: 'GET',
    params: { id },
  });
}

/**
 * 更新代码生成表（含字段列表）。
 * @param data 表数据（含 fieldList）
 */
export async function updateGenTable(data: API.Codegen) {
  return request<API.Response<unknown>>('/tool/codegen/update', {
    method: 'POST',
    data,
  });
}

/**
 * 创建数据表。
 * @param tableSql 建表 SQL
 * @param tplWebType 前端模板类型（antd-typescript / element-plus-typescript）
 */
export async function createTable(tableSql: string, tplWebType: string) {
  return request<API.Response<unknown>>('/tool/codegen/createTable', {
    method: 'POST',
    params: { tableSql, tplWebType },
  });
}

/**
 * 预览生成代码。
 * @param id 表 ID
 */
export async function previewTable(id: number) {
  return request<API.Response<Record<string, string>>>('/tool/codegen/preview', {
    method: 'GET',
    params: { id },
  });
}

/**
 * 删除代码生成表。
 * @param ids 表 ID 数组
 */
export async function delTable(ids: number[]) {
  return request<API.Response<unknown>>('/tool/codegen/delete', {
    method: 'POST',
    params: { ids },
  });
}
