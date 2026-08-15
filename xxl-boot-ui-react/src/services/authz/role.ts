/**
 * 名称：角色管理 API
 * 能力：提供角色分页、增删改、角色-资源授权相关接口。
 */
import { request } from '@/utils/request';

/**
 * 分页查询角色列表。
 * @param params 查询参数（current/pageSize/name/status）
 */
export async function listRole(params: {
  current?: number;
  pageSize?: number;
  name?: string;
  status?: number;
}) {
  const { current = 1, pageSize = 10, ...rest } = params || {};
  return request<API.Response<API.PageModel<API.Role>>>('/authz/role/pageList', {
    method: 'GET',
    params: {
      offset: (current - 1) * pageSize,
      pagesize: pageSize,
      ...rest,
    },
  });
}

/**
 * 加载角色详情。
 * @param id 角色 ID
 */
export async function getRole(id: number) {
  return request<API.Response<API.Role>>('/authz/role/load', {
    method: 'GET',
    params: { id },
  });
}

/**
 * 新增角色（后端以请求参数绑定实体）。
 * @param data 角色数据
 */
export async function addRole(data: API.Role) {
  return request<API.Response<number>>('/authz/role/insert', {
    method: 'POST',
    params: data,
  });
}

/**
 * 修改角色（后端以请求参数绑定实体）。
 * @param data 角色数据
 */
export async function updateRole(data: API.Role) {
  return request<API.Response<unknown>>('/authz/role/update', {
    method: 'POST',
    params: data,
  });
}

/**
 * 删除角色。
 * @param ids 角色 ID 数组
 */
export async function delRole(ids: number[]) {
  return request<API.Response<unknown>>('/authz/role/delete', {
    method: 'POST',
    params: { 'ids[]': ids },
  });
}

/**
 * 加载角色已授权的资源 ID 列表。
 * @param roleId 角色 ID
 */
export async function roleMenuTreeselect(roleId: number) {
  return request<API.Response<number[]>>('/authz/role/loadRoleRes', {
    method: 'GET',
    params: { roleId },
  });
}

/**
 * 更新角色资源授权。
 * @param roleId      角色 ID
 * @param resourceIds 资源 ID 数组
 */
export async function updateRoleRes(roleId: number, resourceIds: number[]) {
  return request<API.Response<unknown>>('/authz/role/updateRoleRes', {
    method: 'POST',
    params: { roleId, 'resourceIds[]': resourceIds },
  });
}
