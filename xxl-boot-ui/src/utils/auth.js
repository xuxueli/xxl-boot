/**
 * 认证令牌工具模块（auth.js）
 *
 * 职责：
 *   - 以 Cookie 为载体，统一管理前端认证令牌（Token）的读、写、删操作。
 *   - 解耦业务代码与具体存储方案：业务层只调用本模块，不直接操作 Cookie。
 *   - 令牌键名统一为 TOKEN_KEY_LOCAL，便于后续调整存储位置或 key 名称。
 *
 * 依赖：
 *   - js-cookie：轻量级 Cookie 读写库。
 *
 * 典型用法：
 *   import { getToken, setToken, removeToken } from '@/utils/auth'
 *   setToken(res.token)        // 登录成功后保存 token
 *   getToken()                 // 请求拦截器中读取 token
 *   removeToken()              // 退出登录时清除 token
 */
import Cookies from 'js-cookie'

// 认证令牌：Cookie 中存储的键名
const TOKEN_KEY_LOCAL = 'Admin-Token'

// 认证令牌：Header 中传参key
const TOKEN_KEY_HEADER = 'xxl_sso_token';

/**
 * 读取当前认证令牌
 *
 * @returns {string|undefined} Cookie 中存储的 token 字符串；未登录或已过期时返回 undefined
 */
export function getToken() {
  return Cookies.get(TOKEN_KEY_LOCAL)
}

/**
 * 获取 认证令牌 的 header key
 *
 * @returns {string}
 */
export function getTokenKeyHeader() {
  return TOKEN_KEY_HEADER;
}

/**
 * 获取认证请求头
 *
 * 返回 { <tokenKey>: <token> } 对象，供 el-upload 等组件使用。
 * 集中管理，避免各处重复拼接。
 */
export function getAuthHeaders() {
  return { [getTokenKeyHeader()]: getToken() }
}

/**
 * 写入认证令牌
 *
 * 登录成功后由用户 store 调用，将服务端下发的 token 持久化到 Cookie，
 * 后续请求拦截器会自动从 Cookie 中读取并附加到请求头。
 *
 * @param {string} token - 服务端下发的认证令牌字符串
 * @returns {string|undefined} js-cookie set 的返回值
 */
export function setToken(token) {
  return Cookies.set(TOKEN_KEY_LOCAL, token)
}
export function setTokenWithAge(token, age) {
  return Cookies.set(TOKEN_KEY_LOCAL, token, { expires: age })
}

/**
 * 删除认证令牌
 *
 * 退出登录或会话失效时调用，清除 Cookie 中的 token，
 * 确保后续请求不再携带失效凭证。
 *
 * @returns {undefined}
 */
export function removeToken() {
  return Cookies.remove(TOKEN_KEY_LOCAL)
}
