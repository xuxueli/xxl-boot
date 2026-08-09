/**
 * 名称：用户管理 API
 * 能力：提供用户列表、增删改、状态与个人中心相关接口。
 */
import { request } from '@umijs/max';

/**
 * 分页查询用户列表。
 * @param params 查询参数（current/pageSize/username/status/orgIds）
 * @returns 用户分页列表（response.data.data / response.data.total）
 */
export async function listUser(params: {
  current?: number;
  pageSize?: number;
  username?: string;
  status?: number;
  orgIds?: number[];
}) {
  const { current = 1, pageSize = 10, ...rest } = params || {};
  return request<API.Response<API.PageModel<API.User>>>('/authz/user/pageList', {
    method: 'GET',
    params: {
      offset: (current - 1) * pageSize,
      pagesize: pageSize,
      ...rest,
      orgIds: rest.orgIds?.length ? rest.orgIds.join(',') : undefined,
    },
  });
}

/**
 * 新增用户（后端以请求参数绑定实体）。
 * @param data 用户数据
 */
export async function addUser(data: API.User) {
  return request<API.Response<unknown>>('/authz/user/add', {
    method: 'POST',
    params: data,
  });
}

/**
 * 修改用户（后端以请求参数绑定实体）。
 * @param data 用户数据
 */
export async function updateUser(data: API.User) {
  return request<API.Response<unknown>>('/authz/user/update', {
    method: 'POST',
    params: data,
  });
}

/**
 * 删除用户。
 * @param ids 用户 ID 或用户 ID 数组
 */
export async function delUser(ids: number | number[]) {
  return request<API.Response<unknown>>('/authz/user/delete', {
    method: 'POST',
    params: { 'ids[]': ids },
  });
}

/**
 * 加载个人中心信息。
 * @returns 当前登录用户信息
 */
export async function getUserProfile() {
  return request<API.Response<API.User>>('/authz/user/loadProfile', {
    method: 'GET',
  });
}

/**
 * 更新个人中心信息（JSON 请求体）。
 * @param data 用户资料数据
 */
export async function updateUserProfile(data: API.User) {
  return request<API.Response<unknown>>('/authz/user/updateProfile', {
    method: 'POST',
    data,
  });
}

/**
 * 修改当前登录用户密码。
 * @param oldPassword 旧密码
 * @param newPassword 新密码
 */
export async function updateUserPwd(oldPassword: string, newPassword: string) {
  return request<API.Response<unknown>>('/authz/user/updatePwd', {
    method: 'POST',
    params: { oldPassword, newPassword },
  });
}
