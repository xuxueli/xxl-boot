/**
 * @fileoverview Role API
 * @description 角色管理接口，方法名与后端 RoleController 对齐
 * @author xuxueli 2026-11-21
 */
import { request } from '@/utils/request'
import type { Role, RoleForm, RoleListQuery } from '../types'
import type { PageModel, Response } from '@/types'

/** 角色 API，调用方式：roleApi.pageList(...) */
export const roleApi = {
  /**
   * 分页查询角色
   *
   * @param query 分页与查询条件（offset/pagesize 形态）
   * @returns 角色分页结果
   */
  pageList(query: RoleListQuery): Promise<Response<PageModel<Role>>> {
    return request({
      url: '/authz/role/pageList',
      method: 'get',
      params: query
    })
  },

  /**
   * 查询角色详情
   *
   * @param id 角色主键
   * @returns 角色详情
   */
  load(id: number): Promise<Response<Role>> {
    return request({
      url: '/authz/role/load',
      method: 'get',
      params: { id }
    })
  },

  /**
   * 查询角色已授权的资源主键
   *
   * @param roleId 角色主键
   * @returns 资源主键列表
   */
  loadRoleRes(roleId: number): Promise<Response<number[]>> {
    return request({
      url: '/authz/role/loadRoleRes',
      method: 'get',
      params: { roleId }
    })
  },

  /**
   * 更新角色资源授权
   *
   * @param roleId 角色主键
   * @param resourceIds 资源主键列表
   * @returns 保存结果
   */
  updateRoleRes(roleId: number, resourceIds: number[]): Promise<Response<unknown>> {
    return request({
      url: '/authz/role/updateRoleRes',
      method: 'post',
      data: { roleId, resourceIds }
    })
  },

  /**
   * 新增角色
   *
   * @param data 角色表单数据
   * @returns 新角色主键（用于继续保存菜单权限）
   */
  insert(data: RoleForm): Promise<Response<number>> {
    return request({
      url: '/authz/role/insert',
      method: 'post',
      data
    })
  },

  /**
   * 删除角色（支持单条/批量）
   *
   * @param ids 单个主键或主键数组
   * @returns 删除结果
   */
  delete(ids: number | number[]): Promise<Response<unknown>> {
    return request({
      url: '/authz/role/delete',
      method: 'post',
      data: Array.isArray(ids) ? ids : [ids]
    })
  },

  /**
   * 更新角色
   *
   * @param data 角色表单数据（含主键）
   * @returns 保存结果
   */
  update(data: RoleForm): Promise<Response<unknown>> {
    return request({
      url: '/authz/role/update',
      method: 'post',
      data
    })
  }
}
