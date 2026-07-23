/**
 * 通用校验工具模块（validate.js）
 *
 * 职责：
 *   - 提供一组纯函数式的字符串/URL/类型校验工具，供表单验证、路由守卫、
 *     工具函数等场景复用。
 *   - 所有函数均无副作用，输入确定时输出确定（纯函数）。
 *   - 包含：路径模式匹配、空值判断、URL 协议检测、外链判断、
 *     用户名/URL/邮箱/大小写字母/类型校验等。
 *
 * 典型用法：
 *   import { isExternal, validEmail, isEmpty } from '@/utils/validate'
 *   if (isExternal(url)) { window.open(url) }
 *   if (!validEmail(email)) { showError('邮箱格式不正确') }
 */

/**
 * 路径模式匹配器（支持 glob 风格通配符）
 *
 * 支持的通配符：
 *   - *   匹配单级路径中任意字符（不跨越 /）
 *   - **  匹配任意层级路径（跨越 /）
 *   - ?   匹配单级路径中的单个字符
 *
 * @param {string} pattern - 含通配符的路径模式，支持 * / ** / ? 通配符
 * @param {string} path    - 待匹配的实际路径字符串
 * @returns {boolean} 路径与模式匹配时返回 true
 */
export function isPathMatch(pattern, path) {
  const regexPattern = pattern
    .replace(/([.+^${}()|\[\]\\])/g, '\\$1') // 转义正则元字符
    .replace(/\*\*/g, '__DOUBLE_STAR__')        // 临时占位，避免被单 * 规则覆盖
    .replace(/\*/g, '[^/]*')                    // 单 * 匹配单级路径段中任意字符
    .replace(/__DOUBLE_STAR__/g, '.*')          // ** 匹配任意字符（含 /）
    .replace(/\?/g, '[^/]')                     // ? 匹配单个非 / 字符
  const regex = new RegExp(`^${regexPattern}$`)
  return regex.test(path)
}

/**
 * 判断值是否为空（null / 空字符串 / undefined）
 *
 * @param {*} value - 待检测的值
 * @returns {boolean} 为空时返回 true
 */
export function isEmpty(value) {
  if (value == null || value == "" || value == undefined || value == "undefined") {
    return true
  }
  return false
}

/**
 * 判断 URL 是否使用 http 或 https 协议
 *
 * @param {string} url - 待检测的 URL 字符串
 * @returns {boolean} 包含 http:// 或 https:// 时返回 true
 */
export function isHttp(url) {
  return url.indexOf('http://') !== -1 || url.indexOf('https://') !== -1
}

/**
 * 判断路径是否为外链（http/https/mailto/tel 协议）
 *    - 通常用于路由守卫或菜单渲染时区分内部路由与外部链接。
 *
 * @param {string} path - 待检测的路径字符串
 * @returns {boolean} 为外链时返回 true
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/*export function validUsername(str) {
  // 校验用户名是否在白名单中
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}*/

/**
 * 校验字符串是否全为小写字母（a-z）
 *
 * @param {string} str - 待校验字符串
 * @returns {boolean} 全为小写字母时返回 true
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * 校验字符串是否全为大写字母（A-Z）
 *
 * @param {string} str - 待校验字符串
 * @returns {boolean} 全为大写字母时返回 true
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * 校验字符串是否只包含英文字母（大小写均可）
 *
 * @param {string} str - 待校验字符串
 * @returns {boolean} 只含英文字母时返回 true
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * 校验邮箱地址格式
 *
 * @param {string} email - 待校验的邮箱字符串
 * @returns {boolean} 格式合法时返回 true
 */
export function validEmail(email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * 判断值是否为字符串类型（原始类型或 String 包装对象均可）
 *
 * @param {*} str - 待检测的值
 * @returns {boolean} 为字符串时返回 true
 */
export function isString(str) {
  return typeof str === 'string' || str instanceof String
}

/**
 * 判断值是否为数组类型
 *
 * 优先使用原生 Array.isArray，降级使用 Object.prototype.toString 兼容旧环境。
 *
 * @param {*} arg - 待检测的值
 * @returns {boolean} 为数组时返回 true
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}
