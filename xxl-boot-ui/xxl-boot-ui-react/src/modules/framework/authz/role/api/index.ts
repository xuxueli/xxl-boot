/**
 * @fileoverview Role API
 * @description 角色管理接口，方法名与后端 RoleController 对齐
 * @author xuxueli 2026-11-21
 */
import { request } from '@/utils/request';

/** 角色 API，调用方式：roleApi.pageList(...) */
export const roleApi = {
  /**
   * 分页查询角色
   *
   * @param params 分页与查询条件（current/pageSize/name/status）
   * @returns 角色分页结果
   */
  pageList(params: {
    current?: number;
    pageSize?: number;
    name?: string;
    status?: number;
  }) {
    const { current = 1, pageSize = 10, ...rest } = params || {};
    return request<API.Response<API.PageModel<API.Role>>>(
      '/authz/role/pageList',
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
   * 新增角色（后端以请求参数绑定实体）
   *
   * @param data 角色数据
   * @returns 新增角色主键
   */
  insert(data: API.Role) {
    return request<API.Response<number>>('/authz/role/insert', {
      method: 'POST',
      data,
    });
  },

  /**
   * 删除角色（支持单条/批量）
   *
   * @param ids 角色主键或主键数组
   * @returns 删除结果
   */
  delete(ids: number | number[]) {
    return request<API.Response<unknown>>('/authz/role/delete', {
      method: 'POST',
      data: Array.isArray(ids) ? ids : [ids],
    });
  },

  /**
   * 更新角色（后端以请求参数绑定实体）
   *
   * @param data 角色数据（含主键）
   * @returns 保存结果
   */
  update(data: API.Role) {
    return request<API.Response<unknown>>('/authz/role/update', {
      method: 'POST',
      data,
    });
  },

  /**
   * 查询角色详情
   *
   * @param id 角色主键
   * @returns 角色详情
   */
  load(id: number) {
    return request<API.Response<API.Role>>('/authz/role/load', {
      method: 'GET',
      params: { id },
    });
  },

  /**
   * 查询角色已授权的资源主键列表
   *
   * @param roleId 角色主键
   * @returns 资源主键列表
   */
  loadRoleRes(roleId: number) {
    return request<API.Response<number[]>>('/authz/role/loadRoleRes', {
      method: 'GET',
      params: { roleId },
    });
  },

  /**
   * 更新角色资源授权
   *
   * @param roleId 角色主键
   * @param resourceIds 资源主键数组
   * @returns 保存结果
   */
  updateRoleRes(roleId: number, resourceIds: number[]) {
    return request<API.Response<unknown>>('/authz/role/updateRoleRes', {
      method: 'POST',
      data: { roleId, resourceIds },
    });
  },
};
