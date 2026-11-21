/**
 * @fileoverview User API
 * @description 用户管理接口，方法名与后端 UserController 对齐
 * @author xuxueli 2026-11-21
 */
import { request } from '@/utils/request'
import type { User, UserForm, UserListQuery } from '../types'
import type { PageModel, Response } from '@/types'

/** 用户 API，调用方式：userApi.pageList(...) */
export const userApi = {
  /**
   * 分页查询用户
   *
   * @param query 分页与查询条件（offset/pagesize 形态，orgIds 为逗号分隔字符串）
   * @returns 用户分页结果
   */
  pageList(query: UserListQuery): Promise<Response<PageModel<User>>> {
    return request({
      url: '/authz/user/pageList',
      method: 'get',
      params: query
    })
  },

  /**
   * 修改当前登录用户密码
   *
   * @param oldPassword 旧密码
   * @param newPassword 新密码
   * @returns 修改结果
   */
  updatePwd(oldPassword: string, newPassword: string): Promise<Response<unknown>> {
    return request({
      url: '/authz/user/updatePwd',
      method: 'post',
      params: { oldPassword, newPassword }
    })
  },

  /**
   * 查询个人中心信息
   *
   * @returns 当前登录用户信息
   */
  loadProfile(): Promise<Response<User>> {
    return request({
      url: '/authz/user/loadProfile',
      method: 'get'
    })
  },

  /**
   * 更新个人中心信息
   *
   * @param data 用户资料数据
   * @returns 保存结果
   */
  updateProfile(data: User): Promise<Response<unknown>> {
    return request({
      url: '/authz/user/updateProfile',
      method: 'post',
      data
    })
  },

  /**
   * 新增用户
   *
   * @param data 用户表单数据
   * @returns 保存结果
   */
  add(data: UserForm): Promise<Response<unknown>> {
    return request({
      url: '/authz/user/add',
      method: 'post',
      data
    })
  },

  /**
   * 删除用户（支持单条/批量）
   *
   * @param ids 单个主键或主键数组
   * @returns 删除结果
   */
  delete(ids: number | number[]): Promise<Response<unknown>> {
    return request({
      url: '/authz/user/delete',
      method: 'post',
      data: Array.isArray(ids) ? ids : [ids]
    })
  },

  /**
   * 更新用户
   *
   * @param data 用户表单数据（含主键）
   * @returns 保存结果
   */
  update(data: UserForm): Promise<Response<unknown>> {
    return request({
      url: '/authz/user/update',
      method: 'post',
      data
    })
  }
}
