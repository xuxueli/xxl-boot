import { request } from '@/utils/request'
import type { CaptchaData } from '../types'
import type { LoginInfo, MenuRoute, Response } from '@/types'

/**
 * 名称：登录认证 & 路由 API
 * 能力：提供登录、退出、验证码、当前用户信息、获取动态路由等认证相关接口。
 */

/**
 * 用户登录。
 * @param username     用户名。
 * @param password     密码。
 * @param captchaUuid  验证码标识。
 * @param captchaResult 验证码。
 * @returns 登录成功返回 token（response.data）。
 */
export function login(username: string, password: string, captchaUuid?: string, captchaResult?: string): Promise<Response<string>> {
  const data = {
    username,
    password,
    captchaUuid,
    captchaResult
  }
  return request({
    url: '/auth/login',
    headers: {
      isToken: false,
      repeatSubmit: false
    },
    method: 'post',
    data: data
  })
}

/**
 * 获取当前登录用户信息。
 * @returns 用户详情（含角色、权限集合）。
 */
export function getInfo(): Promise<Response<LoginInfo>> {
  return request({
    url: '/auth/loginCheck',
    method: 'get'
  })
}

/**
 * 用户退出登录。
 * @returns 退出结果。
 */
export function logout(): Promise<Response<unknown>> {
  return request({
    url: '/auth/logout',
    method: 'post'
  })
}

/**
 * 获取登录验证码。
 * @returns 验证码开关、图片与标识。
 */
export function getCodeImg(): Promise<Response<CaptchaData>> {
  return request({
    url: '/auth/captcha',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  })
}

/**
 * 获取当前用户路由配置。
 * @returns 路由树数据。
 */
export const getRouters = (): Promise<Response<MenuRoute[]>> => {
  return request({
    url: '/getRouters',
    method: 'get'
  })
}
