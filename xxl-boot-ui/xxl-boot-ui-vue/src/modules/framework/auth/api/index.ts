/**
 * @fileoverview Auth API
 * @description 登录认证与基础配置接口，方法名与后端 Controller 对齐
 * @author xuxueli 2026-11-21
 */
import { request } from '@/utils/request'
import type { BaseConfig, CaptchaData } from '../types'
import type { LoginInfo, MenuNode, Response } from '@/types'

/** 认证 API，调用方式：authApi.login(...) */
export const authApi = {
  /**
   * 用户登录
   *
   * @param username 用户名
   * @param password 密码
   * @param captchaUuid 验证码标识
   * @param captchaResult 验证码
   * @returns 登录 token
   */
  login(username: string, password: string, captchaUuid?: string, captchaResult?: string): Promise<Response<string>> {
    return request({
      url: '/auth/login',
      headers: {
        isToken: false,
        repeatSubmit: false
      },
      method: 'post',
      data: { username, password, captchaUuid, captchaResult }
    })
  },

  /**
   * 查询当前登录用户信息
   *
   * @returns 用户详情（含角色、权限集合）
   */
  loginCheck(): Promise<Response<LoginInfo>> {
    return request({
      url: '/auth/loginCheck',
      method: 'get'
    })
  },

  /**
   * 退出登录
   *
   * @returns 退出结果
   */
  logout(): Promise<Response<unknown>> {
    return request({
      url: '/auth/logout',
      method: 'post'
    })
  },

  /**
   * 获取登录验证码
   *
   * @returns 验证码开关、图片与标识
   */
  captcha(): Promise<Response<CaptchaData>> {
    return request({
      url: '/auth/captcha',
      headers: {
        isToken: false
      },
      method: 'get',
      timeout: 20000
    })
  },

  /**
   * 查询当前用户菜单树
   *
   * @returns 菜单数据
   */
  getMenus(): Promise<Response<MenuNode[]>> {
    return request({
      url: '/getMenus',
      method: 'get'
    })
  },

  /**
   * 加载系统基础配置（界面语言、登录验证码开关）
   *
   * @returns 基础配置数据
   */
  loadBaseConfig(): Promise<Response<BaseConfig>> {
    return request({
      url: '/loadBaseConfig',
      headers: {
        isToken: false
      },
      method: 'get'
    })
  }
}
