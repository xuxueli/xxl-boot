/**
 * @fileoverview User API
 * @description 用户管理接口，方法名与后端 UserController 对齐
 * @author xuxueli 2026-11-21
 */
import { request } from '@/utils/request';

/** 用户 API，调用方式：userApi.pageList(...) */
export const userApi = {
  /**
   * 分页查询用户
   *
   * @param params 分页与查询条件（current/pageSize/username/status/orgIds）
   * @returns 用户分页结果
   */
  pageList(params: {
    current?: number;
    pageSize?: number;
    username?: string;
    status?: number;
    orgIds?: number[];
  }) {
    const { current = 1, pageSize = 10, ...rest } = params || {};
    return request<API.Response<API.PageModel<API.User>>>(
      '/authz/user/pageList',
      {
        method: 'GET',
        params: {
          offset: (current - 1) * pageSize,
          pagesize: pageSize,
          ...rest,
          orgIds: rest.orgIds?.length ? rest.orgIds.join(',') : undefined,
        },
      },
    );
  },

  /**
   * 新增用户（后端以请求参数绑定实体）
   *
   * @param data 用户数据
   * @returns 保存结果
   */
  add(data: API.User) {
    return request<API.Response<unknown>>('/authz/user/add', {
      method: 'POST',
      data,
    });
  },

  /**
   * 更新用户（后端以请求参数绑定实体）
   *
   * @param data 用户数据（含主键）
   * @returns 保存结果
   */
  update(data: API.User) {
    return request<API.Response<unknown>>('/authz/user/update', {
      method: 'POST',
      data,
    });
  },

  /**
   * 删除用户（支持单条/批量）
   *
   * @param ids 用户主键或主键数组
   * @returns 删除结果
   */
  delete(ids: number | number[]) {
    return request<API.Response<unknown>>('/authz/user/delete', {
      method: 'POST',
      data: Array.isArray(ids) ? ids : [ids],
    });
  },

  /**
   * 修改当前登录用户密码
   *
   * @param oldPassword 旧密码
   * @param newPassword 新密码
   * @returns 修改结果
   */
  updatePwd(oldPassword: string, newPassword: string) {
    return request<API.Response<unknown>>('/authz/user/updatePwd', {
      method: 'POST',
      params: { oldPassword, newPassword },
    });
  },

  /**
   * 查询个人中心信息
   *
   * @returns 当前登录用户信息
   */
  loadProfile() {
    return request<API.Response<API.User>>('/authz/user/loadProfile', {
      method: 'GET',
    });
  },

  /**
   * 更新个人中心信息
   *
   * @param data 用户资料数据
   * @returns 保存结果
   */
  updateProfile(data: API.User) {
    return request<API.Response<unknown>>('/authz/user/updateProfile', {
      method: 'POST',
      data,
    });
  },
};
