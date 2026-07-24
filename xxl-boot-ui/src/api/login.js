import request from '@/utils/request'

/**
 * 名称：登录认证 & 路由 API
 * 能力：提供登录、退出、验证码、当前用户信息、获取动态路由等认证相关接口。
 */

/**
 * 用户登录。
 * @param {string} username 用户名。
 * @param {string} password 密码。
 * @param {string} code 验证码。
 * @param {string} uuid 验证码标识。
 * @returns {Promise<any>} 登录结果。
 */
export function login(username, password, code, uuid) {
  const data = {
    username,
    password,
    code,
    uuid
  }
  return request({
    url: '/login',
    headers: {
      isToken: false,
      repeatSubmit: false
    },
    method: 'post',
    data: data
  })
}

/** 注册账号。 */
/*export function register(data) {
  return request({
    url: '/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}*/

/**
 * 获取当前登录用户信息。
 * @returns {Promise<any>} 用户详情。
 */
export function getInfo() {
  return request({
    url: '/getInfo',
    method: 'get'
  })
}

/** 解锁屏幕。 */
/*export function unlockScreen(password) {
  return request({
    url: '/unlockscreen',
    method: 'post',
    data: { password }
  })
}*/

/**
 * 用户退出登录。
 * @returns {Promise<any>} 退出结果。
 */
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

/**
 * 获取登录验证码。
 * @returns {Promise<any>} 验证码图片与标识。
 */
export function getCodeImg() {
  return request({
    url: '/captchaImage',
    headers: {
      isToken: false
    },
    method: 'get',
    timeout: 20000
  })
}

/**
 * 获取当前用户路由配置。
 * @returns {Promise<any>} 路由树数据。
 */
export const getRouters = () => {
  return request({
    url: '/getRouters',
    method: 'get'
  })
}
