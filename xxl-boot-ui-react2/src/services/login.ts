/**
 * 名称：登录认证 & 路由 API
 * 能力：提供登录、退出、验证码、当前用户信息、获取动态路由等认证相关接口。
 */
import { request } from '@/utils/request';

/**
 * 用户登录。
 * @param username      用户名
 * @param password      密码
 * @param captchaUuid   验证码标识
 * @param captchaResult 验证码
 * @returns 登录成功返回 token（response.data）
 */
export async function login(
  username: string,
  password: string,
  captchaUuid?: string,
  captchaResult?: string,
) {
  const data = {
    username,
    password,
    captchaUuid,
    captchaResult,
  };
  return request<API.Response<string>>('/auth/login', {
    headers: { isToken: false, repeatSubmit: false },
    method: 'POST',
    data,
  });
}

/**
 * 获取当前登录用户信息。
 * @returns 用户详情（含角色、权限集合）
 */
export async function getInfo() {
  return request<API.Response<API.LoginInfo>>('/auth/loginCheck', {
    method: 'GET',
    headers: { skipErrorHandler: true },
  });
}

/**
 * 用户退出登录。
 * @returns 退出结果
 */
export async function logout() {
  return request<API.Response<unknown>>('/auth/logout', {
    method: 'POST',
  });
}

/**
 * 获取登录验证码。
 * @returns 验证码开关、图片与标识
 */
export async function getCodeImg() {
  return request<API.Response<API.CaptchaData>>('/auth/captcha', {
    headers: { isToken: false },
    method: 'GET',
    timeout: 20000,
  });
}

/**
 * 获取当前用户路由配置。
 * @returns 路由树数据
 */
export async function getRouters() {
  return request<API.Response<API.RouterVo[]>>('/getRouters', {
    method: 'GET',
  });
}
